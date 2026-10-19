<template>
  <!-- the whole card links to the repository -->
  <a
    :href="project.html_url"
    target="_blank"
    rel="noopener"
    class="project-card group flex-1 min-w-0 flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-xl mx-0 my-2 md:mx-4 md:my-4 shadow-lg hover:shadow-xl transition-shadow"
    style="color: inherit"
  >
    <!-- first image of the README, resized to 640x320 at build time -->
    <div v-if="project.preview" class="overflow-hidden">
      <img
        :src="project.preview"
        alt=""
        width="640"
        height="320"
        loading="lazy"
        class="w-full aspect-[2/1] object-cover bg-gray-200 dark:bg-gray-900 transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <div class="flex flex-col flex-1 p-4">
      <div class="flex justify-between items-start gap-2">
        <span
          class="font-semibold break-all text-blue-500 group-hover:underline"
          >{{ project.name }}</span
        >
        <span v-if="project.archived === true" class="text-orange-500">
          Archived
        </span>
        <span
          class="flex items-center gap-1 shrink-0 text-gray-700 dark:text-gray-300"
          :aria-label="`${project.stargazers_count} stars`"
          >{{ project.stargazers_count }}
          <IconStar
            class="w-5 h-5 shrink-0 fill-current text-yellow-500"
            aria-hidden="true"
        /></span>
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
  </a>
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
