<template>
  <article>
    <div class="markdown-body post-right custom-scroll">
      <img
        :src="article.img"
        :alt="article.alt"
        v-bind:class="{ hidden: article.img === nil }"
        class="object-cover h-48 rounded"
      />
      <div class="mt-16 -mb-3 flex uppercase text-sm">
        <p class="mr-3">
          {{ formatDate(article.updatedAt) }}
        </p>
        <span class="mr-3">•</span>
        <p>{{ article.author.name }}</p>
      </div>
      <h1 class="text-6xl font-bold">{{ article.title }}</h1>
      <span v-for="(tag, id) in article.tags" :key="id">
        <NuxtLink :to="`/blog/tags/${tags[tag].slug}`">
          <span
            class="truncate uppercase tracking-wider font-medium text-ss px-2 py-1 rounded-full mr-2 mb-2 border border-light-border dark:border-dark-border"
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

export default {
  components: {
    IconHashtag,
  },
  props: {
    article: {
      type: Object,
    },
    tags: {
        type: Array,
    },
    prev: {
        type: String,
    },
    next: {
        type: String,
    },
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('en', options)
    },
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
