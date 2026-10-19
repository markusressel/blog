<template>
  <nav
    v-if="prev || next"
    class="grid gap-4 sm:grid-cols-2 w-11/12 max-w-6xl mx-auto"
    aria-label="More articles"
  >
    <NuxtLink
      v-if="prev"
      :to="{ name: 'blog-post-slug', params: { slug: prev.slug } }"
      rel="prev"
      :class="cardClass"
    >
      <span :class="labelClass">← Previous article</span>
      <span :class="titleClass">{{ prev.title }}</span>
    </NuxtLink>
    <NuxtLink
      v-if="next"
      :to="{ name: 'blog-post-slug', params: { slug: next.slug } }"
      rel="next"
      :class="[cardClass, 'sm:col-start-2 sm:text-right']"
    >
      <span :class="labelClass">Next article →</span>
      <span :class="titleClass">{{ next.title }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup>
defineProps({
  prev: {
    type: Object,
    default: null,
  },
  next: {
    type: Object,
    default: null,
  },
})

const cardClass =
  'prev-next-card group flex flex-col gap-1 rounded-xl bg-white dark:bg-gray-800 px-5 py-4 shadow-lg hover:shadow-xl transition-shadow'
const labelClass =
  'text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400'
const titleClass =
  'font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-500 transition-colors'
</script>
