<template>
  <article class="card" role="article" :aria-label="getTitle()">
    <NuxtLink :to="`/news/${news._id}`" class="card-link">
      <div class="card-image-wrapper">
        <img
          v-if="news.imageUrl"
          :src="news.imageUrl"
          :alt="getTitle()"
          loading="lazy"
        />
        <div v-else class="placeholder-image">
          <span class="placeholder-icon">📰</span>
        </div>
        <span class="category-tag">{{ $t(`categories.${news.category}`) }}</span>
      </div>
      <div class="card-content">
        <h3 class="card-title">{{ getTitle() }}</h3>
        <div class="card-meta">
          <span class="meta-item">
            <span class="meta-icon">🌍</span>
            {{ news.country }}
          </span>
          <span class="meta-divider">•</span>
          <span class="meta-item">
            <span class="meta-icon">📅</span>
            {{ formatDate(news.publishedAt) }}
          </span>
        </div>
        <p class="card-summary">{{ getSummary() }}</p>
        <span class="read-more-btn">
          {{ $t('news.readMore') }}
          <span class="arrow">→</span>
        </span>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup>
const props = defineProps({
  news: Object
});

const { locale, t } = useI18n();

const getTitle = () => {
  return props.news.title?.[locale.value] || props.news.title?.fr || 'No title';
};

const getSummary = () => {
  const summary = props.news.summary?.[locale.value] || props.news.summary?.fr || '';
  return summary.substring(0, 150) + (summary.length > 150 ? '...' : '');
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--light-bg);
}

.card-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card:hover .card-image-wrapper img {
  transform: scale(1.08);
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--light-bg), #e8e8e8);
}

.placeholder-icon {
  font-size: 3rem;
  opacity: 0.4;
}

.category-tag {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: inline-block;
  padding: 0.4rem 1rem;
  background-color: var(--secondary-color);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.card-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card:hover .card-title {
  color: var(--secondary-color);
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.meta-icon {
  font-size: 1rem;
}

.meta-divider {
  color: #ccc;
}

.card-summary {
  flex-grow: 1;
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.read-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.arrow {
  transition: transform 0.3s;
}

.card:hover .read-more-btn {
  color: var(--secondary-color);
}

.card:hover .arrow {
  transform: translateX(5px);
}

.card:focus-within {
  outline: 3px solid var(--secondary-color);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .card-title {
    font-size: 1.1rem;
  }

  .card-meta {
    font-size: 0.8rem;
  }

  .card-summary {
    font-size: 0.9rem;
  }
}
</style>
