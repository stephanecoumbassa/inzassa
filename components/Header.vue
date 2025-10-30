<template>
  <header>
    <nav class="container">
      <div class="logo">
        <NuxtLink to="/" aria-label="Home - Inzassa">
          <span class="logo-icon">🌍</span>
          INZASSA
        </NuxtLink>
      </div>
      
      <!-- Mobile menu toggle -->
      <button 
        class="mobile-menu-toggle" 
        @click="mobileMenuOpen = !mobileMenuOpen"
        :aria-expanded="mobileMenuOpen"
        aria-label="Toggle navigation menu"
      >
        <span v-if="!mobileMenuOpen">☰</span>
        <span v-else>✕</span>
      </button>

      <!-- Navigation menu -->
      <ul :class="{ 'mobile-open': mobileMenuOpen }">
        <li><NuxtLink to="/" @click="closeMobileMenu">{{ $t('nav.home') }}</NuxtLink></li>
        <li><NuxtLink to="/news" @click="closeMobileMenu">{{ $t('nav.news') }}</NuxtLink></li>
        <li><NuxtLink to="/books" @click="closeMobileMenu">{{ $t('nav.books') }}</NuxtLink></li>
        <li><NuxtLink to="/countries" @click="closeMobileMenu">{{ $t('nav.countries') }}</NuxtLink></li>
      </ul>

      <!-- Language selector dropdown -->
      <div class="language-selector">
        <button 
          class="language-btn" 
          @click="languageMenuOpen = !languageMenuOpen"
          :aria-expanded="languageMenuOpen"
          aria-label="Select language"
        >
          <span class="language-icon">🌐</span>
          {{ locale.toUpperCase() }}
          <span class="dropdown-arrow">▼</span>
        </button>
        <div v-if="languageMenuOpen" class="language-dropdown">
          <NuxtLink
            v-for="loc in allLocales"
            :key="loc.code"
            :to="switchLocalePath(loc.code)"
            @click="closeLanguageMenu"
            :class="{ active: loc.code === locale }"
            class="language-option"
          >
            {{ loc.name }}
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const mobileMenuOpen = ref(false);
const languageMenuOpen = ref(false);

const allLocales = computed(() => locales.value);

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const closeLanguageMenu = () => {
  languageMenuOpen.value = false;
};

// Close menus when clicking outside
if (process.client) {
  onMounted(() => {
    document.addEventListener('click', (e) => {
      const header = document.querySelector('header');
      if (header && !header.contains(e.target)) {
        mobileMenuOpen.value = false;
        languageMenuOpen.value = false;
      }
    });
  });
}
</script>

<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  transition: transform 0.3s;
}

.logo a:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 1.8rem;
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: opacity 0.3s;
}

.mobile-menu-toggle:hover {
  opacity: 0.8;
}

nav ul {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

nav ul li {
  margin: 0;
}

nav a {
  color: white;
  text-decoration: none;
  transition: all 0.3s;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  position: relative;
}

nav a:hover,
nav a:focus {
  background-color: rgba(255, 255, 255, 0.1);
  outline: 2px solid rgba(255, 255, 255, 0.3);
}

nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.language-selector {
  position: relative;
}

.language-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s;
}

.language-btn:hover,
.language-btn:focus {
  background: rgba(255, 255, 255, 0.3);
  outline: 2px solid rgba(255, 255, 255, 0.3);
}

.language-icon {
  font-size: 1.2rem;
}

.dropdown-arrow {
  font-size: 0.7rem;
  transition: transform 0.3s;
}

.language-btn:hover .dropdown-arrow {
  transform: translateY(2px);
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.language-option {
  display: block;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.2s;
}

.language-option:hover {
  background-color: var(--light-bg);
}

.language-option.active {
  background-color: var(--primary-color);
  color: white;
  font-weight: 600;
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }

  nav ul {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: var(--primary-color);
    gap: 0;
    padding: 0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  nav ul.mobile-open {
    max-height: 300px;
  }

  nav ul li {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  nav ul li a {
    display: block;
    padding: 1rem 1.5rem;
    border-radius: 0;
  }
}
</style>
