<template>
  <article>
    <div class="markdown-body post-right custom-scroll">
      <img
        v-if="article.img !== null"
        :src="article.img"
        class="object-cover h-48 rounded"
      />
      <div class="flex uppercase text-sm">
        <p class="mr-3">
          {{ formatDate(article.updatedAt) }}
        </p>
        <span class="mr-3">•</span>
        <p>{{ article.author.name }}</p>
      </div>
      <h1 class="text-6xl my-12 font-bold">{{ article.title }}</h1>
      <span v-for="(tag, id) in article.tags" :key="id">
        <NuxtLink :to="`/blog/tags/${tags[tag].slug}`">
          <span
            class="truncate uppercase tracking-wider font-medium text-ss px-2 py-1 rounded-full mr-12 mb-4 border border-gray-800 dark:border-gray-400"
          >
            {{ tags[tag].name }}
          </span>
        </NuxtLink>
      </span>

      <NuxtLink to="/blog" class="mr-8 self-center font-bold hover:underline">
        All articles
      </NuxtLink>

      <p>{{ article.description }}</p>

      <TOC :toc="article.toc" />

      <!-- content from markdown -->
      <nuxt-content :document="article" />

      <author :author="article.author" />
      <prev-next :prev="prev" :next="next" class="mt-8" />
    </div>
  </article>
</template>
<script>
import IconHashtag from '@/assets/icons/icon-hashtag.svg?inline'
import formatDate from '@/utils/formatDate'

export default {
  components: {
    IconHashtag,
  },
  props: {
    article: {
      type: Object,
    },
    tags: {
      type: Object,
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
  width: 20px;
  height: 20px;
  background-size: 20px 20px;
}
</style>
