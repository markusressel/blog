<template>
  <div>
    <input
      v-model="searchQuery"
      type="search"
      autocomplete="off"
      placeholder="Search Blog Posts"
      class="rounded-full p-3 placeholder-gray-800 dark:placeholder-gray-200 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-none shadow-md focus:outline-none"
    />

    <div class="absolute rounded bg-red-100 floating z-100">
      <div v-if="articles.length">
        <div v-for="article of articles" :key="article.slug" class="px-4 py-2">
          <NuxtLink
            :to="{ name: 'blog-post-slug', params: { slug: article.slug } }"
          >
            <div class="font-bold">{{ article.title }}</div>
            <div>{{ article.description }}</div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      articles: [],
    }
  },
  watch: {
    async searchQuery(searchQuery) {
      if (!searchQuery) {
        this.articles = []
        return
      }
      this.articles = await this.$content('articles')
        .limit(6)
        .search(searchQuery)
        .fetch()
    },
  },
}
</script>
