<template>
  <Article :article="article" :prev="prev" :next="next" />
</template>

<script>
import Article from '@/components/blog/article/Article'
import getArticle from '@/utils/getArticle'

export default {
  components: {
    Article,
  },
  async asyncData({ $content, error, params }) {
    // fetch article data
    const article = await getArticle($content, error, params.slug)

    // fetch the previous and next article
    const [prev, next] = await $content('articles')
      .only(['title', 'slug'])
      .sortBy('createdAt', 'asc')
      .surround(params.slug)
      .fetch()

    return {
      article,
      prev,
      next,
    }
  },
  head() {
    return {
      title: 'Post',
    }
  },
}
</script>
