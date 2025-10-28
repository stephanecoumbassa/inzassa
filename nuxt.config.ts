// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/i18n',
  ],

  // Internationalization configuration
  i18n: {
    locales: [
      { code: 'fr', iso: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'es', iso: 'es-ES', name: 'Español', file: 'es.json' },
      { code: 'de', iso: 'de-DE', name: 'Deutsch', file: 'de.json' },
      { code: 'it', iso: 'it-IT', name: 'Italiano', file: 'it.json' },
      { code: 'ar', iso: 'ar-SA', name: 'العربية', file: 'ar.json' }
    ],
    defaultLocale: 'fr',
    lazy: true,
    langDir: 'locales/',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

  // Runtime configuration for environment variables
  runtimeConfig: {
    // Private keys (server-side only)
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/inzassa',
    
    // Public keys (exposed to client)
    public: {
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '',
      googleAdsenseId: process.env.GOOGLE_ADSENSE_ID || '',
    }
  },

  app: {
    head: {
      title: 'Inzassa - Actualités d\'Afrique Francophone',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Portail de news pour les pays francophones d\'Afrique avec traductions multilingues' 
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      script: []
    }
  },

  css: ['~/assets/css/main.css'],

  nitro: {
    plugins: ['~/server/plugins/mongodb.ts']
  }
})
