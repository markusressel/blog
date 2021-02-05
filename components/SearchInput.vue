<template>
  <div>
    <input
      v-model="searchQuery"
      type="search"
      autocomplete="off"
      placeholder="Search Blog Posts"
      class="rounded-full p-3 placeholder-gray-800 dark:placeholder-gray-200 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-none shadow-md focus:outline-none"
    />

    <div
      v-if="searchQuery"
      class="absolute right-0 mt-3 w-2/3 mr-1 rounded-xl bg-gray-100 dark:bg-gray-900 border-4 border-solid border-gray-400 dark:border-gray-700 z-100"
    >
      <div v-if="articles.length">
        <div
          v-for="article of articles"
          :key="article.slug"
          class="px-4 py-2 hover:bg-gray-300 dark-hover:bg-gray-700"
        >
          <NuxtLink
            style="text-decoration: none"
            v-on:click.native="searchQuery = ''"
            :to="{ name: 'blog-post-slug', params: { slug: article.slug } }"
          >
            <div class="font-bold">{{ article.title }}</div>
            <div class="text-gray-800 dark:text-gray-200">
              {{ article.description }}
            </div>
          </NuxtLink>
        </div>
      </div>
      <div v-else class="px-4 py-2">Nothing found 😢</div>
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
