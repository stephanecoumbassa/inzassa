<template>
  <div class="container">
    <h1>{{ $t('countries.title') }}</h1>

    <!-- Countries Grid -->
    <div v-if="countries.length > 0" class="grid">
      <NuxtLink
        v-for="country in countries"
        :key="country._id"
        :to="`/countries/${country.code}`"
        class="card"
        style="text-decoration: none; color: inherit;"
      >
        <img
          v-if="country.flag"
          :src="country.flag"
          :alt="country.name"
          style="height: 150px; object-fit: cover;"
        />
        <div class="card-content">
          <h3 class="card-title">{{ country.name }}</h3>
          <p class="card-meta">
            <strong>{{ $t('countries.capital') }}:</strong> {{ country.capital }}<br>
            <strong>{{ $t('countries.population') }}:</strong> {{ formatNumber(country.population) }}
          </p>
          <p>{{ getDescription(country) }}</p>
          <span class="btn">{{ $t('countries.learnMore') }}</span>
        </div>
      </NuxtLink>
    </div>
    <div v-else>
      <p>No countries available yet. Check back soon!</p>
    </div>

    <!-- Ad Unit -->
    <AdUnit />
  </div>
</template>

<script setup>
const { locale } = useI18n();

const { data } = await useFetch('/api/countries');
const countries = computed(() => data.value?.data || []);

const getDescription = (country) => {
  const desc = country.description?.[locale.value] || country.description?.fr || '';
  return desc.substring(0, 150) + (desc.length > 150 ? '...' : '');
};

const formatNumber = (num) => {
  return num?.toLocaleString(locale.value) || 'N/A';
};
</script>
