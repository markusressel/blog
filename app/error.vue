<template>
  <NuxtLayout>
    <div
      class="w-11/12 max-w-3xl mx-auto my-8 bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 text-center"
    >
      <p class="text-6xl font-bold text-blue-500">{{ error.statusCode }}</p>
      <h1 class="text-3xl font-bold mt-4">
        {{ notFound ? 'Page not found' : 'Something went wrong' }}
      </h1>
      <p class="mt-4 text-gray-700 dark:text-gray-300">
        {{
          notFound
            ? "This page doesn't exist (anymore). Maybe one of these helps:"
            : 'Please try again later, or go to one of these pages:'
        }}
      </p>
      <nav class="flex flex-wrap justify-center gap-4 mt-6">
        <button
          v-for="link of links"
          :key="link.to"
          type="button"
          class="rounded-full px-5 py-2 bg-gray-200 dark:bg-gray-900 hover:bg-blue-500 hover:text-white transition-colors"
          @click="clearError({ redirect: link.to })"
        >
          {{ link.text }}
        </button>
      </nav>
      <p class="mt-6 text-sm text-gray-600 dark:text-gray-400">
        Looking for an article? Use the search at the top.
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    required: true,
  },
})

const notFound = computed(() => props.error.statusCode === 404)

const links = [
  { to: '/', text: 'Home' },
  { to: '/blog', text: 'Blog' },
  { to: '/projects', text: 'Projects' },
]

useHead({ title: notFound.value ? 'Page not found' : 'Error' })
</script>
