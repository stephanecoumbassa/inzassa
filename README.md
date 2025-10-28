# Inzassa - Portail de News pour l'Afrique Francophone

Inzassa est un portail d'actualités multilingue dédié aux pays francophones d'Afrique. Il offre des articles traduits en plusieurs langues, des résumés de livres d'auteurs africains, et des présentations détaillées des pays.

## Fonctionnalités

- 📰 **Actualités multilingues** : Articles en français, anglais, espagnol, allemand, italien et arabe
- 📚 **Bibliothèque de livres** : Résumés de livres d'auteurs africains célèbres
- 🌍 **Présentation des pays** : Informations détaillées sur les pays francophones d'Afrique
- 💰 **Monétisation** : Intégration Google AdSense pour la génération de revenus
- 📊 **Analytics** : Suivi des visiteurs avec Google Analytics
- 🔍 **Filtres avancés** : Filtrage par pays, catégorie, auteur
- 📱 **Responsive** : Design adaptatif pour mobile, tablette et desktop

## Technologies

- **Frontend & Backend** : Nuxt 3 (Vue.js)
- **Base de données** : MongoDB avec Mongoose
- **Internationalisation** : @nuxtjs/i18n
- **Scraping** : Axios + Cheerio (pour récupérer les actualités)
- **Traduction** : Structure multilingue avec Maps pour stockage

## Pays couverts

- Sénégal, Mali, Burkina Faso, Niger, Côte d'Ivoire
- Bénin, Togo, Guinée, Cameroun, Gabon
- Congo, RDC, Madagascar, Tunisie, Maroc, Algérie

## Installation

### Prérequis

- Node.js 18+ 
- MongoDB 5+
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/stephanecoumbassa/inzassa.git
cd inzassa
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Éditer le fichier `.env` :
```
MONGODB_URI=mongodb://localhost:27017/inzassa
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

4. **Démarrer MongoDB**
```bash
# Avec Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou avec installation locale
mongod
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

6. **Vérifier l'installation (optionnel)**
```bash
npm run verify
```

Cette commande vérifie que toutes les dépendances et utilitaires sont correctement installés.

## Structure du projet

```
inzassa/
├── assets/css/              # Styles globaux
├── components/              # Composants Vue
├── locales/                 # Fichiers de traduction (fr, en, es, de, it, ar)
├── pages/                   # Pages de l'application
│   ├── index.vue           # Page d'accueil
│   ├── news/               # Actualités
│   ├── books/              # Livres
│   └── countries/          # Pays
├── server/
│   ├── api/                # Routes API
│   ├── models/             # Modèles MongoDB
│   └── plugins/            # Plugins serveur
└── nuxt.config.ts          # Configuration Nuxt
```

## Modèles de données

### News (Actualités)
- Titres et contenu multilingues (fr, en, es, de, it, ar)
- Catégories : politique, économie, sport, culture, société, international
- Filtrage par pays et catégorie

### Book (Livres)
- Informations sur les auteurs africains célèbres
- Résumés multilingues
- Catégorisation par pays et genre

### Country (Pays)
- Présentation détaillée des pays francophones d'Afrique
- Informations : géographie, économie, culture, histoire
- Galerie d'images

## API Endpoints

### Actualités
- `GET /api/news` - Liste des actualités (filtres: country, category, featured, page, limit)
- `GET /api/news/:id` - Détail d'une actualité

### Livres
- `GET /api/books` - Liste des livres (filtres: country, author, featured, page, limit)

### Pays
- `GET /api/countries` - Liste des pays
- `GET /api/countries/:code` - Détail d'un pays

## Configuration Google

### Google Analytics
1. Créer un compte sur [Google Analytics](https://analytics.google.com/)
2. Créer une propriété GA4
3. Copier l'ID de mesure (format: G-XXXXXXXXXX)
4. Ajouter dans `.env`: `GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX`

### Google AdSense
1. Créer un compte sur [Google AdSense](https://www.google.com/adsense/)
2. Ajouter votre site
3. Copier l'ID éditeur (format: ca-pub-XXXXXXXXXXXXXXXX)
4. Ajouter dans `.env`: `GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX`

## Collecte et traduction des actualités

Pour alimenter la base de données avec des actualités :

1. **Scraping** : Utiliser Axios + Cheerio pour extraire le contenu des sites d'actualités
2. **Traduction** : Intégrer un service comme Google Translate API, DeepL, ou LibreTranslate
3. **Reformulation** : Utiliser des APIs d'IA (OpenAI, Claude) pour reformuler les articles

Exemple de script de scraping à créer dans `/server/utils/scraper.ts`

## Déploiement

### Production Build
```bash
npm run build
npm run preview
```

### Génération statique
```bash
npm run generate
```

Déployable sur Vercel, Netlify, ou avec Docker.

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation
- Ajouter des traductions

## Licence

ISC

## Roadmap

- [ ] Système de scraping automatisé
- [ ] API de traduction automatique
- [ ] Système de commentaires
- [ ] Newsletter par email
- [ ] Application mobile
- [ ] Section vidéo et podcast
