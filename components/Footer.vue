<template>
  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-logo">
            <span class="logo-icon">🌍</span>
            INZASSA
          </h3>
          <p class="footer-desc">{{ $t('footer.description') }}</p>
        </div>
        
        <div class="footer-section">
          <h4>{{ $t('nav.home') }}</h4>
          <ul class="footer-links">
            <li><NuxtLink to="/">{{ $t('nav.home') }}</NuxtLink></li>
            <li><NuxtLink to="/news">{{ $t('nav.news') }}</NuxtLink></li>
            <li><NuxtLink to="/books">{{ $t('nav.books') }}</NuxtLink></li>
            <li><NuxtLink to="/countries">{{ $t('nav.countries') }}</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>{{ $t('footer.languages') }}</h4>
          <div class="footer-languages">
            <span>🇫🇷 Français</span>
            <span>🇬🇧 English</span>
            <span>🇪🇸 Español</span>
            <span>🇩🇪 Deutsch</span>
            <span>🇮🇹 Italiano</span>
            <span>🇸🇦 العربية</span>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>{{ $t('footer.copyright') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
footer {
  background: linear-gradient(135deg, #1a3a1b, var(--primary-color));
  color: white;
  padding: 3rem 0 1rem;
  margin-top: 4rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 1rem;
  font-weight: 600;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  color: white;
}

.logo-icon {
  font-size: 1.8rem;
}

.footer-desc {
  opacity: 0.9;
  line-height: 1.6;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
  display: inline-block;
}

.footer-links a:hover {
  color: white;
  transform: translateX(5px);
}

.footer-languages {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-languages span {
  opacity: 0.9;
  font-size: 0.95rem;
}

.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  opacity: 0.8;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  footer {
    padding: 2rem 0 1rem;
  }
}
</style>
