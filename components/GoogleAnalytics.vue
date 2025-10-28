<template>
  <div></div>
</template>

<script setup>
const config = useRuntimeConfig();

if (config.public.googleAnalyticsId) {
  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${config.public.googleAnalyticsId}`,
        async: true
      },
      {
        children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${config.public.googleAnalyticsId}');
        `
      }
    ]
  });
}
</script>
