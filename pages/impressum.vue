<template>
  <article class="flex justify-center">
    <div
      class="flex-grow bg-white dark:bg-gray-800 bg-opacity-100 rounded-3xl max-w-5xl z-10 shadow-lg p-8 m-2"
    >
      <nuxt-content :document="page" />
    </div>
  </article>
</template>
<script>
import getContent from '@/utils/getContent'

export default {
  head() {
    return {
      title: 'Impressum',
    }
  },
  async asyncData({ $content, params, error }) {
    return getContent($content, 'impressum')
  },
}
</script>
