import cron from 'node-cron';
import { collectNews } from './collect-news.js';
import logger from '../server/utils/logger.js';

/**
 * Automated news collection with cron scheduling
 * 
 * This script runs the news collection process on a schedule using cron syntax.
 * 
 * Schedule options (configured via CRON_SCHEDULE env var):
 * - '0 * * * *'      - Every hour at minute 0
 * - '0 */2 * * *'    - Every 2 hours
 * - '0 0 * * *'      - Every day at midnight
 * - '0 8,12,18 * * *' - Three times a day (8am, 12pm, 6pm)
 * 
 * Default: Every 2 hours
 */

const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 */2 * * *';
const TIMEZONE = process.env.TIMEZONE || 'Africa/Dakar';

/**
 * Run the collection job
 */
async function runCollectionJob() {
  const startTime = new Date();
  logger.info('Cron job started', { 
    schedule: CRON_SCHEDULE,
    timezone: TIMEZONE,
    startTime: startTime.toISOString(),
  });

  try {
    await collectNews();
    
    const endTime = new Date();
    const duration = (endTime.getTime() - startTime.getTime()) / 1000;
    
    logger.info('Cron job completed successfully', { 
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: `${duration}s`,
    });
  } catch (error) {
    logger.error('Cron job failed', { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}

/**
 * Validate cron expression
 */
if (!cron.validate(CRON_SCHEDULE)) {
  console.error(`❌ Invalid cron schedule: ${CRON_SCHEDULE}`);
  console.error('Please provide a valid cron expression via CRON_SCHEDULE environment variable');
  process.exit(1);
}

console.log('⏰ News Collection Scheduler');
console.log('==========================');
console.log(`Schedule: ${CRON_SCHEDULE}`);
console.log(`Timezone: ${TIMEZONE}`);
console.log(`Started at: ${new Date().toLocaleString()}`);
console.log('==========================\n');

// Schedule the job
const task = cron.schedule(
  CRON_SCHEDULE,
  runCollectionJob,
  {
    scheduled: true,
    timezone: TIMEZONE,
  }
);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Stopping scheduler...');
  task.stop();
  logger.info('Scheduler stopped by SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️  Stopping scheduler...');
  task.stop();
  logger.info('Scheduler stopped by SIGTERM');
  process.exit(0);
});

// Run immediately on startup (optional, can be disabled via env var)
if (process.env.RUN_ON_STARTUP !== 'false') {
  console.log('🚀 Running initial collection...\n');
  runCollectionJob().catch(error => {
    console.error('Initial collection failed:', error);
  });
}

console.log('✅ Scheduler is running. Press Ctrl+C to stop.\n');
