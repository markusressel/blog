<template>
  <ArticleList :articles="paginatedArticles" :total="allArticles.length" />
</template>

<script>
import getArticles from '@/utils/getArticles'

export default {
  head() {
    return {
      title: 'Blog',
    }
  },
  async asyncData({ $content, app, params, error }) {
    const content = await getArticles($content, params, error)
    return {
      allArticles: content.allArticles,
      paginatedArticles: content.paginatedArticles,
    }
  },
}
</script>
