<template>
  <header class="flex justify-between py-2 h-12">
    <div class="flex place-items-center">
      <NuxtLink to="/" >
        <Logo class="align-middle" />
      </NuxtLink>
      <div class="font-bold pl-4">{{ siteName }}</div>
    </div>
    <div class="flex self-center items-center">
      <ColorModePicker />
      <SearchInput class="md:ml-8" />
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
