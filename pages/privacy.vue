<template>
  <article class="flex justify-center">
    <div
      class="
        flex-grow
        bg-white
        dark:bg-gray-800
        bg-opacity-100
        rounded-3xl
        max-w-5xl
        z-10
        shadow-lg
        p-8
        m-2
      "
    >
      <nuxt-content :document="page" />
    </div>
  </article>
</template>
<script>
import getContent from '@/utils/getContent'

export default {
  async asyncData({ $content, error }) {
    const page = await getContent($content, error, 'privacy-policy')
    return {
      page,
    }
  },
  head() {
    return {
      title: 'Privacy Policy',
    }
  },
}
</script>
