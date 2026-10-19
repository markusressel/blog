<template>
  <div class="flex flex-col justify-center self-center">
    <article
      class="w-11/12 flex-grow bg-white dark:bg-gray-800 rounded-3xl max-w-6xl z-10 shadow-lg p-4 md:p-6 md:my-2 mx-auto"
    >
      <img
        v-if="article.img"
        :src="article.img"
        :alt="article.alt ?? ''"
        class="object-cover w-full h-48 overflow-hidden rounded-lg shadow-lg"
      />
      <h1
        class="text-4xl md:text-6xl font-bold leading-none my-4 clear-right text-right"
      >
        {{ article.title }}
      </h1>
      <div class="flex items-center uppercase text-sm justify-end mr-2">
        <p class="my-0 mr-2">
          {{ formatDate(article.updatedAt) }}
        </p>
        <span class="mt-0 mr-2">•</span>
        <p class="my-0">{{ authorText }}</p>
      </div>

      <p class="text-xl px-4 my-6 font-bold">
        {{ article.description }}
      </p>

      <div
        class="lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-10 lg:items-start"
      >
        <!-- inline above the content on small screens, sticky sidebar on large ones -->
        <TOC
          :toc="article.body.toc?.links ?? []"
          class="py-2 mb-4 lg:mb-0 lg:order-last lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
        />

        <!-- content from markdown -->
        <ContentRenderer
          :value="article"
          class="prose dark:prose-invert max-w-none"
          data-snapshot="content"
        />
      </div>

      <!-- list of tags -->
      <div class="flex flex-wrap gap-2 pt-6">
        <NuxtLink
          v-for="tag in article.tags"
          :key="tag"
          :to="{ name: 'blog-tags-tag', params: { tag } }"
        >
          <Chip :text="`#${tag}`" />
        </NuxtLink>
      </div>

      <Author
        v-for="(author, id) in article.authors"
        :key="id"
        :author="author"
      />
    </article>

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
