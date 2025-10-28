import robotsParser from 'robots-parser';
import logger from './logger.js';

/**
 * Robots.txt checker utility
 * Ensures that scraping respects website robots.txt rules
 * 
 * Usage:
 * const checker = new RobotsChecker();
 * const allowed = await checker.isAllowed('https://example.com/article');
 */

// Cache robots.txt for each domain
const robotsCache = new Map<string, { parser: any; fetchedAt: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Extract domain from URL
 */
function getDomain(url: string): string {
  const urlObj = new URL(url);
  return `${urlObj.protocol}//${urlObj.host}`;
}

/**
 * Get robots.txt URL for a domain
 */
function getRobotsUrl(domain: string): string {
  return `${domain}/robots.txt`;
}

/**
 * Fetch and parse robots.txt for a domain
 */
async function fetchRobotsTxt(domain: string): Promise<any> {
  const robotsUrl = getRobotsUrl(domain);
  
  try {
    const response = await fetch(robotsUrl, {
      headers: {
        'User-Agent': 'InzassaBot/1.0 (+https://inzassa.com/bot)',
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      // If robots.txt doesn't exist, assume everything is allowed
      logger.info('robots.txt not found, assuming allowed', { 
        domain, 
        status: response.status,
        action: 'robots_not_found',
      });
      return robotsParser(robotsUrl, ''); // Empty robots.txt = allow all
    }

    const robotsTxt = await response.text();
    const parser = robotsParser(robotsUrl, robotsTxt);
    
    logger.info('robots.txt fetched successfully', { 
      domain,
      action: 'robots_fetched',
    });

    return parser;
  } catch (error) {
    logger.warn('Failed to fetch robots.txt, assuming allowed', { 
      domain,
      error: error instanceof Error ? error.message : String(error),
      action: 'robots_fetch_error',
    });
    // If we can't fetch robots.txt, assume everything is allowed (but log the error)
    return robotsParser(robotsUrl, '');
  }
}

/**
 * Get cached or fetch robots.txt parser
 */
async function getRobotsParser(domain: string): Promise<any> {
  const cached = robotsCache.get(domain);
  const now = Date.now();

  // Use cache if available and not expired
  if (cached && (now - cached.fetchedAt) < CACHE_TTL_MS) {
    return cached.parser;
  }

  // Fetch new robots.txt
  const parser = await fetchRobotsTxt(domain);
  robotsCache.set(domain, { parser, fetchedAt: now });
  
  return parser;
}

/**
 * Check if a URL can be scraped according to robots.txt
 * @param url - The URL to check
 * @param userAgent - User agent to use (default: InzassaBot)
 * @returns true if scraping is allowed, false otherwise
 */
export async function isAllowedByRobots(
  url: string,
  userAgent: string = 'InzassaBot'
): Promise<boolean> {
  try {
    const domain = getDomain(url);
    const parser = await getRobotsParser(domain);
    
    const allowed = parser.isAllowed(url, userAgent);
    
    if (!allowed) {
      logger.warn('URL disallowed by robots.txt', { 
        url, 
        userAgent,
        action: 'robots_disallowed',
      });
    }
    
    return allowed;
  } catch (error) {
    logger.error('Error checking robots.txt', { 
      url,
      error: error instanceof Error ? error.message : String(error),
      action: 'robots_check_error',
    });
    // If we can't check, assume it's allowed but log the error
    return true;
  }
}

/**
 * Get the crawl delay specified in robots.txt
 * @param url - The URL to check
 * @param userAgent - User agent to use (default: InzassaBot)
 * @returns Crawl delay in milliseconds, or 0 if not specified
 */
export async function getCrawlDelay(
  url: string,
  userAgent: string = 'InzassaBot'
): Promise<number> {
  try {
    const domain = getDomain(url);
    const parser = await getRobotsParser(domain);
    
    const delay = parser.getCrawlDelay(userAgent);
    
    if (delay) {
      logger.info('Crawl delay found in robots.txt', { 
        domain, 
        delay: `${delay}s`,
        action: 'robots_crawl_delay',
      });
      return delay * 1000; // Convert to milliseconds
    }
    
    return 0;
  } catch (error) {
    logger.error('Error getting crawl delay', { 
      url,
      error: error instanceof Error ? error.message : String(error),
      action: 'robots_delay_error',
    });
    return 0;
  }
}

/**
 * Clear the robots.txt cache
 */
export function clearRobotsCache(): void {
  robotsCache.clear();
  logger.info('robots.txt cache cleared', { action: 'robots_cache_cleared' });
}

/**
 * Get cache statistics
 */
export function getRobotsCacheStats() {
  return {
    size: robotsCache.size,
    domains: Array.from(robotsCache.keys()),
  };
}
