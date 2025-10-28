/**
 * Translation utility using LibreTranslate (free, open-source translation API)
 * Can be configured to use either:
 * 1. Public LibreTranslate instance (default)
 * 2. Self-hosted instance
 * 3. Custom API endpoint
 */

export interface TranslationMap {
  fr: string;
  en: string;
  es: string;
  de: string;
  it: string;
  ar: string;
}

const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com';

/**
 * Translate text from French to a target language
 */
export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'fr'
): Promise<string> {
  // If target is the same as source, return original text
  if (targetLanguage === sourceLanguage) {
    return text;
  }

  try {
    const response = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API returned status ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    console.error(`Translation error (${sourceLanguage} -> ${targetLanguage}):`, error);
    // Return original text if translation fails
    return text;
  }
}

/**
 * Translate text to all supported languages
 */
export async function translateToAllLanguages(
  text: string,
  sourceLanguage: string = 'fr'
): Promise<TranslationMap> {
  const languages: Array<keyof TranslationMap> = ['fr', 'en', 'es', 'de', 'it', 'ar'];
  const translations: Partial<TranslationMap> = {};

  // Set source language
  translations[sourceLanguage as keyof TranslationMap] = text;

  // Translate to other languages
  for (const lang of languages) {
    if (lang !== sourceLanguage) {
      try {
        translations[lang] = await translateText(text, lang, sourceLanguage);
        // Add a small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to translate to ${lang}:`, error);
        translations[lang] = text; // Fallback to original text
      }
    }
  }

  return translations as TranslationMap;
}

/**
 * Translate an article (title, content, summary) to all languages
 */
export async function translateArticle(article: {
  title: string;
  content: string;
  summary?: string;
}): Promise<{
  title: TranslationMap;
  content: TranslationMap;
  summary: TranslationMap;
}> {
  console.log('Translating article:', article.title.substring(0, 50) + '...');

  // Generate summary if not provided (first 300 characters)
  const summary = article.summary || article.content.substring(0, 300) + '...';

  // Translate all fields
  const [titleTranslations, contentTranslations, summaryTranslations] = await Promise.all([
    translateToAllLanguages(article.title),
    translateToAllLanguages(article.content),
    translateToAllLanguages(summary),
  ]);

  return {
    title: titleTranslations,
    content: contentTranslations,
    summary: summaryTranslations,
  };
}

/**
 * Check if LibreTranslate service is available
 */
export async function checkTranslationService(): Promise<boolean> {
  try {
    const response = await fetch(`${LIBRETRANSLATE_URL}/languages`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('Translation service check failed:', error);
    return false;
  }
}
