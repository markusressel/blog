<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()

// Netlify redirects every page to its URL with a trailing slash
const url = computed(
  () =>
    `${config.public.baseUrl}${route.path.endsWith('/') ? route.path : `${route.path}/`}`,
)

useHead({ link: [{ rel: 'canonical', href: url }] })
useSeoMeta({ ogUrl: url })
</script>
