<template>
  <div class="flex justify-center">
    <figure
      class="flex self-center h-24 w-auto bg-gray-100 dark:bg-gray-700 rounded-xl mt-8 mb-4 shadow-xl"
    >
      <img class="w-24 h-24 rounded-l-lg" :src="author.image" />
      <div class="p-4 text-center">
        <blockquote>
          <p class="text-lg font-semibold">
            {{ author.cite }}
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
  </div>
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
