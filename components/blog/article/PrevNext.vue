<template>
  <div class="flex justify-between">
    <NuxtLink
      v-if="prev"
      :to="{ name: 'blog-post-slug', params: { slug: prev.slug } }"
      class="color-black font-bold no-underline px-4 py-2 rounded-full shadow-lg hover:shadow-xl 
      bg-gray-200 hover:bg-blue-300 dark:bg-gray-800 hover:dark:bg-gray-800 
      border-solid border-2 border-gray-600 dark:border-gray-600 transition-colors"
    >
      << {{ prev.title }} <<
    </NuxtLink>
    <span v-else>&nbsp;</span>
    <NuxtLink
      v-if="next"
      :to="{ name: 'blog-post-slug', params: { slug: next.slug } }"
      class="text-primary font-bold no-underline px-4 py-2 rounded-full shadow-lg hover:shadow-xl 
      bg-gray-200 hover:bg-blue-400 dark:bg-gray-800 hover:dark:bg-gray-800 
      border-solid border-2 border-gray-600 dark:border-gray-600"
    >
      >> {{ next.title }} >>
    </NuxtLink>
    <span v-else>&nbsp;</span>
  </div>
</template>

<script>
export default {
  props: {
    prev: {
      type: Object,
      default: () => null,
    },
    next: {
      type: Object,
      default: () => null,
    },
  },
}
</script>
