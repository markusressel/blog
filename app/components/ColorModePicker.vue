<template>
  <div class="flex">
    <component
      :is="icons[currentTheme]"
      class="fill-current center w-8 h-8 align-middle hover:shadow-2xl px-2"
      @click="cycleTheme()"
    />
  </div>
</template>

<script setup>
import { toast } from 'vue-sonner'

// import IconSystem from '~/assets/icons/theme-system.svg?component'
import IconSystem from '~/assets/icons/icon-eclipse.svg?component'
import IconLight from '~/assets/icons/theme-light.svg?component'
import IconDark from '~/assets/icons/theme-dark.svg?component'

const icons = { system: IconSystem, light: IconLight, dark: IconDark }
const themes = ['system', 'light', 'dark']

const colorMode = useColorMode()
const currentTheme = ref('system')

const hasUserAllowedStorage = () =>
  localStorage.getItem('vue-cookie-accept-decline-cookieNoticePanel') ===
  'accept'

onMounted(() => {
  // initialize from localStorage
  currentTheme.value = localStorage.getItem('nuxt-color-mode') || 'system'
  colorMode.preference = currentTheme.value
})

const cycleTheme = () => {
  if (!hasUserAllowedStorage()) {
    toast.error(
      "Please accept cookies, otherwise I can't save your theme selection for your next visit.",
      { id: 'theme-storage', duration: 5000 },
    )
    return
  }
  const index = themes.indexOf(currentTheme.value)
  currentTheme.value = themes[(index + 1) % themes.length]
  colorMode.preference = currentTheme.value
}
</script>

<style scoped>
svg {
  cursor: pointer;
}
</style>
