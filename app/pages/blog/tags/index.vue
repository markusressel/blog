<template>
  <div>
    <div class="flex justify-center">
      <h2
        class="text-center text-3xl mb-4 uppercase dark:text-white inline-block mx-auto px-2"
      >
        All Tags
      </h2>
    </div>

    <ul class="list-none flex flex-col flex-wrap pt-6">
      <li v-for="tag in tags" :key="tag" class="mb-2">
        <NuxtLink
          :to="{ name: 'blog-tags-tag', params: { tag: tag.toLowerCase() } }"
          class="text-2xl"
        >
          <Chip :text="`#${tag}`" />
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { getTags } from '~/utils/content'

const config = useRuntimeConfig()

const { data: tags } = await useAsyncData('tags', getTags)

useHead({
  title: 'Tags',
  link: [{ rel: 'canonical', href: `${config.public.baseUrl}/blog/tags` }],
})
</script>
