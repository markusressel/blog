<template>
  <header class="flex">
    <div class="flex flex-col">
      <NuxtLink to="/">
        <Logo class="h-12 m-4" />
      </NuxtLink>
      <div class="self-center font-bold">{{ siteName }}</div>
    </div>
    <div class="self-center text-3xl flex-grow">{{ pageTitle }}</div>
    <div class="flex flex-row items-center">
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
