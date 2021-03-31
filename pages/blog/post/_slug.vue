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
    let tmp = await $content('articles')
      .only(['title', 'slug'])
      .sortBy('createdAt', 'asc')
      .fetch()
    tmp = tmp.filter((keyword, index) => {
      if (!process.env.NODE_ENV === 'production') {
        return true
      } else {
        return tmp[index].dummy === undefined || tmp[index].dummy === false
      }
    })

    let prev = null,
      next = null
    for (let i = 0; i <= tmp.length; i++) {
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
