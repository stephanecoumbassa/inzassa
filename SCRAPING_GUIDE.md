# Automated News Collection - Usage Guide

This guide explains how to use the automated news collection system that scrapes articles from African news sites and translates them into multiple languages.

## Overview

The news collection system consists of three main components:

1. **Scraper** (`server/utils/scraper.ts`) - Extracts articles from news websites
2. **Translator** (`server/utils/translator.ts`) - Translates content into 6 languages (fr, en, es, de, it, ar)
3. **Collector** (`scripts/collect-news.js`) - Orchestrates scraping, translation, and database storage

## Prerequisites

- Node.js 18+
- MongoDB running locally or remotely
- Internet connection for scraping and translation

## Configuration

### Environment Variables

Add to your `.env` file:

```env
# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/inzassa

# Translation API (optional - uses public instance by default)
LIBRETRANSLATE_URL=https://libretranslate.com
```

### LibreTranslate Options

The system uses LibreTranslate, a free, open-source translation API:

1. **Public instance** (default): Uses `https://libretranslate.com`
   - No setup required
   - Rate limited
   - Best for testing

2. **Self-hosted instance**: Run your own LibreTranslate server
   ```bash
   docker run -ti --rm -p 5000:5000 libretranslate/libretranslate
   ```
   Then set: `LIBRETRANSLATE_URL=http://localhost:5000`

3. **Commercial alternative**: For production, consider:
   - Google Cloud Translation API
   - DeepL API
   - AWS Translate

## Usage

### Step 1: Configure Articles to Scrape

Edit `scripts/collect-news.js` and update the `articlesToScrape` array:

```javascript
const articlesToScrape = [
  {
    url: 'https://www.seneweb.com/article-123',
    site: 'seneweb',      // Must match a config in scraperConfigs
    country: 'senegal',    // Country code
    category: 'politique', // Category: politique, economie, sport, culture, societe, international
  },
  {
    url: 'https://www.dakaractu.com/article-456',
    site: 'dakaractu',
    country: 'senegal',
    category: 'economie',
  },
  // Add more articles...
];
```

### Step 2: Add New Site Configurations (Optional)

If you need to scrape from a new site, add a configuration to `server/utils/scraper.ts`:

```typescript
export const scraperConfigs: Record<string, ScraperConfig> = {
  // ... existing configs
  mynewsite: {
    titleSelector: 'h1.article-title',    // CSS selector for title
    contentSelector: '.article-body p',   // CSS selector for content paragraphs
    imageSelector: '.featured-img img',   // CSS selector for main image
    dateSelector: '.publish-date',        // CSS selector for date
  },
};
```

### Step 3: Run the Collection Script

```bash
node scripts/collect-news.js
```

The script will:
1. Connect to MongoDB
2. For each article:
   - Scrape the content
   - Check if it already exists (avoids duplicates)
   - Translate to all 6 languages
   - Save to database
3. Display a summary of results

### Example Output

```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB

📰 Scraping: https://www.seneweb.com/article-123
✅ Scraped: Le Sénégal accueille le Forum Économique Africain...
🌐 Translating article...
✅ Translation completed
💾 Article saved to database

📰 Scraping: https://www.dakaractu.com/article-456
✅ Scraped: Victoire historique de l'équipe nationale...
ℹ️  Article already exists, skipping...

==================================================
📊 Collection Summary:
   ✅ Successfully collected: 1
   ⏭️  Skipped (duplicates): 1
   ❌ Errors: 0
   📝 Total processed: 2
==================================================

🎉 Collection completed!
```

## Advanced Features

### Rate Limiting

The script includes automatic delays between requests:
- 3 seconds between article scrapes
- 0.5 seconds between translations

Adjust in the code if needed:

```javascript
// In collect-news.js
await delay(3000); // Change this value

// In translator.ts
await new Promise(resolve => setTimeout(resolve, 500)); // Change this value
```

### Error Handling

The system handles errors gracefully:
- Network errors: Logged and skipped
- Translation failures: Falls back to original text
- Duplicate articles: Automatically skipped

### Testing the Scraper

Test scraping without translation:

```javascript
// Create a test file: scripts/test-scraper.js
import { scrapeArticle, scraperConfigs } from '../server/utils/scraper.js';

const testUrl = 'https://www.seneweb.com/some-article';
const article = await scrapeArticle(testUrl, scraperConfigs.seneweb);
console.log('Title:', article.title);
console.log('Content length:', article.content.length);
console.log('Image:', article.imageUrl);
```

### Testing the Translator

Test translation without scraping:

```javascript
// Create a test file: scripts/test-translator.js
import { translateText } from '../server/utils/translator.js';

const text = 'Bonjour le monde';
const translated = await translateText(text, 'en', 'fr');
console.log('Original:', text);
console.log('Translated:', translated);
```

## Supported News Sites

Pre-configured scrapers are available for:

- **Seneweb** (Senegal)
- **Dakaractu** (Senegal)
- **CamerounWeb** (Cameroon)
- **Abidjan.net** (Ivory Coast)
- **Malijet** (Mali)

Add more configurations as needed!

## Best Practices

1. **Respect robots.txt**: Check each site's `robots.txt` file before scraping
2. **Rate limiting**: Keep delays between requests (2-5 seconds minimum)
3. **Source attribution**: Always include `originalUrl` in scraped articles
4. **Monitor logs**: Watch for errors and adjust selectors as sites change
5. **Start small**: Test with 1-2 articles before scaling up
6. **Verify translations**: Review translated content for quality
7. **Legal compliance**: Ensure you have permission to scrape content

## Troubleshooting

### Scraping Fails

- **Problem**: "Could not extract title from article"
- **Solution**: The CSS selectors may be wrong. Inspect the page HTML and update the selectors in `scraperConfigs`

### Translation Fails

- **Problem**: Translation returns original text
- **Solution**: 
  - Check LibreTranslate service is accessible
  - Try a self-hosted instance if public instance is down
  - Check your internet connection

### MongoDB Connection Error

- **Problem**: "Connection refused"
- **Solution**: 
  - Ensure MongoDB is running: `mongod` or `docker run mongo`
  - Check `MONGODB_URI` in `.env` file
  - Verify MongoDB is listening on the correct port

### Rate Limiting

- **Problem**: "Too many requests" or timeouts
- **Solution**: 
  - Increase delay between requests in the script
  - Use a self-hosted LibreTranslate instance
  - Reduce the number of articles processed in one batch

## Automation with Cron

To run the collection automatically, set up a cron job:

```bash
# Install PM2 for process management
npm install -g pm2

# Start the collector as a daemon (runs continuously)
pm2 start scripts/collect-news.js --name "news-collector"

# Or set up a cron job to run hourly
crontab -e
# Add: 0 * * * * cd /path/to/inzassa && node scripts/collect-news.js
```

## Next Steps

1. Build a queue system for article URLs (using Redis or MongoDB)
2. Add RSS feed parsing to discover new articles automatically
3. Implement content reformulation to avoid plagiarism
4. Add sentiment analysis or content classification
5. Create an admin interface to manage scraping tasks
6. Set up monitoring and alerting for failed scrapes

## Support

For issues or questions:
1. Check the logs for error messages
2. Review the documentation in `IMPLEMENTATION_GUIDE.md`
3. Test individual components (scraper, translator) separately
4. Ensure all dependencies are installed: `npm install`
