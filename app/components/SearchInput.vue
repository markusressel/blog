<template>
  <div>
    <input
      v-model="searchQuery"
      type="search"
      autocomplete="off"
      placeholder="Search Blog Posts"
      class="rounded-full p-3 placeholder-gray-800 dark:placeholder-gray-200 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border-none shadow-md focus:outline-none z-50 w-full"
      @blur="onFocusLost"
    />

    <div
      v-if="searchQuery"
      class="absolute right-0 mt-3 max-h-[80vh] overflow-y-auto w-full md:w-2/3 mr-1"
    >
      <div
        class="rounded-xl bg-gray-100 dark:bg-gray-900 border-4 border-solid border-gray-400 dark:border-gray-700 z-50"
      >
        <div v-if="articles.length">
          <div
            v-for="article of articles"
            :key="article.slug"
            class="px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <NuxtLink
              :to="{ name: 'blog-post-slug', params: { slug: article.slug } }"
              style="text-decoration: none"
              @click="searchQuery = ''"
            >
              <div class="font-bold">{{ article.title }}</div>
              <div class="text-gray-800 dark:text-gray-200">
                {{ article.description }}
              </div>
            </NuxtLink>
          </div>
        </div>
        <div v-else-if="!searching" class="px-4 py-2">Nothing found 😢</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { searchArticles } from '~/utils/content'

const searchQuery = ref('')
const articles = ref([])
const searching = ref(false)

watch(searchQuery, async (query) => {
  if (!query) {
    articles.value = []
    return
  }
  searching.value = true
  const results = await searchArticles(query, 6)
  // ignore results of outdated queries
  if (query === searchQuery.value) {
    articles.value = results
    searching.value = false
  }
})

const onFocusLost = () => {
  // delay clearing the query a bit, to
  // make onClick events on the search results work
  setTimeout(() => {
    searchQuery.value = ''
  }, 200)
}
</script>
