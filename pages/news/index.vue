<template>
  <div class="container">
    <h1>{{ $t('news.title') }}</h1>

    <!-- Filters -->
    <div style="margin: 2rem 0; display: flex; gap: 1rem; flex-wrap: wrap;">
      <select v-model="selectedCountry" @change="fetchNews">
        <option value="">{{ $t('news.country') }}</option>
        <option value="senegal">Sénégal</option>
        <option value="mali">Mali</option>
        <option value="burkina-faso">Burkina Faso</option>
        <option value="cote-ivoire">Côte d'Ivoire</option>
        <option value="cameroon">Cameroun</option>
        <option value="gabon">Gabon</option>
        <option value="congo">Congo</option>
        <option value="drc">RDC</option>
        <option value="madagascar">Madagascar</option>
        <option value="tunisia">Tunisie</option>
        <option value="morocco">Maroc</option>
        <option value="algeria">Algérie</option>
      </select>

      <select v-model="selectedCategory" @change="fetchNews">
        <option value="">{{ $t('news.category') }}</option>
        <option value="politique">{{ $t('categories.politique') }}</option>
        <option value="economie">{{ $t('categories.economie') }}</option>
        <option value="sport">{{ $t('categories.sport') }}</option>
        <option value="culture">{{ $t('categories.culture') }}</option>
        <option value="societe">{{ $t('categories.societe') }}</option>
        <option value="international">{{ $t('categories.international') }}</option>
      </select>
    </div>

    <!-- News Grid -->
    <div v-if="news.length > 0" class="grid">
      <NewsCard
        v-for="article in news"
        :key="article._id"
        :news="article"
      />
    </div>
    <div v-else>
      <p>No news available.</p>
    </div>

    <!-- Ad Unit -->
    <AdUnit />

    <!-- Pagination -->
    <div v-if="pagination.pages > 1" style="margin-top: 2rem; text-align: center;">
      <button
        v-for="page in pagination.pages"
        :key="page"
        @click="goToPage(page)"
        :class="{ btn: true, 'btn-secondary': page === currentPage }"
        style="margin: 0 0.25rem;"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
const selectedCountry = ref('');
const selectedCategory = ref('');
const currentPage = ref(1);
const news = ref([]);
const pagination = ref({ page: 1, pages: 1, total: 0, limit: 12 });

const fetchNews = async () => {
  const query = {
    page: currentPage.value,
    limit: 12
  };
  
  if (selectedCountry.value) query.country = selectedCountry.value;
  if (selectedCategory.value) query.category = selectedCategory.value;

  const { data } = await useFetch('/api/news', { query });
  
  if (data.value?.success) {
    news.value = data.value.data;
    pagination.value = data.value.pagination;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
  fetchNews();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Initial fetch
await fetchNews();
</script>

<style scoped>
select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
}
</style>
