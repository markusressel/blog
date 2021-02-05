<template>
  <div>
    <input
      v-model="searchQuery"
      type="search"
      autocomplete="off"
      placeholder="Search Blog Posts"
      class="rounded-full p-3 placeholder-gray-800 dark:placeholder-gray-200 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-none shadow-md focus:outline-none"
    />

    <div class="floating z-100">
      <ul v-if="articles.length">
        <li v-for="article of articles" :key="article.slug">
          <NuxtLink
            :to="{ name: 'blog-post-slug', params: { slug: article.slug } }"
          >
            {{ article.title }}
          </NuxtLink>
        </li>
      </ul>
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
