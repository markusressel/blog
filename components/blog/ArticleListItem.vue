<template>
  <NuxtLink
    :to="{ name: 'blog-post-slug', params: { slug: article.slug } }"
    class=""
    style="text-decoration: none; color: inherit"
  >
    <div
      class="flex flex-col mb-6 md:mb-8 bg-white dark:bg-gray-800 px-5 py-4 rounded-xl shadow-lg"
    >
      <img
        v-if="
          article.img !== undefined && article.img !== null && article.img != ''
        "
        :src="article.img"
        alt=""
        class="object-cover mb-2 h-32 border rounded"
      />
      <div>
        <h2 class="font-bold text-gray-900 dark:text-gray-200 text-2xl my-0">
          {{ article.title }}
        </h2>
        <div
          class="flex items-center uppercase text-xs text-gray-700 dark:text-gray-400"
        >
          <p class="my-0 mr-1">
            {{ formatDate(article.updatedAt) }}
          </p>
          <span class="mr-1">•</span>
          <p class="my-0">{{ authorText }}</p>
        </div>
        <p class="text-lg text-gray-800 dark:text-gray-300">
          {{ article.description }}
        </p>
        <div class="flex justify-end">
          <p
            class="md:w-max shadow-lg border rounded-full m-0 px-4 py-2 text-sm text-bold bg-gray-200 dark:bg-gray-900 hover:bg-blue-500 text-blue-500 hover:text-white transform duration-300 ease-in-out"
          >
            Read more<span>&hellip;</span>
          </p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script>
import formatDate from '@/utils/formatDate'

export default {
  props: {
    article: {
      type: Object,
      default: null,
    },
  },
  computed: {
    authorText: function () {
      var result = Object.keys(this.article.authors)
        .map((x) => this.article.authors[x].name)
        .join(', ')
      return result
    },
  },
  methods: {
    formatDate,
  },
}
</script>
<style scoped></style>
