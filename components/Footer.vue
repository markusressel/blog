<template>
  <footer
    class="flex justify-center h-8 bg-white dark:bg-black text-gray-700 dark:text-gray-500"
  >
    <div class="self-center text-xs">
      &copy; {{ new Date().getFullYear() }} {{ siteOwner }}
      |
      <NuxtLink :to="{ name: 'impressum' }" style="text-color: inherit">
        Impressum
      </NuxtLink>
    </div>
  </footer>
</template>

<script>
import global from '@/utils/global'

export default {
  name: 'Footer',
  computed: {
    siteOwner() {
      return global.author
    },
  },
}
</script>
