<template>
  <div
      class="px-2 py-1 text-center rounded-full shadow-lg bg-gray-900 tracking-wider font-medium text-ss"
  >
      {{ text }}
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
      default: () => "",
    },
  },
}
</script>

<style scoped>
</style>
