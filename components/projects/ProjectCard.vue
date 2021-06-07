<template>
  <figure
    class="
      flex flex-col
      bg-gray-100
      dark:bg-gray-800
      rounded-xl
      p-4
      mx-0
      my-2
      md:mx-4 md:my-4
      shadow-lg
      hover:shadow-xl
    "
  >
    <div class="flex justify-between">
      <a :href="project.html_url" target="_blank">{{ project.name }}</a>
      <div v-if="project.archived === true" class="text-orange-500">
        Archived
      </div>
      <a :href="project.html_url" target="_blank" class="float-right align-top"
        >{{ project.stargazers_count }} <IconStar class="inline align-top"
      /></a>
    </div>

    <div class="pt-2">{{ project.description }}</div>

    <table class="self-center mb-0 mt-4 text-center">
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
  </figure>
</template>

<script>
import IconStar from '@/assets/icons/icon-star.svg?inline'

export default {
  components: {
    IconStar,
  },
  props: {
    project: {
      type: Object,
      default: null,
    },
  },
}
</script>
