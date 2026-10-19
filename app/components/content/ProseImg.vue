<template>
  <!-- images in Markdown: resized at build time, loaded when scrolled into view -->
  <NuxtImg
    :src="src"
    :alt="alt"
    :title="title"
    width="1024"
    densities="x1 x2"
    format="webp"
    loading="lazy"
  />
</template>

<script setup>
defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: undefined,
  },
})
</script>
