<template>
  <article class="flex flex-col justify-center self-center">
    <div
      class="w-11/12 flex-grow bg-white dark:bg-gray-800 bg-opacity-100 rounded-3xl max-w-5xl z-10 shadow-lg p-4 md:p-6 md:my-2 mx-auto"
    >
      <img
        v-if="
          article.img !== undefined && article.img !== null && article.img != ''
        "
        :src="article.img"
        class="object-cover w-full h-48 overflow-hidden rounded-lg"
      />
      <h1 class="text-6xl font-bold leading-none my-4 clear-right text-right">
        {{ article.title }}
      </h1>
      <div class="flex items-centeruppercase text-sm justify-end mr-2">
        <p class="my-0 mr-2">
          {{ formatDate(article.updatedAt) }}
        </p>
        <span class="mt-0 mr-2">•</span>
        <p class="my-0">{{ article.author.name }}</p>
      </div>
      <div v-for="(tag, id) in article.tags" :key="id">
        <NuxtLink :to="`/blog/tags/${tags[tag].slug}`">
          <span
            class="truncate uppercase tracking-wider font-medium text-ss px-2 py-1 rounded-full border border-gray-800 dark:border-gray-400"
          >
            {{ tags[tag].name }}
          </span>
        </NuxtLink>
      </div>
      <div class="py-4">
        <NuxtLink to="/blog" class="mr-8 self-center font-bold hover:underline">
          All articles
        </NuxtLink>
      </div>

      <p class="text-xl font-bold">
        {{ article.description }}
      </p>

      <TOC :toc="article.toc" class="" />

      <!-- content from markdown -->
      <nuxt-content :document="article" />

      <author :author="article.author" />
    </div>

    <prev-next :prev="prev" :next="next" class="mt-8" />

  </article>
</template>
<script>
//import IconHashtag from '@/assets/icons/icon-hashtag.svg?inline'
import formatDate from '@/utils/formatDate'

export default {
  components: {
    //IconHashtag,
  },
  props: {
    article: {
      type: Object,
      default: null,
    },
    tags: {
      type: Object,
      default: null,
    },
    prev: {
      type: Object,
      default: null,
    },
    next: {
      type: Object,
      default: null,
    },
  },
  methods: {
    formatDate,
  },
}
</script>

<style>
.nuxt-content p {
  margin-bottom: 20px;
}
.nuxt-content h2 {
  font-weight: bold;
  font-size: 28px;
}
.nuxt-content h3 {
  font-weight: bold;
  font-size: 22px;
}
.icon.icon-link {
  background-image: url('~assets/icons/icon-hashtag.svg');
  display: inline-block;
  width: 24px;
  height: 24px;
  background-size: 24px 24px;
}
</style>
