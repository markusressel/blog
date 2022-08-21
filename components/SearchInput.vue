<template>
  <div class="search-input">
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
      class="absolute right-0 mt-3 h-100% w-full md:w-2/3 mr-1"
    >
      <vue-scroll :ops="ops">
        <div
          class="rounded-xl bg-gray-100 dark:bg-gray-900 border-4 border-solid border-gray-400 dark:border-gray-700 z-50"
        >
          <div v-if="articles.length">
            <div
              v-for="article of articles"
              :key="article.slug"
              class="px-4 py-2 hover:bg-gray-300 dark-hover:bg-gray-700"
            >
              <NuxtLink
                :to="{ name: 'blog-post-slug', params: { slug: article.slug } }"
                style="text-decoration: none"
                @click.native="searchQuery = ''"
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
      </vue-scroll>
    </div>
  </div>
</template>

<script>
import getArticles from '@/utils/getArticles'

export default {
  data() {
    return {
      searchQuery: '',
      articles: [],
      ops: {
        vuescroll: {
          mode: 'native',
          sizeStrategy: 'percent',
          detectResize: true,
          /** Enable locking to the main axis if user moves only slightly on one of them at start */
          locking: true,
        },
        scrollPanel: {
          scrollingX: false,
          speed: 800,
          easing: 'easeOutCubic',
        },
        rail: {},
        bar: {
          background: '#448aff',
          keepShow: true,
        },
      },
    }
  },
  watch: {
    async searchQuery(searchQuery) {
      if (!searchQuery) {
        this.articles = []
        return
      }

      const content = await getArticles(this.$content, searchQuery, null, 6)
      this.articles = content.allArticles

      if (process.env.NODE_ENV === 'production') {
        this.articles = this.articles.filter((value) => {
          return value.dummy === undefined || value.dummy === false
        })
      }
    },
  },
  methods: {
    onFocusLost() {
      // delay clearing the query a bit, to
      // make onClick events on the search results work
      setTimeout(function () {
        this.searchQuery = ''
      }, 200)
    },
  },
}
</script>
