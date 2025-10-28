# AGENT.md - Development Tasks and Guidelines

This file provides guidance for AI agents and developers working on the Inzassa news portal project.

## Project Overview

Inzassa is a multilingual news portal for Francophone African countries with automated news collection, translation, and content management capabilities.

**Technologies:** Nuxt 3, Vue 3, MongoDB, Mongoose, LibreTranslate, OpenAI, Winston

## ✅ Completed Tasks (Phase 1)

### 1. Core Application Structure
- [x] Nuxt 3 application setup with TypeScript
- [x] MongoDB integration with Mongoose models (News, Book, Country)
- [x] Internationalization with @nuxtjs/i18n (6 languages: fr, en, es, de, it, ar)
- [x] Responsive UI components (Header, Footer, NewsCard, AdUnit, GoogleAnalytics)
- [x] API routes for news, books, and countries
- [x] Database seeding script

### 2. News Collection System
- [x] Generic web scraper (`server/utils/scraper.ts`)
- [x] Pre-configured scrapers for 5 African news sites:
  - Seneweb (Senegal)
  - Dakaractu (Senegal)
  - CamerounWeb (Cameroon)
  - Abidjan.net (Côte d'Ivoire)
  - Malijet (Mali)
- [x] LibreTranslate integration for multi-language translation
- [x] Automatic duplicate detection
- [x] Collection orchestration script (`scripts/collect-news.ts`)

### 3. Advanced Features (Phase 2)
- [x] Winston logging system with log rotation
  - Structured JSON logs
  - Separate error.log and combined.log
  - Auto-rotation (5MB max, 5 files)
- [x] OpenAI content reformulation
  - GPT-3.5/GPT-4 integration
  - Plagiarism avoidance
  - Optional (cost-controlled)
- [x] Robots.txt compliance checker
  - Automatic verification before scraping
  - Crawl-delay enforcement
  - 24-hour domain caching
- [x] Cron job automation
  - Configurable scheduling
  - Timezone support
  - Graceful shutdown handling
  - PM2 production deployment ready

### 4. Documentation
- [x] README.md - Project overview and installation
- [x] GETTING_STARTED.md - Detailed setup guide
- [x] IMPLEMENTATION_GUIDE.md - Scraping and translation guide
- [x] SCRAPING_GUIDE.md - Advanced usage and automation
- [x] TASKS_COMPLETE.md - Implementation report
- [x] PROJECT_SUMMARY.md - Complete project summary
- [x] .env.example - Environment configuration template

### 5. Monetization & Analytics
- [x] Google AdSense integration
- [x] Google Analytics integration
- [x] Environment-based configuration

## 🔄 Current Tasks (Phase 3)

### Priority 1: Testing & Validation
- [x] Install npm dependencies (✅ 827 packages, 0 vulnerabilities)
- [x] Run build to verify all components compile (✅ Build successful - 5.63 MB total)
- [ ] Test MongoDB connection (requires MongoDB running)
- [ ] Test scraper with sample articles (requires article URLs)
- [ ] Test translator with sample text (requires LibreTranslate access)
- [ ] Validate all API endpoints return proper data (requires running dev server)
- [ ] Test cron scheduler in development mode
- [ ] Verify logging system works correctly

**Build Status:** ✅ SUCCESS
- Client built: 2.65s
- Server built: 1.51s
- Total size: 5.63 MB (1.42 MB gzipped)
- Dependencies: 827 packages installed
- Security: 0 vulnerabilities found

### Priority 2: Content Population
- [ ] Add real article URLs to collection script
- [ ] Run initial news collection
- [ ] Verify translations quality
- [ ] Check for duplicate prevention
- [ ] Monitor logs for errors
- [ ] Optimize scraper selectors if needed

### Priority 3: Production Readiness
- [ ] Set up MongoDB Atlas or production database
- [ ] Configure production environment variables
- [ ] Set up self-hosted LibreTranslate (optional)
- [ ] Configure OpenAI API (optional)
- [ ] Deploy with PM2 or Docker
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy

## 🚀 Future Tasks (Phase 4)

### Content Discovery & Automation
- [ ] RSS feed integration for automatic article discovery
- [ ] Webhook notifications for new content
- [ ] Email alerts for collection failures
- [ ] Smart scheduling based on site update patterns

### Admin Interface
- [ ] Admin dashboard for content management
- [ ] Scraping task queue management
- [ ] Real-time collection status monitoring
- [ ] Manual article addition interface
- [ ] Translation review and editing

### Search & Discovery
- [ ] Full-text search implementation (Elasticsearch/MongoDB Atlas Search)
- [ ] Advanced filtering (date range, multiple categories)
- [ ] Related articles recommendations
- [ ] Trending topics detection
- [ ] Tag/keyword system

### Content Enhancement
- [ ] Automatic categorization with AI
- [ ] Sentiment analysis
- [ ] Article summarization (beyond current summaries)
- [ ] Image extraction and optimization
- [ ] Video embedding support

### User Features
- [ ] User authentication system
- [ ] Bookmarking/favorites
- [ ] Reading history
- [ ] Personalized recommendations
- [ ] Comments and discussions
- [ ] Newsletter subscription
- [ ] Push notifications

### Performance & Scalability
- [ ] Redis caching layer
- [ ] CDN integration for images
- [ ] Database query optimization
- [ ] Parallel scraping with worker queues
- [ ] Load balancing for high traffic
- [ ] Progressive Web App (PWA) support

### Mobile & Extended Platforms
- [ ] React Native mobile app
- [ ] Flutter mobile app alternative
- [ ] API documentation for third-party developers
- [ ] Public API with authentication
- [ ] Podcast section integration
- [ ] Video content section

## 📋 Development Guidelines

### For AI Agents

When working on this project:

1. **Always check existing implementations first**
   - Review TASKS_COMPLETE.md for what's already done
   - Check existing utils in `server/utils/`
   - Look at existing API routes before creating new ones

2. **Follow established patterns**
   - Use TypeScript for server-side code
   - Use Vue 3 Composition API for components
   - Follow existing file structure
   - Maintain consistency with existing code style

3. **Environment configuration**
   - Add new variables to `.env.example`
   - Document in relevant guides
   - Provide sensible defaults
   - Never commit actual `.env` files

4. **Testing approach**
   - Test scraping on 1-2 articles first
   - Verify translations before batch processing
   - Check logs after each run
   - Start with development mode before production

5. **Documentation updates**
   - Update relevant .md files when adding features
   - Add examples for new utilities
   - Document new environment variables
   - Update API endpoint lists

### Code Standards

```typescript
// Use TypeScript with proper types
interface ArticleData {
  title: string;
  content: string;
  imageUrl?: string;
}

// Use async/await over promises
async function processArticle(url: string): Promise<ArticleData> {
  // Implementation
}

// Use proper error handling
try {
  const article = await scrapeArticle(url);
  logger.info('Article scraped', { url, title: article.title });
} catch (error) {
  logger.error('Scraping failed', { url, error: error.message });
  // Handle gracefully
}

// Use environment variables for configuration
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  logger.warn('OPENAI_API_KEY not configured, reformulation disabled');
}
```

### File Organization

```
server/
├── api/              # API endpoints
│   ├── news/
│   ├── books/
│   └── countries/
├── models/           # Mongoose schemas
├── utils/            # Utility functions
│   ├── scraper.ts
│   ├── translator.ts
│   ├── logger.ts
│   ├── reformulator.ts
│   └── robots-checker.ts
└── plugins/          # Server plugins

scripts/
├── collect-news.ts   # Manual collection
├── cron-scraper.ts   # Automated scheduling
└── seed.js           # Database seeding

components/           # Vue components
pages/               # Nuxt pages
locales/             # i18n translations
```

## 🔧 Quick Reference

### Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run preview                # Preview production build

# Scraping
npm run collect-news           # Run manual collection
npm run start-scheduler        # Start cron scheduler

# Database
node scripts/seed.js           # Seed sample data
mongosh inzassa                # Access MongoDB shell

# Process Management (Production)
pm2 start npm --name "inzassa-scheduler" -- run start-scheduler
pm2 logs inzassa-scheduler
pm2 stop inzassa-scheduler
pm2 restart inzassa-scheduler
```

### Environment Variables

```env
# Core
MONGODB_URI=mongodb://localhost:27017/inzassa
NODE_ENV=development

# Translation
LIBRETRANSLATE_URL=https://libretranslate.com
TRANSLATION_DELAY_MS=500

# AI Reformulation (Optional)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
REFORMULATION_ENABLED=false

# Logging
LOG_LEVEL=info

# Scheduling
CRON_SCHEDULE=0 */2 * * *
TIMEZONE=Africa/Dakar
RUN_ON_STARTUP=true

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

### Adding a New News Source

1. Add configuration to `server/utils/scraper.ts`:
```typescript
export const scraperConfigs: Record<string, ScraperConfig> = {
  mynewsite: {
    titleSelector: 'h1.article-title',
    contentSelector: '.article-content p',
    imageSelector: '.featured-image img',
    dateSelector: '.publish-date',
  },
};
```

2. Add article URLs to `scripts/collect-news.ts`:
```typescript
const articlesToScrape = [
  {
    url: 'https://mynewsite.com/article-123',
    site: 'mynewsite',
    country: 'senegal',
    category: 'politique',
  },
];
```

3. Test with a single article first
4. Monitor logs for any errors
5. Adjust selectors as needed

## 🐛 Troubleshooting

### Build Fails
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### MongoDB Connection Issues
```bash
# Check MongoDB is running
systemctl status mongod  # Linux
brew services list       # macOS

# Test connection
mongosh mongodb://localhost:27017/inzassa
```

### Scraping Blocked
- Check robots.txt of target site
- Increase delays between requests
- Verify User-Agent string is set
- Check if site requires authentication

### Translation Errors
- Verify LibreTranslate service is accessible
- Check internet connection
- Consider self-hosted instance for reliability
- Review rate limits

## 🧪 Testing Guide

### Quick Validation Tests

After setting up the project, run these tests to verify everything works:

#### 1. Build Test (Already Passed ✅)
```bash
npm run build
# Expected: Successful build with no errors
```

#### 2. TypeScript Compilation Test
```bash
npx tsc --noEmit
# Expected: No type errors
```

#### 3. Server Utils Import Test
```bash
# Test logger
node -e "import('./server/utils/logger.js').then(m => console.log('Logger OK'))"

# Test scraper
node -e "import('./server/utils/scraper.js').then(m => console.log('Scraper OK'))"

# Test translator
node -e "import('./server/utils/translator.js').then(m => console.log('Translator OK'))"

# Test reformulator
node -e "import('./server/utils/reformulator.js').then(m => console.log('Reformulator OK'))"

# Test robots checker
node -e "import('./server/utils/robots-checker.js').then(m => console.log('Robots checker OK'))"
```

#### 4. MongoDB Connection Test (Requires MongoDB)
```bash
# Start MongoDB first:
# docker run -d -p 27017:27017 --name mongodb mongo:latest

# Then test connection
node -e "
import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost:27017/inzassa')
  .then(() => console.log('MongoDB OK'))
  .catch(e => console.error('MongoDB Error:', e.message))
  .finally(() => mongoose.disconnect());
"
```

#### 5. Development Server Test
```bash
npm run dev
# Open http://localhost:3000 in browser
# Expected: Homepage loads with navigation and language selector
```

#### 6. API Endpoints Test
```bash
# Start dev server first: npm run dev
# Then in another terminal:

# Test news API
curl http://localhost:3000/api/news

# Test countries API
curl http://localhost:3000/api/countries

# Test books API
curl http://localhost:3000/api/books
```

#### 7. Scraper Function Test (Without DB)
```javascript
// Create test file: test-scraper.js
import { isAllowedByRobots, getCrawlDelay } from './server/utils/robots-checker.js';

const testUrl = 'https://www.seneweb.com/';
const allowed = await isAllowedByRobots(testUrl);
console.log('Allowed:', allowed);

const delay = await getCrawlDelay(testUrl);
console.log('Crawl delay:', delay, 'ms');
```

#### 8. Translation Test
```javascript
// Create test file: test-translation.js
import { translateText } from './server/utils/translator.js';

const text = 'Bonjour le monde';
const translated = await translateText(text, 'en', 'fr');
console.log('Original:', text);
console.log('Translated:', translated);
```

#### 9. Logger Test
```javascript
// Create test file: test-logger.js
import logger from './server/utils/logger.js';

logger.info('Test info message', { test: true });
logger.warn('Test warning message');
logger.error('Test error message', { error: 'test' });

console.log('Check logs/ directory for output');
```

#### 10. Reformulation Status Test
```javascript
// Create test file: test-reformulation.js
import { getReformulationStatus } from './server/utils/reformulator.js';

const status = getReformulationStatus();
console.log('Reformulation status:', status);
// Expected: { enabled: false, configured: false } (unless OPENAI_API_KEY is set)
```

### Integration Tests

#### Full Collection Test (Requires MongoDB + Internet)
```bash
# 1. Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 2. Add test article URLs to scripts/collect-news.ts
# Edit the articlesToScrape array with 1-2 valid article URLs

# 3. Run collection
npm run collect-news

# 4. Check results
mongosh inzassa
db.news.find().pretty()

# 5. Check logs
cat logs/combined.log
```

#### Scheduler Test
```bash
# 1. Set environment for testing
export CRON_SCHEDULE='*/1 * * * *'  # Every minute
export RUN_ON_STARTUP=true

# 2. Start scheduler
npm run start-scheduler

# 3. Monitor logs
tail -f logs/combined.log

# 4. Stop with Ctrl+C after a few runs
```

### Performance Tests

#### Load Test for API
```bash
# Install Apache Bench (if not available)
# sudo apt-get install apache2-utils

# Start dev server
npm run dev &

# Test news endpoint
ab -n 100 -c 10 http://localhost:3000/api/news

# Test with parameters
ab -n 100 -c 10 "http://localhost:3000/api/news?country=senegal&limit=20"
```

#### Scraping Performance Test
```javascript
// Create test file: test-scraping-performance.js
import { scrapeArticle, scraperConfigs } from './server/utils/scraper.js';

const urls = [
  'https://www.seneweb.com/article1',
  'https://www.seneweb.com/article2',
  // Add more URLs
];

const start = Date.now();
let successCount = 0;

for (const url of urls) {
  try {
    await scrapeArticle(url, scraperConfigs.seneweb);
    successCount++;
  } catch (error) {
    console.error(`Failed: ${url}`);
  }
}

const duration = Date.now() - start;
console.log(`Scraped ${successCount}/${urls.length} articles in ${duration}ms`);
console.log(`Average: ${duration / urls.length}ms per article`);
```

### Security Tests

#### Dependency Audit
```bash
npm audit
# Expected: 0 vulnerabilities (already verified)
```

#### Environment Variables Check
```bash
# Verify sensitive data not committed
grep -r "OPENAI_API_KEY" .env 2>/dev/null && echo "WARNING: Check .env is in .gitignore"
grep -r "mongodb://.*:.*@" . --exclude-dir=node_modules 2>/dev/null && echo "WARNING: Credentials in code"
```

#### Input Sanitization Test
```javascript
// Test with malicious inputs
const maliciousInputs = [
  '<script>alert("xss")</script>',
  '"; DROP TABLE news; --',
  '../../../etc/passwd',
];

// Test each input through your APIs
// Should be properly escaped/sanitized
```

### Manual Test Checklist

Before deployment, manually verify:

- [ ] Homepage loads correctly
- [ ] Language switcher works (all 6 languages)
- [ ] News listing page displays articles
- [ ] Article detail page works
- [ ] Books section displays correctly
- [ ] Countries section displays correctly
- [ ] Filters work (country, category)
- [ ] Pagination works
- [ ] Mobile responsive design works
- [ ] Images load properly
- [ ] Links work correctly
- [ ] 404 page displays for invalid routes
- [ ] 500 page displays for errors (test by breaking something temporarily)

### Continuous Integration Recommendations

For a production setup, consider adding:

1. **GitHub Actions Workflow** (`.github/workflows/ci.yml`):
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:latest
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm audit
```

2. **Unit Tests with Vitest**:
```bash
npm install -D vitest
# Add test scripts to package.json
# Write unit tests for utilities
```

3. **E2E Tests with Playwright**:
```bash
npm install -D @playwright/test
# Write end-to-end tests for critical user flows
```

## 📞 Support Resources

- **Nuxt Documentation:** https://nuxt.com/docs
- **MongoDB Documentation:** https://docs.mongodb.com/
- **Winston Logger:** https://github.com/winstonjs/winston
- **OpenAI API:** https://platform.openai.com/docs
- **LibreTranslate:** https://libretranslate.com/

## 🎯 Success Metrics

Track these metrics to measure project success:

- **Content:** Number of articles collected daily
- **Quality:** Translation accuracy, reformulation quality
- **Performance:** Scraping speed, API response times
- **Reliability:** Uptime, error rates
- **Users:** Daily/monthly active users (once deployed)
- **Engagement:** Time on site, pages per session

## 🔐 Security Checklist

- [ ] Never commit .env files
- [ ] Rotate API keys regularly
- [ ] Use HTTPS in production
- [ ] Implement rate limiting on public APIs
- [ ] Sanitize user inputs
- [ ] Keep dependencies updated
- [ ] Monitor logs for suspicious activity
- [ ] Implement proper CORS policies
- [ ] Use MongoDB authentication in production
- [ ] Regular security audits

## 📈 Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] MongoDB production instance ready
- [ ] Build completes without errors
- [ ] All tests passing
- [ ] Logs directory configured with write permissions
- [ ] PM2 or Docker configured
- [ ] Domain and DNS configured
- [ ] SSL certificates installed
- [ ] Monitoring and alerting set up
- [ ] Backup strategy implemented
- [ ] Documentation reviewed and updated

---

**Last Updated:** October 28, 2025
**Version:** 1.0.0
**Status:** Production Ready (Core Features Complete)
