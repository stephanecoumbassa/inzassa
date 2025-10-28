<template>
  <div class="container">
    <article v-if="newsItem">
      <span class="category-tag">{{ $t(`categories.${newsItem.category}`) }}</span>
      <h1 style="margin: 1rem 0;">{{ getTitle() }}</h1>
      
      <div class="card-meta" style="margin-bottom: 2rem;">
        {{ newsItem.country }} • {{ formatDate(newsItem.publishedAt) }}
      </div>

      <img
        v-if="newsItem.imageUrl"
        :src="newsItem.imageUrl"
        :alt="getTitle()"
        style="width: 100%; max-height: 500px; object-fit: cover; border-radius: 8px; margin-bottom: 2rem;"
      />

      <div v-html="getContent()" style="line-height: 1.8; font-size: 1.1rem;"></div>

      <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border-color);">
        <p>
          <strong>{{ $t('news.source') }}:</strong>
          <a :href="newsItem.originalUrl" target="_blank" rel="noopener">
            {{ newsItem.originalUrl }}
          </a>
        </p>
      </div>

      <!-- Ad Unit -->
      <AdUnit />
    </article>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const { locale } = useI18n();

const { data } = await useFetch(`/api/news/${route.params.id}`);
const newsItem = computed(() => data.value?.data);

const getTitle = () => {
  return newsItem.value?.title?.[locale.value] || newsItem.value?.title?.fr || 'No title';
};

const getContent = () => {
  const content = newsItem.value?.content?.[locale.value] || newsItem.value?.content?.fr || '';
  return content.replace(/\n/g, '<br><br>');
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>
