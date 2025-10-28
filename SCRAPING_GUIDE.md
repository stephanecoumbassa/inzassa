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

Edit `scripts/collect-news.ts` and update the `articlesToScrape` array:

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
# Using npm script (recommended)
npm run collect-news

# Or using tsx directly
npx tsx scripts/collect-news.ts
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

## Advanced Features

### 1. Winston Logging System

The system now includes professional logging with Winston:

**Features:**
- Structured JSON logs
- Separate error and combined log files
- Automatic log rotation (5MB max, 5 files)
- Console output in development
- Production-ready

**Log Files:**
- `logs/error.log` - Error level logs only
- `logs/combined.log` - All logs (info, warn, error)

**Configuration:**
```env
# Set logging level
LOG_LEVEL=info  # Options: error, warn, info, debug
```

**Usage in Code:**
```typescript
import logger from './server/utils/logger';

logger.info('Article processed', { url, title });
logger.error('Scraping failed', { url, error: error.message });
```

### 2. AI Content Reformulation

Avoid plagiarism by reformulating articles with OpenAI:

**Setup:**
1. Get an API key from https://platform.openai.com/api-keys
2. Add to `.env`:
   ```env
   OPENAI_API_KEY=sk-...
   REFORMULATION_ENABLED=true
   OPENAI_MODEL=gpt-3.5-turbo
   ```

**How it works:**
- Rewrites articles in unique style
- Preserves all facts and information
- Maintains professional tone
- Adapted for francophone African audience

**Cost Considerations:**
- GPT-3.5-Turbo: ~$0.002 per 1000 tokens
- GPT-4: ~$0.03 per 1000 tokens
- Average article: 2000-4000 tokens

**Optional:** The system works without reformulation if not configured.

### 3. Robots.txt Compliance

Automatic robots.txt checking before scraping:

**Features:**
- Checks robots.txt before each scrape
- Respects crawl-delay directives
- Caches robots.txt for 24 hours
- Graceful fallback if robots.txt unavailable

**How it works:**
The system automatically:
1. Fetches robots.txt for each domain
2. Checks if URL is allowed for scraping
3. Respects crawl-delay if specified
4. Skips disallowed URLs

**No configuration needed** - works automatically!

### 4. Cron Job Automation

Schedule automatic news collection:

**Quick Start:**
```bash
npm run start-scheduler
```

**Configuration:**
```env
# Run every 2 hours
CRON_SCHEDULE=0 */2 * * *

# Timezone
TIMEZONE=Africa/Dakar

# Run immediately on startup
RUN_ON_STARTUP=true
```

**Schedule Examples:**
```env
# Every hour
CRON_SCHEDULE=0 * * * *

# Three times a day (8am, 12pm, 6pm)
CRON_SCHEDULE=0 8,12,18 * * *

# Every day at midnight
CRON_SCHEDULE=0 0 * * *

# Every Monday at 9am
CRON_SCHEDULE=0 9 * * 1
```

**Production Deployment with PM2:**
```bash
# Install PM2
npm install -g pm2

# Start scheduler
pm2 start npm --name "inzassa-scheduler" -- run start-scheduler

# Monitor
pm2 logs inzassa-scheduler

# Auto-start on system reboot
pm2 startup
pm2 save
```

### 5. Health Monitoring

Check system status and configuration:

```typescript
import { getReformulationStatus } from './server/utils/reformulator';
import { getRobotsCacheStats } from './server/utils/robots-checker';

// Check reformulation status
const reformStatus = getReformulationStatus();
console.log('Reformulation:', reformStatus);
// Output: { enabled: true, configured: true, model: 'gpt-3.5-turbo' }

// Check robots.txt cache
const robotsStats = getRobotsCacheStats();
console.log('Robots cache:', robotsStats);
// Output: { size: 5, domains: ['https://seneweb.com', ...] }
```

## Complete Workflow

Here's how all components work together:

```
1. Cron scheduler triggers collection
   ↓
2. For each article URL:
   ├─ Check robots.txt compliance
   ├─ Respect crawl-delay if specified
   ├─ Scrape article content
   ├─ Reformulate with AI (optional)
   ├─ Translate to 6 languages
   ├─ Save to MongoDB
   └─ Log all activities
   ↓
3. Generate collection summary
   ↓
4. Logs stored in logs/ directory
```

## Best Practices

### 1. Start Small
```typescript
// Test with 2-3 articles first
const articlesToScrape = [
  {
    url: 'https://www.seneweb.com/news/...',
    site: 'seneweb',
    country: 'senegal',
    category: 'politique',
  },
  // Add 1-2 more
];
```

### 2. Monitor Logs
```bash
# Watch real-time logs
tail -f logs/combined.log

# Check errors only
tail -f logs/error.log

# Search for specific article
grep "article-title" logs/combined.log
```

### 3. Respect Rate Limits
```typescript
// Adjust delay between requests (default: 3000ms)
await delay(5000); // 5 seconds for slower sites
```

### 4. Use Self-Hosted Translation
For production, run your own LibreTranslate:
```bash
docker run -d -p 5000:5000 libretranslate/libretranslate
```

### 5. Enable Reformulation Gradually
Start without reformulation, then enable it once you've validated the pipeline.

## Troubleshooting

### Collection Fails Immediately
**Check:** MongoDB connection
```bash
# Test MongoDB connection
mongo mongodb://localhost:27017/inzassa
```

### Translation Errors
**Check:** LibreTranslate availability
```bash
curl https://libretranslate.com/languages
```

### Reformulation Not Working
**Check:** OpenAI API key and credits
- Verify key is valid
- Check account has credits
- Review logs for specific errors

### Scraping Blocked
**Check:** robots.txt compliance
- Verify URL is allowed
- Check if crawl-delay is being respected
- Consider adding more delay between requests

### Scheduler Not Running
**Check:** Cron expression validity
```javascript
const cron = require('node-cron');
console.log(cron.validate('0 */2 * * *')); // Should return true
```

## Performance Optimization

### 1. Parallel Processing (Advanced)
For large-scale scraping, consider parallel workers:
```typescript
// Use worker threads or child processes
// Process multiple articles simultaneously
// (Implementation depends on your scale needs)
```

### 2. Database Indexing
Ensure MongoDB indexes are created:
```javascript
// Indexes are auto-created by the schema
// But verify with:
db.news.getIndexes()
```

### 3. Caching
- Robots.txt: Cached for 24 hours automatically
- Consider caching translated content for updates

### 4. Error Recovery
The system automatically:
- Skips duplicate articles
- Continues on individual article failures
- Logs all errors for review

## Security Considerations

### 1. API Keys
Never commit API keys:
```bash
# Always use .env file
echo ".env" >> .gitignore
```

### 2. Rate Limiting
Respect source websites:
- Use appropriate delays
- Don't overwhelm servers
- Honor robots.txt

### 3. Legal Compliance
- Always cite sources (originalUrl field)
- Respect copyright laws
- Consider terms of service
- Use reformulation for unique content

## Production Deployment

### Recommended Stack:
- **Server:** Linux VPS (Ubuntu 20.04+)
- **Process Manager:** PM2
- **Database:** MongoDB Atlas or self-hosted
- **Logs:** Centralized logging (e.g., Papertrail, Loggly)
- **Monitoring:** PM2 monitoring or custom dashboard

### Deployment Steps:
```bash
# 1. Clone repository
git clone <repo-url>
cd inzassa

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
nano .env  # Edit with production values

# 4. Test collection
npm run collect-news

# 5. Start scheduler with PM2
pm2 start npm --name "inzassa-scheduler" -- run start-scheduler
pm2 save
pm2 startup

# 6. Monitor
pm2 monit
```

## Support

For issues or questions:
1. Check logs in `logs/` directory
2. Review this guide
3. Consult IMPLEMENTATION_GUIDE.md
4. Check GitHub issues

---

**Happy scraping! 🚀**
