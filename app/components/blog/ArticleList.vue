<template>
  <div>
    <div
      class="flex flex-col text-gray-700 dark:text-gray-100 max-w-5xl mx-auto"
    >
      <div v-for="article of articles" :key="article.slug">
        <ArticleListItem :article="article" />
      </div>
    </div>
    <div v-if="total" class="constainer mx-auto mb-4 max-w-5xl">
      <Pagination v-if="total > 5" :total="total" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleList',
  props: {
    articles: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: 0,
    },
  },
}
</script>
<style scoped></style>
