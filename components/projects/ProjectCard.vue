<template>
  <figure
    class="md:flex bg-gray-100 dark:bg-gray-800 rounded-xl p-4 md:p-0 shadow-lg hover:shadow-xl transition-all"
  >
    <div class="md:p-4 text-center md:text-left space-y-4">
      <a :href="project.html_url">{{ project.name }}</a>
      <a :href="project.html_url" class="float-right align-top"
        ><IconStar class="inline align-top"/> {{ project.stargazers_count }}</a
      >
      <div class="text-cyan-600">Language</div>
      <div>{{ project.language }}</div>

      Description: {{ project.description }}

      Archived: {{ project.archived }}
    </div>
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
    },
  },
}
</script>
