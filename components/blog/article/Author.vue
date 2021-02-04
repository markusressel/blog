<template>
  <figure
    class="md:flex bg-gray-100 dark:bg-gray-800 rounded-xl p-8 md:p-0 shadow"
  >
    <img
      class="w-32 h-32 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto"
      :src="author.image"
      alt=""
      width="384"
      height="512"
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
