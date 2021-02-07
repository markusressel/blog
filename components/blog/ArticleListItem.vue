<template>
  <div class="mb-12 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg">
    <NuxtLink
      :to="{ name: 'blog-post-slug', params: { slug: article.slug } }"
      class="md:grid md:gap-4 md:grid-cols-2"
      style="text-decoration: none; color: inherit"
    >
      <img
        v-if="article.image"
        :src="article.image"
        alt=""
        class="mb-4 border rounded"
      />
      <div>
        <h2 class="font-bold text-gray-900 dark:text-gray-200 text-2xl mb-2">
          {{ article.title }}
        </h2>
        <div class="flex items-center uppercase text-sm">
          <p class="mr-3">
            {{ formatDate(article.updatedAt) }}
          </p>
          <span class="mr-3">•</span>
          <p>{{ article.author.name }}</p>
        </div>
        <p class="text-lg text-gray-700 dark:text-gray-200">
          {{ article.description }}
        </p>
        <p class="font-bold text-blue-600 mt-2">
          Read more<span class="text-blue-600">&hellip;</span>
        </p>
      </div>
    </NuxtLink>
  </div>
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
  methods: {
    formatDate,
  },
}
</script>
<style scoped></style>
