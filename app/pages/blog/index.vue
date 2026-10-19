<template>
  <ArticleListPage :page="1" />
</template>

<script setup>
// Pages used to be addressed as /blog?page=2. Netlify redirects these with a 301
// (public/_redirects); this covers local previews and other hosts. During hydration the
// route is still the prerendered one without query, so watch for the real one.
const route = useRoute()
watch(
  () => parseInt(route.query.page),
  (legacyPage) => {
    if (legacyPage > 1) {
      navigateTo(`/blog/page/${legacyPage}`, { replace: true })
    }
  },
  { immediate: true },
)
</script>
