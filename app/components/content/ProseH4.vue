<template>
  <h4 :id="id"><HeadingLink v-if="id" :id="id" /><slot /></h4>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: undefined,
  },
})
</script>
