<template>
  <div
    v-if="pending"
    class="grid grid-flow-row px-0 md:mx-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  >
    <div v-for="n in 10" :key="n">
      <figure
        class="flex bg-gray-100 dark:bg-gray-800 rounded-xl pt-4 mx-0 my-2 md:mx-4 md:my-4 shadow-lg hover:shadow-xl"
      >
        <ContentLoader
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
        </ContentLoader>
      </figure>
    </div>
  </div>
  <p v-else-if="error">An error occurred :(</p>
  <div v-else>
    <div class="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="project of projects" :key="project.html_url">
        <ProjectCard :project="project" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ContentLoader } from 'vue-content-loader'

import global from '~/utils/global'

// Fetched in the browser, so the list is always up to date.
// Relevant fields: fork, archived, license.spdx_id, language, name,
// html_url, description, stargazers_count, watchers_count, forks_count
const {
  data: projects,
  pending,
  error,
} = useLazyFetch(
  `https://api.github.com/users/${global.githubUsername}/repos?per_page=1000`,
  {
    server: false,
    transform: (repos) =>
      repos
        .filter((project) => project.fork === false && project.license !== null)
        .sort(
          (a, b) =>
            a.archived - b.archived ||
            b.stargazers_count - a.stargazers_count ||
            a.name.localeCompare(b.name) ||
            (a.language ?? '').localeCompare(b.language ?? ''),
        ),
  },
)

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const contentLoaderPrimary = computed(
  () => (isDark.value ? '#9E9E9E' /* gray-500 */ : '#E0E0E0') /* gray-300 */,
)
const contentLoaderSecondary = computed(
  () => (isDark.value ? '#E0E0E0' /* gray-300 */ : '#9E9E9E') /* gray-500 */,
)

const randomSpeed = () => Math.random() + 1

useHead({ title: 'Projects' })
</script>
