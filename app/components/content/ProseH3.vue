<template>
  <h3 :id="id"><HeadingLink v-if="id" :id="id" /><slot /></h3>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: undefined,
  },
})
</script>
