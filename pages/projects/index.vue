<template>
  <div
    v-if="$fetchState.pending"
    class="grid grid-flow-row px-0 md:mx-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  >
    <div v-for="n in 10" :key="n">
      <figure
        class="flex bg-gray-100 dark:bg-gray-800 rounded-xl pt-4 mx-0 my-2 md:mx-4 md:my-4 shadow-lg hover:shadow-xl"
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
  </div>
</template>

<script>
import global from '@/utils/global'

import { ContentLoader } from 'vue-content-loader'

import ProjectCard from '@/components/projects/ProjectCard'

export default {
  components: {
    ContentLoader,
    ProjectCard,
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

    // a.created_at
    // fork: false
    // a.forks
    // a.forks_count
    // a.full_name (markusressel/repo)
    // a.license  {
    //   key: "agpl-3.0"
    //   name: "GNU Affero General Public License v3.0"
    //   spdx_id: "AGPL-3.0"
    // }
    // open_issues: 11
    // open_issues_count: 11
    // pushed_at: "2021-02-11T15:23:48Z"
    // updated_at: "2021-02-10T19:48:02Z"
    // a.owner.login == "markusressel"
    // watchers: 37
    // watchers_count: 37
    this.projects = await fetch(
      `https://api.github.com/users/${global.githubUsername}/repos`
    ).then((res) => res.json())

    this.projects = this.projects
      .filter((project) => {
        return project.fork === false && project.license !== null
      })
      .sort(function (a, b) {
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
