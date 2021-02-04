<template>
  <header class="flex">
    <div class="flex flex-col">
      <NuxtLink to="/">
        <Logo class="m-4" />
      </NuxtLink>
      <div class="self-center font-bold">{{ siteName }}</div>
    </div>
    <div class="self-center text-3xl flex-grow">{{ pageTitle }}</div>
    <div class="flex flex-col">
      <SearchInput class="ml-8" />
      <ColorModePicker />
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
