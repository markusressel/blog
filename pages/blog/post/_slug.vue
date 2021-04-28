<template>
  <Article :article="article" :prev="prev" :next="next" />
</template>

<script>
import Article from '@/components/blog/article/Article'
import getArticle from '@/utils/getArticle'
import productionFilter from '@/utils/productionFilter'

export default {
  components: {
    Article,
  },
  async asyncData({ $content, error, params }) {
    // fetch article data
    const article = await getArticle($content, error, params.slug)

    // fetch the previous and next article
    let tmp = await $content('articles')
      .only(['title', 'slug', 'dummy'])
      .sortBy('createdAt', 'asc')
      .fetch()
    tmp = await productionFilter(tmp)

    let prev = null
    let next = null
    for (let i = 0; i < tmp.length; i++) {
      let item = tmp[i]
      if (item.slug == params.slug) {
        if (i > 0) {
          prev = await $content('articles', tmp[i - 1].slug)
            .only(['title', 'slug'])
            .fetch()
        }
        if (i < tmp.length - 1) {
          next = await $content('articles', tmp[i + 1].slug)
            .only(['title', 'slug'])
            .fetch()
        }
        break
      }
    }

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
