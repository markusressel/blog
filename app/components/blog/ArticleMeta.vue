<template>
  <p class="article-meta flex flex-wrap items-center gap-x-2 uppercase my-0">
    <span v-if="article.createdAt">
      <template v-if="detailed">Published </template>
      <time :datetime="isoDate(article.createdAt)">{{
        formatDate(article.createdAt)
      }}</time>
    </span>
    <template v-if="detailed && isUpdated">
      <span aria-hidden="true">•</span>
      <span>
        Updated
        <time :datetime="isoDate(article.updatedAt)">{{
          formatDate(article.updatedAt)
        }}</time>
      </span>
    </template>
    <template v-if="article.readingTime">
      <span aria-hidden="true">•</span>
      <span>{{ article.readingTime }} min read</span>
    </template>
    <template v-if="authorText">
      <span aria-hidden="true">•</span>
      <span>{{ authorText }}</span>
    </template>
  </p>
</template>

<script setup>
import formatDate from '~/utils/formatDate'

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
  // also show the date of the last update
  detailed: {
    type: Boolean,
    default: false,
  },
})

const isoDate = (date) => new Date(date).toISOString().slice(0, 10)

const isUpdated = computed(
  () =>
    props.article.updatedAt &&
    props.article.createdAt &&
    isoDate(props.article.updatedAt) !== isoDate(props.article.createdAt),
)

const authorText = computed(() =>
  Object.values(props.article.authors ?? {})
    .map((author) => author.name)
    .join(', '),
)
</script>
