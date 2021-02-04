<template>
  <figure
    class="md:flex bg-gray-100 dark:bg-gray-800 rounded-xl p-8 md:p-0 shadow hover:shadow-xl transition-all"
  >
    <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
      <p>
        
        {{ project.description }}
        <a :href="project.url">{{ project.name }}</a>
      </p>
    </div>
  </figure>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
    },
  },
}
</script>
