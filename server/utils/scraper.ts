import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedArticle {
  title: string;
  content: string;
  imageUrl?: string;
  originalUrl: string;
  publishedAt?: Date;
}

export interface ScraperConfig {
  titleSelector: string;
  contentSelector: string;
  imageSelector?: string;
  dateSelector?: string;
}

/**
 * Generic article scraper that works with configurable CSS selectors
 */
export async function scrapeArticle(
  url: string,
  config: ScraperConfig
): Promise<ScrapedArticle> {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    // Extract title
    const title = $(config.titleSelector).first().text().trim();
    if (!title) {
      throw new Error('Could not extract title from article');
    }

    // Extract content
    let content = '';
    $(config.contentSelector).each((_, element) => {
      const text = $(element).text().trim();
      if (text) {
        content += text + '\n\n';
      }
    });
    content = content.trim();

    if (!content) {
      throw new Error('Could not extract content from article');
    }

    // Extract image URL (optional)
    let imageUrl: string | undefined;
    if (config.imageSelector) {
      const imgSrc = $(config.imageSelector).first().attr('src');
      if (imgSrc) {
        // Handle relative URLs
        imageUrl = imgSrc.startsWith('http') ? imgSrc : new URL(imgSrc, url).href;
      }
    }

    // Extract publish date (optional)
    let publishedAt: Date | undefined;
    if (config.dateSelector) {
      const dateText = $(config.dateSelector).first().text().trim();
      if (dateText) {
        const parsedDate = new Date(dateText);
        if (!isNaN(parsedDate.getTime())) {
          publishedAt = parsedDate;
        }
      }
    }

    return {
      title,
      content,
      imageUrl,
      originalUrl: url,
      publishedAt: publishedAt || new Date(),
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch article from ${url}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Pre-configured scrapers for common African news sites
 * These are example configurations and may need adjustment based on actual site structures
 */
export const scraperConfigs: Record<string, ScraperConfig> = {
  seneweb: {
    titleSelector: 'h1.article-title, h1.entry-title, .article-header h1',
    contentSelector: '.article-content p, .entry-content p, .article-body p',
    imageSelector: '.article-image img, .entry-image img, .featured-image img',
    dateSelector: '.article-date, .entry-date, .published-date',
  },
  dakaractu: {
    titleSelector: 'h1.title, h1.article-title',
    contentSelector: '.content p, .article-content p',
    imageSelector: '.featured-image img, .article-img img',
    dateSelector: '.date, .article-date',
  },
  camerounweb: {
    titleSelector: 'h1.article-title, .news-title h1',
    contentSelector: '.article-body p, .news-content p',
    imageSelector: '.article-image img',
    dateSelector: '.article-date',
  },
  abidjannet: {
    titleSelector: 'h1, .article-title',
    contentSelector: '.article-content p, .news-body p',
    imageSelector: '.article-img img',
    dateSelector: '.date-published',
  },
  malijet: {
    titleSelector: 'h1.entry-title, h1.article-title',
    contentSelector: '.entry-content p, .article-text p',
    imageSelector: '.entry-image img',
    dateSelector: '.entry-date',
  },
};

/**
 * Delay helper to respect rate limits
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
