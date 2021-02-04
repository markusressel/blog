<template>
  <div>
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
  name: 'HomePage',
  async asyncData({ $content, app, params, error }) {
  },
}
</script>
