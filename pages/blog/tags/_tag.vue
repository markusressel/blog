<template>
  <div>
    <div class="flex justify-center py-4">
      <h2 class="text-center text-3xl mb-4 uppercase px-2">
        #{{ $route.params.tag }}
      </h2>
    </div>
    <ArticleList :articles="articles" />
  </div>
</template>

<script>
import ArticleList from '@/components/blog/ArticleList'
import getArticles from '@/utils/getArticles'

export default {
  components: {
    ArticleList,
  },
  async asyncData({ $content, params, error }) {
    const targetTag = params.tag
    const content = await getArticles($content, null, [targetTag], null, null)
    const articles = content.allArticles
    return {
      articles,
    }
  },
  head() {
    return {
      title: `Articles Tagged - ${this.captialise(this.$route.params.tag)}`,
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${this.$config.baseUrl}/tags/${this.$route.params.tag}`,
        },
      ],
    }
  },
  methods: {
    captialise(text) {
      return text.charAt(0).toUpperCase() + text.slice(1)
    },
  },
}
</script>
