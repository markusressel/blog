<template>
  <!-- TODO: Add RSS feed links https://markusressel.de/feed/articles/rss.xml -->
  <!-- TODO: Add RSS feed links https://markusressel.de/feed/articles/feed.json -->
  <ArticleList :articles="paginatedArticles" :total="allArticles.length" />
</template>

<script>
import getArticles from '@/utils/getArticles'
import ArticleList from '@/components/blog/ArticleList'

export default {
  components: {
    ArticleList,
  },
  watchQuery: ['page'],
  async asyncData({ $content, query, error }) {
    const content = await getArticles($content, null, null, query.page, error)
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
