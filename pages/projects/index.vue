<template>
  <div
    v-if="$fetchState.pending"
    class="grid grid-flow-row px-0 md:mx-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  >
    <div v-for="n in 10" :key="n">
      <figure
        class="md:flex bg-gray-100 dark:bg-gray-800 rounded-xl pt-4 mx-0 my-2 md:mx-4 md:my-4 shadow-lg hover:shadow-xl"
      >
        <content-loader
          width="300"
          height="120"
          :primary-color="contentLoaderPrimary"
          :secondary-color="contentLoaderSecondary"
          :speed="randomSpeed()"
          class="mx-4"
        >
          <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
          <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
          <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
          <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
          <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
          <circle cx="20" cy="20" r="20" />
        </content-loader>
      </figure>
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
  computed: {
    contentLoaderPrimary: function () {
      if (this.$colorMode.preference == 'dark') {
        return '#9E9E9E' // gray-500
      } else {
        return '#E0E0E0' // gray-300
      }
    },
    contentLoaderSecondary: function () {
      if (this.$colorMode.preference == 'dark') {
        return '#E0E0E0' // gray-300
      } else {
        return '#9E9E9E' // gray-500
      }
    },
  },
  async fetch() {
    // use for debugging content-loader
    //await new Promise((r) => setTimeout(r, 2000000))
    this.projects = await fetch(
      `https://api.github.com/users/${global.githubUsername}/repos`
    ).then((res) => res.json())
    this.projects = this.projects.sort(function (a, b) {
      return (
        a.archived - b.archived ||
        b.stargazers_count - a.stargazers_count ||
        a.name.localeCompare(b.name) ||
        a.language.localeCompare(b.language)
      )
    })
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
