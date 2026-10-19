<template>
  <figure
    class="project-card flex-1 min-w-0 flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-xl mx-0 my-2 md:mx-4 md:my-4 shadow-lg hover:shadow-xl"
  >
    <!-- first image of the README, resized at build time -->
    <a
      v-if="project.preview"
      :href="project.html_url"
      target="_blank"
      rel="noopener"
      tabindex="-1"
      aria-hidden="true"
    >
      <img
        :src="project.preview"
        alt=""
        width="640"
        height="320"
        loading="lazy"
        class="w-full h-36 object-contain bg-gray-200 dark:bg-gray-900"
      />
    </a>

    <div class="flex flex-col flex-1 p-4">
      <div class="flex justify-between items-start gap-2">
        <a
          :href="project.html_url"
          target="_blank"
          rel="noopener"
          class="font-semibold break-all"
          >{{ project.name }}</a
        >
        <div v-if="project.archived === true" class="text-orange-500">
          Archived
        </div>
        <a
          :href="project.html_url"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-1 shrink-0 text-gray-700 dark:text-gray-300 hover:text-blue-500"
          :aria-label="`${project.stargazers_count} stars`"
          >{{ project.stargazers_count }}
          <IconStar
            class="w-5 h-5 shrink-0 fill-current text-yellow-500"
            aria-hidden="true"
        /></a>
      </div>

      <div class="pt-2 flex-1">{{ project.description }}</div>

      <table class="data-table self-center mb-0 mt-4 text-center">
        <thead>
          <tr>
            <th>License</th>
            <th>Language</th>
            <th>Watchers</th>
            <th>Forks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ project.license.spdx_id }}</td>
            <td>{{ project.language }}</td>
            <td>{{ project.watchers_count }}</td>
            <td>{{ project.forks_count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
</template>

<script setup>
import IconStar from '~/assets/icons/icon-star.svg?component'

defineProps({
  project: {
    type: Object,
    required: true,
  },
})
</script>
