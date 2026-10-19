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
const config = useRuntimeConfig()
// social media previews need absolute image URLs
const image = article.img?.startsWith('/')
  ? `${config.public.baseUrl}${article.img}`
  : article.img

// structured data for search engines
const author = Object.values(article.authors).map((author) => ({
  '@type': 'Person',
  name: author.name,
  url: config.public.baseUrl,
}))
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: article.title,
  description: article.description,
  image,
  datePublished: article.createdAt,
  dateModified: article.updatedAt,
  author,
  keywords: article.tags,
  mainEntityOfPage: `${config.public.baseUrl}/blog/post/${article.slug}/`,
}

useHead({
  title: article.title,
  script: [
    {
      type: 'application/ld+json',
      // `<` is escaped, so text in the data can't end the script element
      innerHTML: JSON.stringify(jsonLd).replaceAll('<', '\\u003c'),
    },
  ],
})

useSeoMeta({
  description: article.description,
  ogSiteName: "Markus' Blog",
  ogTitle: article.title,
  ogDescription: article.description,
  ogType: 'article',
  ogImage: image,
  articleTag: article.tags,
  articlePublishedTime: article.createdAt,
  articleModifiedTime: article.updatedAt,
  twitterCard: 'summary_large_image',
  twitterTitle: article.title,
  twitterDescription: article.description,
  twitterImage: image,
})
</script>
