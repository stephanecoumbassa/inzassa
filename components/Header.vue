<template>
  <header>
    <nav class="container">
      <div class="logo">
        <NuxtLink to="/">
          INZASSA
        </NuxtLink>
      </div>
      <ul>
        <li><NuxtLink to="/">{{ $t('nav.home') }}</NuxtLink></li>
        <li><NuxtLink to="/news">{{ $t('nav.news') }}</NuxtLink></li>
        <li><NuxtLink to="/books">{{ $t('nav.books') }}</NuxtLink></li>
        <li><NuxtLink to="/countries">{{ $t('nav.countries') }}</NuxtLink></li>
      </ul>
      <div class="language-selector">
        <NuxtLink
          v-for="locale in availableLocales"
          :key="locale.code"
          :to="switchLocalePath(locale.code)"
        >
          {{ locale.code.toUpperCase() }}
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup>
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const availableLocales = computed(() => {
  return (locales.value).filter(i => i.code !== locale.value);
});
</script>
