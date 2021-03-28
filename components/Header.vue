<template>
  <header class="flex justify-between py-2 h-12">
    <NuxtLink to="/" class="flex place-items-center">
      <Logo class="align-middle" />
      <div class="text-gray-800 dark:text-gray-100 font-bold pl-4">
        {{ siteName }}
      </div>
    </NuxtLink>
    <div class="flex self-center items-center">
      <ColorModePicker />
      <SearchInput class="md:ml-2" />
    </div>
  </header>
</template>
<script>
import global from '@/utils/global'

export default {
  computed: {
    siteName() {
      return global.siteName
    },
  },
}
</script>
