<template>
  <h3 :id="id">
    <a v-if="id" :href="`#${id}`" aria-hidden="true" tabindex="-1"
      ><span class="icon icon-link"></span></a
    ><slot />
  </h3>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: undefined,
  },
})
</script>
