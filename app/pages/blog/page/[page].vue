<template>
  <ArticleListPage :page="page" />
</template>

<script setup>
const route = useRoute()
const page = parseInt(route.params.page)

if (!(page >= 1)) {
  throw createError({ statusCode: 404, message: 'Page not found', fatal: true })
}
if (page === 1) {
  await navigateTo('/blog', { redirectCode: 301 })
}
</script>
