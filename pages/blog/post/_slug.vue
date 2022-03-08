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
      const item = tmp[i]
      if (item.slug === params.slug) {
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
      title: this.article.title,
      description: this.article.description,
      meta: [
        {
          hid: 'og:site_name',
          name: 'og:site_name',
          property: 'og:site_name',
          content: "Markus' Blog",
        },

        {
          hid: 'og:title',
          name: 'og:title',
          property: 'og:title',
          content: this.article.title,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          property: 'og:description',
          content: this.article.description,
        },

        {
          hid: 'og:type',
          name: 'og:type',
          property: 'og:type',
          content: 'article',
        },

        {
          hid: 'article:tag',
          name: 'article:tag',
          property: 'article:tag',
          content: Object.keys(this.article.tags),
        },
        {
          hid: 'article:published',
          name: 'article:published',
          property: 'article:published',
          content: this.article.createdAt,
        },
        {
          hid: 'article:modified_time',
          name: 'article:modified_time',
          property: 'article:modified_time',
          content: this.article.updatedAt,
        },

        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.article.title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.article.description,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.article.img,
        },

        {
          hid: 'og:image',
          name: 'og:image',
          property: 'og:image',
          content: this.article.img,
        },
      ],
    }
  },
}
</script>
