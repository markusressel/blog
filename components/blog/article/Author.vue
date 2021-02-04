<template>
  <figure
    class="md:flex h-24 max-w-lg bg-gray-100 dark:bg-gray-800 rounded-xl p-8 md:p-0 shadow"
  >
    <img
      class="w-24 h-24 md:w-48 md:h-auto rounded-full md:rounded-none mr-auto"
      :src="author.image"
    />
    <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
      <blockquote>
        <p class="text-lg font-semibold">
          {{ author.bio }}
        </p>
      </blockquote>
      <figcaption class="font-medium">
        <div class="text-cyan-600">{{ author.name }}</div>
        <div class="text-gray-500">
          {{ author.jobtitle }}, {{ author.country }}
        </div>
      </figcaption>
    </div>
  </figure>
</template>

<script>
export default {
  props: {
    author: {
      type: Object,
      required: true,
    },
  },
}
</script>
