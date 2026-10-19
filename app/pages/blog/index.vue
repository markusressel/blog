<template>
  <ArticleList
    v-if="content"
    :articles="content.paginatedArticles"
    :total="content.allArticles.length"
  />
</template>

<script setup>
// TODO: Add RSS feed links https://markusressel.de/feed/articles/rss.xml
// TODO: Add RSS feed links https://markusressel.de/feed/articles/feed.json
import { getArticles } from '~/utils/content'

const route = useRoute()
const page = computed(() => parseInt(route.query.page) || 1)

const { data: content } = await useAsyncData(
  () => `blog-page-${page.value}`,
  () => getArticles({ page: page.value }),
)

useHead({ title: 'Blog' })
</script>
