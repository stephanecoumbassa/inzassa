<template>
  <div class="page-wrapper">
    <div class="hero">
      <div class="container">
        <h1 class="fade-in">{{ $t('home.title') }}</h1>
        <p class="fade-in delay-1">{{ $t('home.subtitle') }}</p>
        <div class="hero-stats fade-in delay-2">
          <div class="stat">
            <span class="stat-icon">📰</span>
            <span class="stat-label">{{ $t('home.multilingual') }}</span>
          </div>
          <div class="stat">
            <span class="stat-icon">🌍</span>
            <span class="stat-label">{{ $t('home.countries') }}</span>
          </div>
          <div class="stat">
            <span class="stat-icon">📚</span>
            <span class="stat-label">{{ $t('home.culture') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Featured News -->
      <section class="content-section">
        <div class="section-header">
          <h2>{{ $t('home.featured') }}</h2>
          <NuxtLink to="/news" class="view-all-link">
            {{ $t('home.viewAll') }} →
          </NuxtLink>
        </div>
        
        <div v-if="loading" class="skeleton-grid">
          <div v-for="i in 3" :key="i" class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
              <div class="skeleton-line"></div>
              <div class="skeleton-line short"></div>
            </div>
          </div>
        </div>

        <div v-else-if="featuredNews.length > 0" class="grid">
          <NewsCard
            v-for="article in featuredNews"
            :key="article._id"
            :news="article"
          />
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">📰</div>
          <h3>{{ $t('home.noFeaturedNews') }}</h3>
          <p>{{ $t('home.noFeaturedNewsDesc') }}</p>
        </div>
      </section>

      <!-- Ad Unit -->
      <AdUnit />

      <!-- Latest News -->
      <section class="content-section">
        <div class="section-header">
          <h2>{{ $t('home.latest') }}</h2>
          <NuxtLink to="/news" class="view-all-link">
            {{ $t('home.viewAll') }} →
          </NuxtLink>
        </div>

        <div v-if="loading" class="skeleton-grid">
          <div v-for="i in 6" :key="i" class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
              <div class="skeleton-line"></div>
              <div class="skeleton-line short"></div>
            </div>
          </div>
        </div>

        <div v-else-if="latestNews.length > 0" class="grid">
          <NewsCard
            v-for="article in latestNews"
            :key="article._id"
            :news="article"
          />
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>{{ $t('home.noLatestNews') }}</h3>
          <p>{{ $t('home.noLatestNewsDesc') }}</p>
          <NuxtLink to="/news" class="btn btn-primary">
            {{ $t('home.exploreNews') }}
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
const loading = ref(true);

const { data: featuredData, pending: featuredPending } = await useFetch('/api/news', {
  query: { featured: 'true', limit: 3 }
});

const { data: latestData, pending: latestPending } = await useFetch('/api/news', {
  query: { limit: 6 }
});

const featuredNews = computed(() => featuredData.value?.data || []);
const latestNews = computed(() => latestData.value?.data || []);

// Watch for loading state
watch([featuredPending, latestPending], ([featured, latest]) => {
  loading.value = featured || latest;
}, { immediate: true });
</script>

<style scoped>
.page-wrapper {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

.fade-in.delay-1 {
  animation-delay: 0.2s;
}

.fade-in.delay-2 {
  animation-delay: 0.4s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 4rem 0;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.3;
}

.hero .container {
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.hero p {
  font-size: 1.25rem;
  opacity: 0.95;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  font-size: 2.5rem;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
}

.stat-label {
  font-size: 0.95rem;
  font-weight: 500;
  opacity: 0.95;
}

.content-section {
  margin-bottom: 4rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid var(--primary-color);
}

.section-header h2 {
  font-size: 2rem;
  color: var(--primary-color);
  margin: 0;
  font-weight: 700;
}

.view-all-link {
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.view-all-link:hover {
  color: var(--primary-color);
  transform: translateX(5px);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--light-bg);
  border-radius: 12px;
  margin: 2rem 0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  display: inline-block;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary:hover {
  background-color: #234d24;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Skeleton loaders */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.skeleton-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.skeleton-image {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-content {
  padding: 1.5rem;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.skeleton-line.short {
  width: 60%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1.1rem;
  }

  .hero-stats {
    gap: 1.5rem;
  }

  .stat-icon {
    font-size: 2rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .skeleton-grid {
    grid-template-columns: 1fr;
  }
}
</style>
