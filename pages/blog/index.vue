<template>
  <!-- TODO: Add RSS feed links https://blog.markusressel.de/feed/articles/rss.xml -->
  <!-- TODO: Add RSS feed links https://blog.markusressel.de/feed/articles/feed.json -->
  <ArticleList :articles="paginatedArticles" :total="allArticles.length" />
</template>

<script>
import getArticles from '@/utils/getArticles'

export default {
  watchQuery: ['page'],
  async asyncData({ $content, query, error }) {
    console.log('Params: ' + query)
    const content = await getArticles($content, query, error)
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
