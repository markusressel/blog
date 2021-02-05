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
export default {
  head() {
    return {
      title: 'Home',
    }
  },
}
</script>
