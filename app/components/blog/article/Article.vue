<template>
  <div class="flex flex-col justify-center self-center">
    <div
      class="w-11/12 flex-grow bg-white dark:bg-gray-800 bg-opacity-100 rounded-3xl max-w-5xl z-10 shadow-lg p-4 md:p-6 md:my-2 mx-auto"
    >
      <img
        v-if="article.img"
        :src="article.img"
        :alt="article.alt"
        class="object-cover w-full h-48 overflow-hidden rounded-lg shadow-lg"
      />
      <h1 class="text-6xl font-bold leading-none my-4 clear-right text-right">
        {{ article.title }}
      </h1>
      <div class="flex items-center uppercase text-sm justify-end mr-2">
        <p class="my-0 mr-2">
          {{ formatDate(article.updatedAt) }}
        </p>
        <span class="mt-0 mr-2">•</span>
        <p class="my-0">{{ authorText }}</p>
      </div>

      <p class="text-xl px-4 font-bold">
        {{ article.description }}
      </p>

      <TOC :toc="article.body.toc?.links ?? []" class="py-2" />

      <!-- content from markdown -->
      <ContentRenderer
        :value="article"
        class="nuxt-content"
        data-snapshot="content"
      />

      <!-- list of tags -->
      <div class="flex flex-wrap pt-6">
        <div v-for="tag in article.tags" :key="tag" class="mx-1">
          <NuxtLink :to="{ name: 'blog-tags-tag', params: { tag } }">
            <Chip :text="`#${tag}`" />
          </NuxtLink>
        </div>
      </div>

      <Author
        v-for="(author, id) in article.authors"
        :key="id"
        :author="author"
      />
    </div>

    <PrevNext :prev="prev" :next="next" class="mt-8" />
  </div>
</template>

<script setup>
import formatDate from '~/utils/formatDate'

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
  prev: {
    type: Object,
    default: null,
  },
  next: {
    type: Object,
    default: null,
  },
})

const authorText = computed(() =>
  Object.values(props.article.authors)
    .map((author) => author.name)
    .join(', '),
)
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

.nuxt-content p img {
  @apply w-full;
  @apply rounded;
  @apply shadow-xl;
}

.icon.icon-link {
  background-image: url('~/assets/icons/icon-hashtag.svg');
  display: inline-block;
  width: 24px;
  height: 24px;
  background-size: 24px 24px;
}
</style>
