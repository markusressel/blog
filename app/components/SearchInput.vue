<template>
  <div ref="root">
    <input
      v-model="searchQuery"
      type="search"
      autocomplete="off"
      placeholder="Search Blog Posts"
      aria-label="Search blog posts"
      class="rounded-full px-4 py-2 placeholder-gray-600 dark:placeholder-gray-300 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border-none shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 z-50 w-full"
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

const root = ref(null)
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

// Close the results when clicking anywhere else. Not done on blur, because the
// input also loses focus when the browser window does (e.g. switching tabs).
const onPointerDown = (event) => {
  if (root.value && !root.value.contains(event.target)) {
    searchQuery.value = ''
  }
}

onMounted(() => document.addEventListener('pointerdown', onPointerDown))
onBeforeUnmount(() =>
  document.removeEventListener('pointerdown', onPointerDown),
)
</script>
