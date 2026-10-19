<template>
  <header class="page-header flex justify-between items-center gap-2 py-2 h-16">
    <NuxtLink to="/" class="flex items-center shrink-0">
      <Logo class="align-middle" />
      <div
        class="text-gray-800 dark:text-gray-100 font-bold pl-3 whitespace-nowrap hidden min-[400px]:block"
      >
        {{ siteName }}
      </div>
    </NuxtLink>
    <div class="flex items-center gap-1 md:gap-2 min-w-0">
      <ClientOnly>
        <ColorModePicker />
        <template #fallback><div class="w-10 h-10" /></template>
      </ClientOnly>
      <SearchInput class="w-40 sm:w-56 md:w-64" />
    </div>
  </header>
</template>
<script>
import global from '@/utils/global'

export default {
  name: 'PageHeader',
  computed: {
    siteName() {
      return global.siteName
    },
  },
}
</script>
