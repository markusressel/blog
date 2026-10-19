<template>
  <!-- the whole card links to the article -->
  <NuxtLink
    :to="{ name: 'blog-post-slug', params: { slug: article.slug } }"
    class="article-list-item group flex flex-col md:flex-row overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
    style="text-decoration: none; color: inherit"
  >
    <div v-if="article.img" class="overflow-hidden shrink-0 md:w-2/5">
      <NuxtImg
        :src="article.img"
        alt=""
        width="800"
        height="400"
        fit="cover"
        densities="x1 x2"
        format="webp"
        loading="lazy"
        class="article-image w-full aspect-[5/2] md:aspect-auto md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
        :style="{ viewTransitionName: `article-image-${article.slug}` }"
      />
    </div>

    <div class="flex flex-col flex-1 gap-2 px-5 pt-4 pb-5 md:px-6">
      <h2
        class="text-xl md:text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-500 transition-colors"
      >
        {{ article.title }}
      </h2>
      <ArticleMeta
        :article="article"
        class="text-xs text-gray-600 dark:text-gray-400"
      />
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
        {{ article.description }}
      </p>

      <div class="mt-auto pt-3 flex flex-wrap items-center gap-2 text-sm">
        <span
          v-for="tag of article.tags"
          :key="tag"
          class="rounded-full bg-gray-100 dark:bg-gray-900 px-2.5 py-0.5 text-gray-600 dark:text-gray-400"
          >#{{ tag }}</span
        >
        <span
          class="ml-auto font-medium text-blue-500 transition-transform group-hover:translate-x-1"
          >Read more →</span
        >
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  article: {
    type: Object,
    required: true,
  },
})
</script>
