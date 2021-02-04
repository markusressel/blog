<template>
  <div>
    <h1>Blog Posts</h1>

    <ArticleList :articles="paginatedArticles" :total="allArticles.length" />
  </div>
</template>

<script>
import getContent from '@/utils/getContent';

export default {
  name: 'HomePage',
  async asyncData({ $content, app, params, error }) {
    const content = await getContent($content, params, error)
    return {
      allArticles: content.allArticles,
      paginatedArticles: content.paginatedArticles,
    }
  },
}
</script>
