<template>
  <ArticleList
    v-if="content"
    :articles="content.paginatedArticles"
    :total="content.allArticles.length"
    :page="page"
  />
</template>

<script setup>
import { getArticles } from '~/utils/content'

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
})

const { data: content } = await useAsyncData(`blog-page-${props.page}`, () =>
  getArticles({ page: props.page }),
)

if (!content.value?.paginatedArticles.length) {
  throw createError({ statusCode: 404, message: 'Page not found', fatal: true })
}

useHead({ title: props.page > 1 ? `Blog - Page ${props.page}` : 'Blog' })
</script>
