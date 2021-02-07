<template>
  <ArticleList :articles="paginatedArticles" :total="allArticles.length" />
</template>

<script>
import getArticles from '@/utils/getArticles'

export default {
  async asyncData({ $content, params, error }) {
    const content = await getArticles($content, params, error)
    return {
      allArticles: content.allArticles,
      paginatedArticles: content.paginatedArticles,
    }
  },
  head() {
    return {
      title: 'Blog',
    }
  },
}
</script>
