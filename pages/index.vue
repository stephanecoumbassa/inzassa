<template>
  <div>
    <div class="hero">
      <div class="container">
        <h1>{{ $t('home.title') }}</h1>
        <p>{{ $t('home.subtitle') }}</p>
      </div>
    </div>

    <div class="container">
      <!-- Featured News -->
      <section>
        <h2>{{ $t('home.featured') }}</h2>
        <div class="grid">
          <NewsCard
            v-for="article in featuredNews"
            :key="article._id"
            :news="article"
          />
        </div>
      </section>

      <!-- Ad Unit -->
      <AdUnit />

      <!-- Latest News -->
      <section>
        <h2>{{ $t('home.latest') }}</h2>
        <div class="grid">
          <NewsCard
            v-for="article in latestNews"
            :key="article._id"
            :news="article"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: featuredData } = await useFetch('/api/news', {
  query: { featured: 'true', limit: 3 }
});

const { data: latestData } = await useFetch('/api/news', {
  query: { limit: 6 }
});

const featuredNews = computed(() => featuredData.value?.data || []);
const latestNews = computed(() => latestData.value?.data || []);
</script>
