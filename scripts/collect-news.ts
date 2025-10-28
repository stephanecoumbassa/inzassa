import mongoose from 'mongoose';
import { scrapeArticle, scraperConfigs, delay } from '../server/utils/scraper.js';
import { translateArticle } from '../server/utils/translator.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inzassa';

// Define schemas (must match server models)
const NewsSchema = new mongoose.Schema({
  title: { type: Map, of: String, required: true },
  content: { type: Map, of: String, required: true },
  summary: { type: Map, of: String, required: true },
  originalUrl: { type: String, required: true },
  country: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: String,
  publishedAt: { type: Date, default: Date.now },
  featured: { type: Boolean, default: false },
  scrapedAt: { type: Date, default: Date.now },
});

NewsSchema.index({ country: 1 });
NewsSchema.index({ category: 1 });
NewsSchema.index({ publishedAt: -1 });
NewsSchema.index({ featured: 1 });

const News = mongoose.models.News || mongoose.model('News', NewsSchema);

/**
 * List of articles to scrape
 * In production, this could come from a queue, RSS feeds, or automated discovery
 * 
 * Example format:
 * {
 *   url: 'https://www.seneweb.com/news/actualite',
 *   site: 'seneweb',
 *   country: 'senegal',
 *   category: 'politique',
 * }
 */
const articlesToScrape: Array<{
  url: string;
  site: string;
  country: string;
  category: string;
}> = [
  // Add actual article URLs here before running the script
  // Leave empty to avoid scraping invalid URLs
];

/**
 * Collect and process a single article
 * @returns true if collected successfully, false if skipped (duplicate), throws on error
 */
async function collectArticle(item: typeof articlesToScrape[0]): Promise<boolean> {
  try {
    console.log(`\n📰 Scraping: ${item.url}`);

    // Step 1: Scrape the article
    const scrapedArticle = await scrapeArticle(item.url, scraperConfigs[item.site]);
    console.log(`✅ Scraped: ${scrapedArticle.title.substring(0, 60)}...`);

    // Step 2: Check if article already exists
    const existingArticle = await News.findOne({ originalUrl: item.url });
    if (existingArticle) {
      console.log('ℹ️  Article already exists, skipping...');
      return false;
    }

    // Step 3: Translate the article
    console.log('🌐 Translating article...');
    const translations = await translateArticle({
      title: scrapedArticle.title,
      content: scrapedArticle.content,
    });
    console.log('✅ Translation completed');

    // Step 4: Save to database
    await News.create({
      title: translations.title,
      content: translations.content,
      summary: translations.summary,
      originalUrl: scrapedArticle.originalUrl,
      country: item.country,
      category: item.category,
      imageUrl: scrapedArticle.imageUrl,
      publishedAt: scrapedArticle.publishedAt || new Date(),
      featured: false,
      scrapedAt: new Date(),
    });

    console.log('💾 Article saved to database');
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${item.url}:`, error instanceof Error ? error.message : error);
    return false;
  }
}

/**
 * Main collection function
 */
async function collectNews() {
  let connection;
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    connection = await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    // Process each article
    for (const item of articlesToScrape) {
      try {
        const result = await collectArticle(item);
        
        if (result === true) {
          successCount++;
        } else {
          skipCount++;
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to process article:`, error instanceof Error ? error.message : error);
      }

      // Add delay between requests to respect rate limits
      // Recommended: 2-5 seconds between requests
      await delay(3000);
    }

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Collection Summary:');
    console.log(`   ✅ Successfully collected: ${successCount}`);
    console.log(`   ⏭️  Skipped (duplicates): ${skipCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📝 Total processed: ${articlesToScrape.length}`);
    console.log('='.repeat(50));

    console.log('\n🎉 Collection completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error during collection:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  collectNews();
}

export { collectNews, collectArticle };
