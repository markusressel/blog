<template>
  <h2 :id="id">
    <a v-if="id" :href="`#${id}`" aria-hidden="true" tabindex="-1"
      ><span class="icon icon-link"></span></a
    ><slot />
  </h2>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: undefined,
  },
})
</script>
