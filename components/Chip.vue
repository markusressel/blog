<template>
  <div
    class="px-2 py-1 text-center rounded-full shadow-md hover:shadow-lg shadow-white bg-gray-50 dark:bg-gray-900 tracking-wider font-medium text-ss"
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
  },
}
</script>

<style scoped></style>
