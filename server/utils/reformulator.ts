import OpenAI from 'openai';
import logger from './logger.js';

/**
 * AI-powered content reformulation to avoid plagiarism
 * Uses OpenAI API to rewrite articles while preserving facts
 * 
 * Configure via environment variables:
 * - OPENAI_API_KEY: Your OpenAI API key
 * - OPENAI_MODEL: Model to use (default: gpt-3.5-turbo)
 * - REFORMULATION_ENABLED: Set to 'true' to enable (default: false)
 */

const REFORMULATION_ENABLED = process.env.REFORMULATION_ENABLED === 'true';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

let openai: OpenAI | null = null;

// Initialize OpenAI client only if enabled and API key is provided
if (REFORMULATION_ENABLED) {
  if (!process.env.OPENAI_API_KEY) {
    logger.warn('REFORMULATION_ENABLED is true but OPENAI_API_KEY is not set. Reformulation will be skipped.', { 
      action: 'reformulation_config_warning' 
    });
  } else {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    logger.info('OpenAI reformulation enabled', { 
      model: OPENAI_MODEL,
      action: 'reformulation_initialized' 
    });
  }
}

export interface ReformulatedArticle {
  title: string;
  content: string;
  summary: string;
}

/**
 * Reformulate an article using AI to create unique content
 * Preserves factual information while rewriting in a unique style
 */
export async function reformulateArticle(
  title: string,
  content: string
): Promise<ReformulatedArticle> {
  // If reformulation is not enabled or not configured, return original content
  if (!REFORMULATION_ENABLED || !openai) {
    return {
      title,
      content,
      summary: content.substring(0, 300) + '...',
    };
  }

  try {
    logger.info('Starting article reformulation', { 
      title: title.substring(0, 60),
      contentLength: content.length,
      action: 'reformulate_start',
    });

    const prompt = `Tu es un journaliste professionnel francophone d'Afrique. 

Ta mission : reformuler cet article de presse de manière unique et originale tout en préservant TOUS les faits, dates, noms et informations importantes. L'article reformulé doit :

1. Être entièrement réécrit avec tes propres mots
2. Conserver toutes les informations factuelles
3. Avoir un style journalistique professionnel
4. Être adapté à un public africain francophone
5. Éviter tout plagiat du texte original

Article original :
Titre : ${title}

Contenu : ${content}

Réponds UNIQUEMENT au format JSON suivant (sans code markdown, juste le JSON) :
{
  "title": "nouveau titre reformulé",
  "content": "contenu entièrement reformulé",
  "summary": "résumé en 2-3 phrases maximum"
}`;

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'Tu es un journaliste professionnel spécialisé dans la reformulation d\'articles. Tu réponds toujours en JSON valide.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const reformulatedText = response.choices[0].message.content;
    
    if (!reformulatedText) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse the JSON response
    const reformulated = JSON.parse(reformulatedText) as ReformulatedArticle;

    // Validate that all required fields are present
    if (!reformulated.title || !reformulated.content || !reformulated.summary) {
      throw new Error('Invalid response format from OpenAI');
    }

    logger.info('Article reformulation successful', {
      originalLength: content.length,
      reformulatedLength: reformulated.content.length,
      action: 'reformulate_success',
    });

    return reformulated;
  } catch (error) {
    logger.error('Reformulation failed, using original content', {
      error: error instanceof Error ? error.message : String(error),
      action: 'reformulate_error',
    });

    // Return original content if reformulation fails
    return {
      title,
      content,
      summary: content.substring(0, 300) + '...',
    };
  }
}

/**
 * Check if reformulation is enabled and configured
 */
export function isReformulationAvailable(): boolean {
  return REFORMULATION_ENABLED && openai !== null;
}

/**
 * Get reformulation configuration status
 */
export function getReformulationStatus() {
  return {
    enabled: REFORMULATION_ENABLED,
    configured: openai !== null,
    model: OPENAI_MODEL,
  };
}
