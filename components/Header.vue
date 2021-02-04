<template>
  <header class="flex justify-between">
    <div class="flex">
      <NuxtLink to="/">
        <Logo class="w-12 h-12 m-4" />
      </NuxtLink>
      <div class="self-center font-bold pl-4">{{ siteName }}</div>
    </div>
    <div class="flex self-center items-center">
      <ColorModePicker /> <SearchInput class="ml-8" />
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
