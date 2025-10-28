# Guide d'implémentation - Scraping et Traduction

Ce guide explique comment implémenter la collecte automatique d'actualités et la traduction multilingue.

## 1. Scraping d'Actualités

### Sites Sources Recommandés

**Sénégal:**
- Seneweb: https://www.seneweb.com/
- Dakaractu: https://www.dakaractu.com/
- Leral.net: https://www.leral.net/

**Côte d'Ivoire:**
- Abidjan.net: https://news.abidjan.net/
- Connectionivoirienne: https://connectionivoirienne.net/

**Cameroun:**
- CamerounWeb: https://www.camerounweb.com/
- Journal du Cameroun: https://www.journalducameroun.com/

**Mali:**
- Malijet: https://malijet.com/
- Maliweb: https://www.maliweb.net/

### Exemple de Script de Scraping

Créer `server/utils/scraper.ts`:

```typescript
import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedArticle {
  title: string;
  content: string;
  imageUrl?: string;
  originalUrl: string;
  publishedAt?: Date;
}

// Scraper générique
export async function scrapeArticle(url: string, config: {
  titleSelector: string;
  contentSelector: string;
  imageSelector?: string;
  dateSelector?: string;
}): Promise<ScrapedArticle> {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(data);

    const title = $(config.titleSelector).text().trim();
    const content = $(config.contentSelector).text().trim();
    const imageUrl = config.imageSelector 
      ? $(config.imageSelector).attr('src') 
      : undefined;
    
    let publishedAt: Date | undefined;
    if (config.dateSelector) {
      const dateText = $(config.dateSelector).text().trim();
      publishedAt = new Date(dateText);
    }

    return {
      title,
      content,
      imageUrl,
      originalUrl: url,
      publishedAt
    };
  } catch (error) {
    console.error('Erreur de scraping:', error);
    throw error;
  }
}

// Scrapers spécifiques par site
export const scraperConfigs = {
  seneweb: {
    titleSelector: 'h1.article-title',
    contentSelector: '.article-content',
    imageSelector: '.article-image img',
    dateSelector: '.article-date'
  },
  dakaractu: {
    titleSelector: 'h1.title',
    contentSelector: '.content',
    imageSelector: '.featured-image img'
  },
  // Ajouter d'autres configurations...
};

// Fonction pour scraper un site spécifique
export async function scrapeSeneweb(articleUrl: string) {
  return scrapeArticle(articleUrl, scraperConfigs.seneweb);
}
```

### Script de Collecte Automatique

Créer `scripts/collect-news.js`:

```javascript
import mongoose from 'mongoose';
import { scrapeArticle, scraperConfigs } from '../server/utils/scraper.ts';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inzassa';

// Liste d'URLs à scraper
const articlesToScrape = [
  { url: 'https://www.seneweb.com/article-123', site: 'seneweb', country: 'senegal', category: 'politique' },
  { url: 'https://www.dakaractu.com/article-456', site: 'dakaractu', country: 'senegal', category: 'economie' },
  // Ajouter plus d'URLs...
];

async function collectNews() {
  await mongoose.connect(MONGODB_URI);

  for (const item of articlesToScrape) {
    try {
      console.log(`Scraping: ${item.url}`);
      
      const article = await scrapeArticle(item.url, scraperConfigs[item.site]);
      
      // Traduire le contenu (voir section traduction)
      const translations = await translateArticle(article);
      
      // Sauvegarder dans MongoDB
      await News.create({
        title: translations.title,
        content: translations.content,
        summary: translations.summary,
        originalUrl: article.originalUrl,
        country: item.country,
        category: item.category,
        imageUrl: article.imageUrl,
        publishedAt: article.publishedAt || new Date(),
        scrapedAt: new Date()
      });
      
      console.log(`✅ Article sauvegardé: ${article.title}`);
    } catch (error) {
      console.error(`❌ Erreur pour ${item.url}:`, error.message);
    }
  }

  await mongoose.disconnect();
  console.log('Collecte terminée!');
}

collectNews();
```

## 2. Traduction Automatique

### Option 1: Google Cloud Translation API

```bash
npm install @google-cloud/translate
```

Créer `server/utils/translator.ts`:

```typescript
import { Translate } from '@google-cloud/translate/build/src/v2';

const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY
});

export async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error('Erreur de traduction:', error);
    return text; // Retourner le texte original en cas d'erreur
  }
}

export async function translateArticle(article: {
  title: string;
  content: string;
}) {
  const languages = ['en', 'es', 'de', 'it', 'ar'];
  
  const translations = {
    title: { fr: article.title },
    content: { fr: article.content },
    summary: { fr: article.content.substring(0, 300) + '...' }
  };

  for (const lang of languages) {
    translations.title[lang] = await translateText(article.title, lang);
    translations.content[lang] = await translateText(article.content, lang);
    translations.summary[lang] = await translateText(translations.summary.fr, lang);
  }

  return translations;
}
```

### Option 2: DeepL API (Plus précis)

```bash
npm install deepl-node
```

```typescript
import * as deepl from 'deepl-node';

const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

export async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  try {
    const result = await translator.translateText(
      text,
      'fr',
      targetLanguage as deepl.TargetLanguageCode
    );
    return result.text;
  } catch (error) {
    console.error('Erreur de traduction DeepL:', error);
    return text;
  }
}
```

### Option 3: LibreTranslate (Gratuit, Open Source)

```bash
npm install libretranslate
```

```typescript
import fetch from 'node-fetch';

const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com';

export async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  try {
    const response = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: text,
        source: 'fr',
        target: targetLanguage,
        format: 'text'
      })
    });

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Erreur LibreTranslate:', error);
    return text;
  }
}
```

## 3. Reformulation avec IA

Pour reformuler les articles et éviter le plagiat, utiliser une API d'IA:

### Avec OpenAI

```bash
npm install openai
```

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function reformulateArticle(
  title: string,
  content: string
): Promise<{ title: string; content: string; summary: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Tu es un journaliste professionnel. Reformule cet article de manière unique tout en préservant les informations factuelles.'
        },
        {
          role: 'user',
          content: `Titre: ${title}\n\nContenu: ${content}`
        }
      ],
      temperature: 0.7
    });

    const reformulated = response.choices[0].message.content;
    
    // Parser la réponse pour extraire titre, contenu et résumé
    // Adapter selon le format de réponse
    
    return {
      title: reformulated.split('\n')[0],
      content: reformulated,
      summary: reformulated.substring(0, 300)
    };
  } catch (error) {
    console.error('Erreur de reformulation:', error);
    return { title, content, summary: content.substring(0, 300) };
  }
}
```

## 4. Automatisation avec Cron Jobs

Créer `scripts/cron-scraper.js`:

```javascript
import cron from 'node-cron';
import { collectNews } from './collect-news.js';

// Exécuter toutes les heures
cron.schedule('0 * * * *', async () => {
  console.log('🕐 Démarrage de la collecte automatique...');
  try {
    await collectNews();
    console.log('✅ Collecte terminée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la collecte:', error);
  }
});

console.log('⏰ Cron job configuré - Collecte toutes les heures');
```

Lancer avec:
```bash
node scripts/cron-scraper.js
```

Ou avec PM2 pour production:
```bash
npm install -g pm2
pm2 start scripts/cron-scraper.js --name "news-scraper"
pm2 save
pm2 startup
```

## 5. Configuration des Variables d'Environnement

Ajouter dans `.env`:

```env
# APIs de traduction
GOOGLE_TRANSLATE_API_KEY=your-key-here
DEEPL_API_KEY=your-key-here
LIBRETRANSLATE_URL=https://libretranslate.com

# OpenAI pour reformulation
OPENAI_API_KEY=your-key-here
```

## 6. Respect des Robots.txt et Limites

Toujours vérifier `robots.txt` des sites:
```
https://www.seneweb.com/robots.txt
```

Implémenter un délai entre les requêtes:

```typescript
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Utiliser dans la boucle de scraping
await delay(2000); // 2 secondes entre chaque requête
```

## 7. Gestion des Erreurs et Logs

Créer un système de logs:

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Utiliser
logger.info('Article scrapé', { url, title });
logger.error('Erreur de scraping', { url, error: error.message });
```

## Considérations Légales

⚠️ **Important:**
- Toujours respecter les conditions d'utilisation des sites sources
- Citer clairement les sources (champ `originalUrl`)
- Ne pas surcharger les serveurs sources
- Respecter les droits d'auteur
- Considérer l'utilisation d'APIs officielles quand disponibles

## Prochaines Étapes

1. Tester le scraping sur quelques articles
2. Vérifier la qualité des traductions
3. Ajuster les sélecteurs CSS selon les sites
4. Mettre en place le monitoring
5. Déployer le cron job en production
