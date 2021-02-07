<template>
  <div
    v-if="$fetchState.pending"
    class="grid grid-flow-row p-16 md:m-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  >
    <div v-for="n in 10" :key="n">
      <content-loader
        width="300"
        height="200"
        primary-color="#f3f3f3"
        secondary-color="#cccccc"
        :speed="randomSpeed()"
      >
        <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
        <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
        <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
        <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
        <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
        <circle cx="20" cy="20" r="20" />
      </content-loader>
    </div>
  </div>
  <p v-else-if="$fetchState.error">An error occurred :(</p>
  <div v-else>
    <div class="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="project of projects" :key="project.html_url">
        <ProjectCard :project="project" />
      </div>
    </div>
    <md-button class="md-fab md-primary" @click="$fetch">
      <md-icon>refresh</md-icon>
    </md-button>
  </div>
</template>

<script>
import global from '@/utils/global'

import { ContentLoader } from 'vue-content-loader'

export default {
  components: {
    ContentLoader,
  },
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
  head() {
    return {
      title: 'Projects',
    }
  },
  methods: {
    randomSpeed() {
      return Math.random() + 1
    },
  },
  fetchOnServer: false,
}
</script>
