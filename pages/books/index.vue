<template>
  <div class="container">
    <h1>{{ $t('books.title') }}</h1>

    <!-- Books Grid -->
    <div v-if="books.length > 0" class="grid">
      <div v-for="book in books" :key="book._id" class="card">
        <img
          v-if="book.coverImage"
          :src="book.coverImage"
          :alt="book.title"
        />
        <div class="card-content">
          <h3 class="card-title">{{ book.title }}</h3>
          <p class="card-meta">
            <strong>{{ $t('books.author') }}:</strong> {{ book.author }}<br>
            <strong>{{ $t('books.year') }}:</strong> {{ book.publishedYear }}<br>
            <strong>{{ $t('books.genre') }}:</strong> {{ book.genre }}
          </p>
          <p>{{ getSummary(book) }}</p>
          <button @click="selectedBook = book" class="btn">
            {{ $t('books.readSummary') }}
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No books available yet. Check back soon!</p>
    </div>

    <!-- Ad Unit -->
    <AdUnit />

    <!-- Book Detail Modal -->
    <div
      v-if="selectedBook"
      @click="selectedBook = null"
      style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem;"
    >
      <div
        @click.stop
        style="background: white; padding: 2rem; border-radius: 8px; max-width: 800px; max-height: 80vh; overflow-y: auto;"
      >
        <h2>{{ selectedBook.title }}</h2>
        <p><strong>{{ $t('books.author') }}:</strong> {{ selectedBook.author }}</p>
        <div v-html="getFullSummary(selectedBook)" style="margin-top: 1rem; line-height: 1.8;"></div>
        <button @click="selectedBook = null" class="btn" style="margin-top: 1rem;">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { locale } = useI18n();
const selectedBook = ref(null);

const { data } = await useFetch('/api/books', {
  query: { limit: 50 }
});

const books = computed(() => data.value?.data || []);

const getSummary = (book) => {
  const summary = book.summary?.[locale.value] || book.summary?.fr || '';
  return summary.substring(0, 200) + (summary.length > 200 ? '...' : '');
};

const getFullSummary = (book) => {
  const summary = book.summary?.[locale.value] || book.summary?.fr || '';
  return summary.replace(/\n/g, '<br><br>');
};
</script>
