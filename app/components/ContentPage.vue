<template>
  <article class="flex justify-center">
    <div
      class="flex-grow bg-white dark:bg-gray-800 bg-opacity-100 rounded-3xl max-w-5xl z-10 shadow-lg p-8 m-2"
    >
      <ContentRenderer
        v-if="page"
        :value="page"
        class="nuxt-content"
        data-snapshot="content"
      />
    </div>
  </article>
</template>

<script setup>
import { getPage } from '~/utils/content'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

const { data: page } = await useAsyncData(`page-${props.name}`, () =>
  getPage(props.name),
)
if (!page.value) {
  throw createError({ statusCode: 404, message: 'Page not found' })
}

useHead({ title: props.title })
</script>
