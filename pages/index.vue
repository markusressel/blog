<template>
  <div class="text-2xl">
    <NuxtLink to="/projects">
      <h1>Projects</h1>
    </NuxtLink>

    <NuxtLink to="/blog">
      <h1>Blog</h1>
    </NuxtLink>
  </div>
</template>

<script>
import getContent from '@/utils/getContent';

export default {
  head() {
    return {
      title: "Home"
    };
  },
  async asyncData({ $content, app, params, error }) {
  },
}
</script>
