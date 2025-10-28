import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');

/**
 * Winston logger configuration for the news scraping system
 * Logs are stored in:
 * - logs/error.log - Error level logs only
 * - logs/combined.log - All logs
 * - Console output for development
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'inzassa-scraper' },
  transports: [
    // Write all logs with importance level of 'error' or less to error.log
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(info => {
        const { timestamp, level, message, ...rest } = info;
        const restString = Object.keys(rest).length ? JSON.stringify(rest, null, 2) : '';
        return `${timestamp} ${level}: ${message} ${restString}`;
      })
    ),
  }));
}

/**
 * Log scraping activity
 */
export function logScrapingStart(url: string, site: string) {
  logger.info('Starting scraping', { url, site, action: 'scrape_start' });
}

export function logScrapingSuccess(url: string, title: string, contentLength: number) {
  logger.info('Scraping successful', { 
    url, 
    title: title.substring(0, 60), 
    contentLength,
    action: 'scrape_success' 
  });
}

export function logScrapingError(url: string, error: Error) {
  logger.error('Scraping failed', { 
    url, 
    error: error.message, 
    stack: error.stack,
    action: 'scrape_error' 
  });
}

/**
 * Log translation activity
 */
export function logTranslationStart(title: string) {
  logger.info('Starting translation', { 
    title: title.substring(0, 60),
    action: 'translate_start' 
  });
}

export function logTranslationSuccess(title: string, languages: string[]) {
  logger.info('Translation successful', { 
    title: title.substring(0, 60),
    languages,
    action: 'translate_success' 
  });
}

export function logTranslationError(title: string, error: Error) {
  logger.error('Translation failed', { 
    title: title.substring(0, 60),
    error: error.message,
    stack: error.stack,
    action: 'translate_error' 
  });
}

/**
 * Log database operations
 */
export function logDatabaseSave(articleId: string, country: string, category: string) {
  logger.info('Article saved to database', { 
    articleId, 
    country, 
    category,
    action: 'db_save' 
  });
}

export function logDatabaseError(error: Error) {
  logger.error('Database operation failed', { 
    error: error.message,
    stack: error.stack,
    action: 'db_error' 
  });
}

/**
 * Log collection summary
 */
export function logCollectionSummary(stats: {
  total: number;
  success: number;
  skipped: number;
  errors: number;
}) {
  logger.info('Collection completed', { 
    ...stats,
    action: 'collection_complete' 
  });
}

export default logger;
