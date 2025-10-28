<template>
  <div class="card">
    <img
      v-if="news.imageUrl"
      :src="news.imageUrl"
      :alt="getTitle()"
    />
    <div class="card-content">
      <span class="category-tag">{{ $t(`categories.${news.category}`) }}</span>
      <h3 class="card-title">{{ getTitle() }}</h3>
      <p class="card-meta">
        {{ news.country }} • {{ formatDate(news.publishedAt) }}
      </p>
      <p>{{ getSummary() }}</p>
      <NuxtLink :to="`/news/${news._id}`" class="btn">
        {{ $t('news.readMore') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  news: any;
}>();

const { locale } = useI18n();

const getTitle = () => {
  return props.news.title?.[locale.value] || props.news.title?.fr || 'No title';
};

const getSummary = () => {
  const summary = props.news.summary?.[locale.value] || props.news.summary?.fr || '';
  return summary.substring(0, 150) + (summary.length > 150 ? '...' : '');
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(locale.value);
};
</script>
