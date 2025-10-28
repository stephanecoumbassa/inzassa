<template>
  <div class="ad-container">
    <div v-if="hasAdsenseId">
      <ins
        class="adsbygoogle"
        style="display:block"
        :data-ad-client="config.public.googleAdsenseId"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
    <div v-else>
      <p style="color: #999;">Ad Space</p>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const hasAdsenseId = computed(() => !!config.public.googleAdsenseId);

if (hasAdsenseId.value) {
  useHead({
    script: [
      {
        src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.public.googleAdsenseId}`,
        async: true,
        crossorigin: 'anonymous'
      }
    ]
  });
}
</script>
