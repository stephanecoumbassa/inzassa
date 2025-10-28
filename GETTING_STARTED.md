# Guide de Démarrage - Inzassa

## Installation Rapide

### 1. Prérequis
- Node.js 18+
- MongoDB 5+
- npm ou yarn

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration de l'environnement

Créer un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Éditer le fichier `.env` avec vos informations :

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/inzassa

# Google Analytics (optionnel)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Google AdSense (optionnel)
GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

### 4. Démarrer MongoDB

**Avec Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Avec MongoDB installé localement:**
```bash
mongod
```

### 5. Peupler la base de données avec des exemples

```bash
node scripts/seed.js
```

Ce script crée des exemples de:
- 3 actualités (Sénégal, Cameroun, Côte d'Ivoire)
- 3 livres d'auteurs africains célèbres
- 2 fiches pays (Sénégal, Cameroun)

### 6. Lancer le serveur de développement

```bash
npm run dev
```

Le site sera accessible sur **http://localhost:3000**

### 7. Build pour production

```bash
npm run build
npm run preview
```

## Structure de la Base de Données

### Collection: News (Actualités)

Exemple d'entrée:
```javascript
{
  title: {
    fr: "Titre en français",
    en: "Title in English",
    es: "Título en español",
    // etc.
  },
  content: {
    fr: "Contenu complet en français...",
    en: "Full content in English...",
    // etc.
  },
  summary: {
    fr: "Résumé court...",
    en: "Short summary...",
    // etc.
  },
  originalUrl: "https://source.com/article",
  country: "senegal", // ou mali, cameroon, etc.
  category: "economie", // politique, economie, sport, culture, societe, international
  imageUrl: "https://example.com/image.jpg",
  publishedAt: new Date(),
  featured: false // true pour afficher en une
}
```

### Collection: Books (Livres)

Exemple d'entrée:
```javascript
{
  title: "Une si longue lettre",
  author: "Mariama Bâ",
  summary: {
    fr: "Résumé en français...",
    en: "Summary in English...",
    // etc.
  },
  country: "senegal",
  publishedYear: 1979,
  coverImage: "https://example.com/cover.jpg",
  genre: "Roman",
  isbn: "978-XXXXXXXXXX",
  featured: true
}
```

### Collection: Countries (Pays)

Exemple d'entrée:
```javascript
{
  name: "Sénégal",
  code: "senegal",
  description: {
    fr: "Description en français...",
    en: "Description in English...",
    // etc.
  },
  capital: "Dakar",
  population: 17196308,
  languages: ["Français", "Wolof", "Pulaar"],
  currency: "Franc CFA (XOF)",
  flag: "https://example.com/flag.svg",
  geography: {
    fr: "Informations géographiques...",
    // etc.
  },
  economy: {
    fr: "Informations économiques...",
    // etc.
  },
  culture: {
    fr: "Informations culturelles...",
    // etc.
  },
  history: {
    fr: "Informations historiques...",
    // etc.
  },
  images: ["url1.jpg", "url2.jpg"],
  featured: true
}
```

## Ajout d'actualités

### Méthode 1: Via MongoDB directement

```javascript
// Connectez-vous à MongoDB
mongosh

// Utilisez la base de données
use inzassa

// Insérez une actualité
db.news.insertOne({
  title: {
    fr: "Nouvelle actualité",
    en: "New article"
  },
  content: {
    fr: "Contenu...",
    en: "Content..."
  },
  summary: {
    fr: "Résumé...",
    en: "Summary..."
  },
  originalUrl: "https://example.com",
  country: "senegal",
  category: "politique",
  publishedAt: new Date(),
  featured: false
})
```

### Méthode 2: Créer un script de scraping

Créer un fichier `scripts/scraper.js`:

```javascript
import axios from 'axios';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';

// Fonction de scraping (exemple)
async function scrapeNews(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  
  // Adapter selon la structure du site
  const title = $('h1.article-title').text();
  const content = $('.article-content').text();
  const imageUrl = $('.article-image').attr('src');
  
  return { title, content, imageUrl };
}

// Fonction de traduction (à implémenter avec une API)
async function translateText(text, targetLang) {
  // Utiliser Google Translate API, DeepL, ou autre
  // Retourner le texte traduit
}
```

## Configuration Google

### Google Analytics

1. Créer un compte sur https://analytics.google.com/
2. Créer une propriété GA4
3. Copier l'ID (format: G-XXXXXXXXXX)
4. Ajouter dans `.env`:
   ```
   GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```

### Google AdSense

1. Créer un compte sur https://www.google.com/adsense/
2. Ajouter votre site
3. Copier l'ID éditeur (format: ca-pub-XXXXXXXXXXXXXXXX)
4. Ajouter dans `.env`:
   ```
   GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```
5. Personnaliser les emplacements d'annonces dans `components/AdUnit.vue`

## API Endpoints

### Actualités
- `GET /api/news` - Liste des actualités
  - Query params: `country`, `category`, `featured`, `page`, `limit`
- `GET /api/news/:id` - Détail d'une actualité

### Livres
- `GET /api/books` - Liste des livres
  - Query params: `country`, `author`, `featured`, `page`, `limit`

### Pays
- `GET /api/countries` - Liste des pays
  - Query params: `featured`
- `GET /api/countries/:code` - Détail d'un pays

## Pages Disponibles

- `/` - Page d'accueil avec actualités à la une
- `/news` - Liste de toutes les actualités avec filtres
- `/news/:id` - Détail d'une actualité
- `/books` - Bibliothèque de livres d'auteurs africains
- `/countries` - Liste des pays francophones
- `/countries/:code` - Détail d'un pays

Chaque page est disponible en 6 langues (préfixe: `/en/`, `/es/`, `/de/`, `/it/`, `/ar/`)

## Déploiement

### Vercel / Netlify
```bash
npm run build
# Ou pour génération statique:
npm run generate
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

## Résolution de Problèmes

### MongoDB ne se connecte pas
- Vérifier que MongoDB est démarré
- Vérifier l'URL dans `.env`
- Vérifier les permissions réseau/firewall

### Erreur de build
- Supprimer `node_modules` et `package-lock.json`
- Réinstaller: `npm install`
- Re-build: `npm run build`

### Les traductions ne s'affichent pas
- Vérifier que les fichiers dans `locales/` sont présents
- Vérifier la configuration i18n dans `nuxt.config.ts`

## Prochaines Étapes

1. **Implémenter le scraping automatisé**: Créer des scripts pour récupérer automatiquement les actualités des sites sources

2. **Ajouter la traduction automatique**: Intégrer une API de traduction (Google Translate, DeepL, LibreTranslate)

3. **Créer un backoffice**: Développer une interface d'administration pour gérer le contenu

4. **Ajouter l'authentification**: Permettre aux utilisateurs de créer des comptes, commenter, etc.

5. **Optimiser le SEO**: Ajouter des métadonnées, sitemaps, etc.

6. **Améliorer les performances**: Mise en cache, CDN, optimisation d'images

## Support

Pour toute question ou problème, consultez la documentation de:
- [Nuxt 3](https://nuxt.com/docs)
- [MongoDB](https://docs.mongodb.com/)
- [Vue 3](https://vuejs.org/)
