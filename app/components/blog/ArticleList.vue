<template>
  <div class="max-w-5xl mx-auto md:px-4">
    <div class="flex flex-col gap-6 text-gray-700 dark:text-gray-100">
      <ArticleListItem
        v-for="article of articles"
        :key="article.slug"
        :article="article"
      />
    </div>
    <div v-if="total > 5" class="mt-8 mb-4">
      <Pagination :total="total" :page="page" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  articles: {
    type: Array,
    default: () => [],
  },
  total: {
    type: Number,
    default: 0,
  },
  page: {
    type: Number,
    default: 1,
  },
})
</script>
