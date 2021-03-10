<template>
  <Article class="flex flex-col justify-center self-center">
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
        <p class="my-0">{{ authorText }}</p>
      </div>

      <p class="text-xl px-4 font-bold">
        {{ article.description }}
      </p>

      <TOC :toc="article.toc" class="py-2" />

      <!-- content from markdown -->
      <NuxtContent :document="article" />

      <!-- list of tags -->
      <div v-for="(tag, id) in article.tags" :key="id" class="flex pt-6">
        <NuxtLink :to="`/blog/tags/${tag.slug}`">
          <div
            class="px-2 py-1 rounded-full shadow-lg bg-gray-900 tracking-wider font-medium text-ss"
          >
            #{{ tag.name }}
          </div>
        </NuxtLink>
      </div>

      <Author
        v-for="(author, id) in article.authors"
        :key="id"
        :author="author"
      />
    </div>

    <PrevNext :prev="prev" :next="next" class="mt-8" />
  </article>
</template>
<script>
//import IconHashtag from '@/assets/icons/icon-hashtag.svg?inline'
import Author from '@/components/blog/article/Author'
import PrevNext from '@/components/blog/article/PrevNext'
import TOC from '@/components/blog/article/TOC'
import formatDate from '@/utils/formatDate'

export default {
  components: {
    Author,
    PrevNext,
    TOC,
  },
  props: {
    article: {
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
