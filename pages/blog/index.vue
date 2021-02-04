<template>
  <div>
    <ArticleList :articles="paginatedArticles" :total="allArticles.length" />
  </div>
</template>

<script>
import getContent from '@/utils/getContent';

export default {
  head() {
    return {
      title: "Blog"
    };
  },
  async asyncData({ $content, app, params, error }) {
    const content = await getContent($content, params, error)
    return {
      allArticles: content.allArticles,
      paginatedArticles: content.paginatedArticles,
    }
  },
}
</script>
