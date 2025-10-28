import mongoose from 'mongoose';
import { scrapeArticle, scraperConfigs, delay } from '../server/utils/scraper.js';
import { translateArticle } from '../server/utils/translator.js';
import { reformulateArticle, isReformulationAvailable, getReformulationStatus } from '../server/utils/reformulator.js';
import { isAllowedByRobots, getCrawlDelay } from '../server/utils/robots-checker.js';
import logger, { 
  logScrapingStart, 
  logScrapingSuccess, 
  logScrapingError,
  logTranslationStart,
  logTranslationSuccess,
  logTranslationError,
  logDatabaseSave,
  logDatabaseError,
  logCollectionSummary,
} from '../server/utils/logger.js';

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
 * @returns true if collected successfully, false if skipped (duplicate)
 * @throws Error if scraping, translation, or saving fails
 */
async function collectArticle(item: typeof articlesToScrape[0]): Promise<boolean> {
  console.log(`\n📰 Scraping: ${item.url}`);
  logScrapingStart(item.url, item.site);

  // Step 1: Check robots.txt compliance
  const allowed = await isAllowedByRobots(item.url);
  if (!allowed) {
    console.log('🚫 URL disallowed by robots.txt, skipping...');
    logger.warn('Skipping URL due to robots.txt', { url: item.url });
    return false;
  }

  // Step 2: Get recommended crawl delay
  const crawlDelay = await getCrawlDelay(item.url);
  if (crawlDelay > 0) {
    console.log(`⏱️  Respecting crawl delay: ${crawlDelay}ms`);
    await delay(crawlDelay);
  }

  // Step 3: Scrape the article
  try {
    const scrapedArticle = await scrapeArticle(item.url, scraperConfigs[item.site]);
    console.log(`✅ Scraped: ${scrapedArticle.title.substring(0, 60)}...`);
    logScrapingSuccess(item.url, scrapedArticle.title, scrapedArticle.content.length);

    // Step 4: Check if article already exists
    const existingArticle = await News.findOne({ originalUrl: item.url });
    if (existingArticle) {
      console.log('ℹ️  Article already exists, skipping...');
      logger.info('Article already exists', { url: item.url });
      return false;
    }

    // Step 5: Reformulate article if enabled (to avoid plagiarism)
    let articleToTranslate = {
      title: scrapedArticle.title,
      content: scrapedArticle.content,
    };

    if (isReformulationAvailable()) {
      console.log('🤖 Reformulating article with AI...');
      const reformulated = await reformulateArticle(
        scrapedArticle.title,
        scrapedArticle.content
      );
      console.log('✅ Reformulation completed');
      articleToTranslate = {
        title: reformulated.title,
        content: reformulated.content,
      };
    }

    // Step 6: Translate the article
    console.log('🌐 Translating article...');
    logTranslationStart(articleToTranslate.title);
    
    const translations = await translateArticle(articleToTranslate);
    console.log('✅ Translation completed');
    logTranslationSuccess(articleToTranslate.title, ['en', 'es', 'de', 'it', 'ar']);

    // Step 7: Save to database
    const savedArticle = await News.create({
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
    logDatabaseSave(savedArticle._id.toString(), item.country, item.category);
    return true;
  } catch (error) {
    logScrapingError(item.url, error instanceof Error ? error : new Error(String(error)));
    throw error;
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
    logger.info('Starting news collection', { 
      articlesCount: articlesToScrape.length,
      reformulationStatus: getReformulationStatus(),
    });
    
    connection = await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    logger.info('MongoDB connected', { uri: MONGODB_URI });

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
        logDatabaseError(error instanceof Error ? error : new Error(String(error)));
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

    logCollectionSummary({
      total: articlesToScrape.length,
      success: successCount,
      skipped: skipCount,
      errors: errorCount,
    });

    console.log('\n🎉 Collection completed!');
    logger.info('Collection completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error during collection:', error);
    logger.error('Fatal error during collection', { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  } finally {
    if (connection) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
      logger.info('MongoDB disconnected');
    }
  }
}

// Run if executed directly
// Check if this module is the main module being executed
const isMainModule = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  collectNews();
}

export { collectNews, collectArticle };
