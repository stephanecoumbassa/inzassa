<template>
  <div class="container">
    <article v-if="country">
      <h1 style="margin-bottom: 1rem;">{{ country.name }}</h1>
      
      <img
        v-if="country.flag"
        :src="country.flag"
        :alt="country.name"
        style="width: 200px; border: 1px solid var(--border-color); margin-bottom: 2rem;"
      />

      <div class="card-meta" style="margin-bottom: 2rem;">
        <strong>{{ $t('countries.capital') }}:</strong> {{ country.capital }}<br>
        <strong>{{ $t('countries.population') }}:</strong> {{ formatNumber(country.population) }}<br>
        <strong>{{ $t('countries.languages') }}:</strong> {{ country.languages?.join(', ') }}<br>
        <strong>{{ $t('countries.currency') }}:</strong> {{ country.currency }}
      </div>

      <!-- Description -->
      <section style="margin-bottom: 2rem;">
        <h2>Description</h2>
        <div v-html="getDescription()"></div>
      </section>

      <!-- Geography -->
      <section v-if="country.geography" style="margin-bottom: 2rem;">
        <h2>Géographie</h2>
        <div v-html="getGeography()"></div>
      </section>

      <!-- Economy -->
      <section v-if="country.economy" style="margin-bottom: 2rem;">
        <h2>Économie</h2>
        <div v-html="getEconomy()"></div>
      </section>

      <!-- Culture -->
      <section v-if="country.culture" style="margin-bottom: 2rem;">
        <h2>Culture</h2>
        <div v-html="getCulture()"></div>
      </section>

      <!-- History -->
      <section v-if="country.history" style="margin-bottom: 2rem;">
        <h2>Histoire</h2>
        <div v-html="getHistory()"></div>
      </section>

      <!-- Images -->
      <section v-if="country.images && country.images.length > 0">
        <h2>Galerie</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
          <img
            v-for="(image, index) in country.images"
            :key="index"
            :src="image"
            :alt="`${country.name} ${index + 1}`"
            style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;"
          />
        </div>
      </section>

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

const { data } = await useFetch(`/api/countries/${route.params.code}`);
const country = computed(() => data.value?.data);

const getDescription = () => {
  const desc = country.value?.description?.[locale.value] || country.value?.description?.fr || '';
  return desc.replace(/\n/g, '<br><br>');
};

const getGeography = () => {
  const geo = country.value?.geography?.[locale.value] || country.value?.geography?.fr || '';
  return geo.replace(/\n/g, '<br><br>');
};

const getEconomy = () => {
  const eco = country.value?.economy?.[locale.value] || country.value?.economy?.fr || '';
  return eco.replace(/\n/g, '<br><br>');
};

const getCulture = () => {
  const cul = country.value?.culture?.[locale.value] || country.value?.culture?.fr || '';
  return cul.replace(/\n/g, '<br><br>');
};

const getHistory = () => {
  const hist = country.value?.history?.[locale.value] || country.value?.history?.fr || '';
  return hist.replace(/\n/g, '<br><br>');
};

const formatNumber = (num) => {
  return num?.toLocaleString(locale.value) || 'N/A';
};
</script>
