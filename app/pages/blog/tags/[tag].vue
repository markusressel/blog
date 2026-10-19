<template>
  <div>
    <div class="flex justify-center py-4">
      <h2 class="text-center text-3xl mb-4 uppercase px-2">#{{ tag }}</h2>
    </div>
    <ArticleList :articles="articles ?? []" />
  </div>
</template>

<script setup>
import { getArticles } from '~/utils/content'

const route = useRoute()
const config = useRuntimeConfig()
const tag = route.params.tag

const { data: articles } = await useAsyncData(`tag-${tag}`, async () => {
  const content = await getArticles({ tags: [tag] })
  return content.allArticles
})

const capitalise = (text) => text.charAt(0).toUpperCase() + text.slice(1)

useHead({
  title: `Articles Tagged - ${capitalise(tag)}`,
  link: [
    {
      rel: 'canonical',
      href: `${config.public.baseUrl}/blog/tags/${tag}`,
    },
  ],
})
</script>
