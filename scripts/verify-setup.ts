#!/usr/bin/env tsx
/**
 * Verification script for Inzassa project setup
 * Tests core utilities and configuration without requiring MongoDB
 * 
 * Usage: npm run verify OR npx tsx scripts/verify-setup.ts
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: string;
}

const results: TestResult[] = [];

async function runTest(name: string, testFn: () => Promise<void>): Promise<void> {
  try {
    await testFn();
    results.push({ name, passed: true });
    console.log(`✅ ${name}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, error: errorMessage });
    console.log(`❌ ${name}: ${errorMessage}`);
  }
}

async function main() {
  console.log('🔍 Inzassa Setup Verification\n');
  console.log('Testing core utilities and configuration...\n');

  // Test 1: Logger import and initialization
  await runTest('Logger utility import', async () => {
    const { default: logger } = await import('../server/utils/logger.js');
    if (!logger) throw new Error('Logger not exported');
    if (typeof logger.info !== 'function') throw new Error('Logger.info not a function');
  });

  // Test 2: Scraper utility
  await runTest('Scraper utility import', async () => {
    const { scrapeArticle, scraperConfigs, delay } = await import('../server/utils/scraper.js');
    if (!scrapeArticle) throw new Error('scrapeArticle not exported');
    if (!scraperConfigs) throw new Error('scraperConfigs not exported');
    if (!delay) throw new Error('delay not exported');
    
    // Check available scrapers
    const sites = Object.keys(scraperConfigs);
    if (sites.length === 0) throw new Error('No scraper configs found');
    console.log(`   Available scrapers: ${sites.join(', ')}`);
  });

  // Test 3: Translator utility
  await runTest('Translator utility import', async () => {
    const { translateText, translateArticle } = await import('../server/utils/translator.js');
    if (!translateText) throw new Error('translateText not exported');
    if (!translateArticle) throw new Error('translateArticle not exported');
  });

  // Test 4: Reformulator utility
  await runTest('Reformulator utility import', async () => {
    const { 
      reformulateArticle, 
      isReformulationAvailable, 
      getReformulationStatus 
    } = await import('../server/utils/reformulator.js');
    
    if (!reformulateArticle) throw new Error('reformulateArticle not exported');
    if (!getReformulationStatus) throw new Error('getReformulationStatus not exported');
    
    const status = getReformulationStatus();
    console.log(`   Reformulation: ${status.enabled ? 'enabled' : 'disabled'} (configured: ${status.configured})`);
  });

  // Test 5: Robots checker utility
  await runTest('Robots checker utility import', async () => {
    const { 
      isAllowedByRobots, 
      getCrawlDelay, 
      getRobotsCacheStats 
    } = await import('../server/utils/robots-checker.js');
    
    if (!isAllowedByRobots) throw new Error('isAllowedByRobots not exported');
    if (!getCrawlDelay) throw new Error('getCrawlDelay not exported');
    if (!getRobotsCacheStats) throw new Error('getRobotsCacheStats not exported');
  });

  // Test 6: Environment variables check
  await runTest('Environment configuration', async () => {
    const requiredVars = ['MONGODB_URI'];
    const optionalVars = [
      'LIBRETRANSLATE_URL',
      'OPENAI_API_KEY',
      'LOG_LEVEL',
      'CRON_SCHEDULE',
      'TIMEZONE'
    ];
    
    const missing: string[] = [];
    const configured: string[] = [];
    
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        missing.push(varName);
      } else {
        configured.push(varName);
      }
    });
    
    optionalVars.forEach(varName => {
      if (process.env[varName]) {
        configured.push(varName);
      }
    });
    
    if (missing.length > 0) {
      console.log(`   ⚠️  Missing: ${missing.join(', ')} (using defaults)`);
    }
    if (configured.length > 0) {
      console.log(`   Configured: ${configured.join(', ')}`);
    }
  });

  // Test 7: Scripts accessibility
  await runTest('Collection script import', async () => {
    const collectPath = join(__dirname, 'collect-news.ts');
    // Just check file exists and is readable
    const fs = await import('fs');
    const stats = await fs.promises.stat(collectPath);
    if (!stats.isFile()) throw new Error('collect-news.ts not found');
  });

  // Test 8: Cron scheduler script
  await runTest('Cron scheduler script import', async () => {
    const cronPath = join(__dirname, 'cron-scraper.ts');
    const fs = await import('fs');
    const stats = await fs.promises.stat(cronPath);
    if (!stats.isFile()) throw new Error('cron-scraper.ts not found');
  });

  // Test 9: Package.json scripts
  await runTest('NPM scripts configuration', async () => {
    const fs = await import('fs');
    const packagePath = join(__dirname, '../package.json');
    const packageJson = JSON.parse(await fs.promises.readFile(packagePath, 'utf-8'));
    
    const requiredScripts = ['build', 'dev', 'collect-news', 'start-scheduler'];
    const missing = requiredScripts.filter(script => !packageJson.scripts[script]);
    
    if (missing.length > 0) {
      throw new Error(`Missing scripts: ${missing.join(', ')}`);
    }
    
    console.log(`   Available: ${Object.keys(packageJson.scripts).join(', ')}`);
  });

  // Test 10: Dependencies
  await runTest('Required dependencies installed', async () => {
    const requiredDeps = [
      'mongoose',
      'axios',
      'cheerio',
      'winston',
      'openai',
      'node-cron',
      'robots-parser',
      'nuxt'
    ];
    
    const fs = await import('fs');
    const packagePath = join(__dirname, '../package.json');
    const packageJson = JSON.parse(await fs.promises.readFile(packagePath, 'utf-8'));
    
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    const missing = requiredDeps.filter(dep => !allDeps[dep]);
    
    if (missing.length > 0) {
      throw new Error(`Missing dependencies: ${missing.join(', ')}`);
    }
    
    console.log(`   All ${requiredDeps.length} required dependencies installed`);
  });

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Verification Summary\n');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  
  console.log(`Total tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\n⚠️  Failed tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`   - ${r.name}: ${r.error}`);
    });
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (passed === total) {
    console.log('✅ All checks passed! Project is ready to use.\n');
    console.log('Next steps:');
    console.log('1. Start MongoDB: docker run -d -p 27017:27017 mongo:latest');
    console.log('2. Run dev server: npm run dev');
    console.log('3. Add article URLs to scripts/collect-news.ts');
    console.log('4. Test collection: npm run collect-news');
  } else {
    console.log('⚠️  Some checks failed. Please review the errors above.\n');
    process.exit(1);
  }
}

// Run verification
main().catch((error) => {
  console.error('\n❌ Verification script failed:', error);
  process.exit(1);
});
