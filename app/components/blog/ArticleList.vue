<template>
  <div class="max-w-6xl mx-auto md:px-4">
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-100"
    >
      <ArticleListItem
        v-for="(article, index) of articles"
        :key="article.slug"
        :article="article"
        :featured="index === 0 && hasFeatured"
        :class="{ 'md:col-span-2': index === 0 && hasFeatured }"
      />
    </div>
    <div v-if="total > 5" class="mt-8 mb-4">
      <Pagination :total="total" :page="page" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
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

// With an odd number of articles the first one spans both columns,
// so the others fill the two column grid without a gap.
const hasFeatured = computed(() => props.articles.length % 2 === 1)
</script>
