<template>
  <div class="ad-container">
    <!-- Google AdSense will be injected here -->
    <div v-if="config.public.googleAdsenseId">
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

<script setup lang="ts">
const config = useRuntimeConfig();

onMounted(() => {
  if (config.public.googleAdsenseId) {
    // Load Google AdSense
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.public.googleAdsenseId}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    // Push ad
    setTimeout(() => {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    }, 100);
  }
});
</script>
