<template>
  <Article
    v-if="data"
    :article="data.article"
    :prev="data.prev"
    :next="data.next"
  />
</template>

<script setup>
import { getAdjacentArticles, getArticle } from '~/utils/content'

const route = useRoute()
const slug = route.params.slug

const { data } = await useAsyncData(`article-${slug}`, async () => {
  const article = await getArticle(slug)
  if (!article) {
    return null
  }
  const { prev, next } = await getAdjacentArticles(slug)
  return { article, prev, next }
})

if (!data.value) {
  throw createError({ statusCode: 404, message: 'Page not found', fatal: true })
}

const article = data.value.article

useHead({ title: article.title })

useSeoMeta({
  description: article.description,
  ogSiteName: "Markus' Blog",
  ogTitle: article.title,
  ogDescription: article.description,
  ogType: 'article',
  ogImage: article.img,
  articleTag: article.tags,
  articlePublishedTime: article.createdAt,
  articleModifiedTime: article.updatedAt,
  twitterTitle: article.title,
  twitterDescription: article.description,
  twitterImage: article.img,
})
</script>
