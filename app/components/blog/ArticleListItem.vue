<template>
  <NuxtLink
    :to="{ name: 'blog-post-slug', params: { slug: article.slug } }"
    class=""
    style="text-decoration: none; color: inherit"
  >
    <div
      class="article-list-item flex flex-col mb-6 md:mb-8 bg-white dark:bg-gray-800 px-5 py-4 rounded-xl shadow-lg"
    >
      <NuxtImg
        v-if="article.img"
        :src="article.img"
        alt=""
        width="1024"
        height="128"
        fit="cover"
        densities="x1 x2"
        format="webp"
        loading="lazy"
        class="article-image object-cover w-full mb-2 h-32 rounded shadow"
        :style="{ viewTransitionName: `article-image-${article.slug}` }"
      />
      <div>
        <h2 class="font-bold text-gray-900 dark:text-gray-200 text-2xl my-0">
          {{ article.title }}
        </h2>
        <ArticleMeta
          :article="article"
          class="text-xs text-gray-700 dark:text-gray-400"
        />
        <p class="text-lg text-gray-800 dark:text-gray-300">
          {{ article.description }}
        </p>
        <div class="flex justify-end">
          <p
            class="md:w-max shadow-lg border dark:border-gray-700 rounded-full m-0 px-4 py-2 text-sm text-bold bg-gray-200 dark:bg-gray-900 hover:bg-blue-500 text-blue-500 hover:text-white transform duration-300 ease-in-out"
          >
            Read more<span>&hellip;</span>
          </p>
        </div>
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
