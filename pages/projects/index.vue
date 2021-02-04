<template>
  <p v-if="$fetchState.pending">Fetching projects...</p>
  <p v-else-if="$fetchState.error">An error occurred :(</p>
  <div v-else>
    <ul>
      <li v-for="project of projects" :key="project">
        <ProjectCard :project="project" />
      </li>
    </ul>
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
