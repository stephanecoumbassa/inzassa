<template>
  <div>
    <!-- Google Analytics will be injected here -->
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

onMounted(() => {
  if (config.public.googleAnalyticsId) {
    // Load Google Analytics
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${config.public.googleAnalyticsId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${config.public.googleAnalyticsId}');
    `;
    document.head.appendChild(script2);
  }
});
</script>
