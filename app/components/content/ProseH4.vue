<template>
  <h4 :id="id">
    <a v-if="id" :href="`#${id}`" aria-hidden="true" tabindex="-1"
      ><span class="icon icon-link"></span></a
    ><slot />
  </h4>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: undefined,
  },
})
</script>
