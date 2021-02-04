<template>
  <p v-if="$fetchState.pending">Fetching projects...</p>
  <p v-else-if="$fetchState.error">An error occurred :(</p>
  <div v-else>
    <div class="grid grid-flow-row grid-cols-3 grid-rows-3 gap-4">
      <div v-for="project of projects" :key="project">
        <ProjectCard :project="project" />
      </div>
    </div>
    <button @click="$fetch">Refresh</button>
  </div>
</template>

<script>
import global from '@/utils/global'

export default {
  data() {
    return {
      projects: [],
    }
  },
  async fetch() {
    this.projects = await fetch(
      `https://api.github.com/users/${global.githubUsername}/repos`
    ).then((res) => res.json())
  },
  fetchOnServer: false,
}
</script>
