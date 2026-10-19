<template>
  <button
    type="button"
    class="flex rounded-full p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
    :aria-label="`Theme: ${current}. Switch to ${next}.`"
    :title="`Theme: ${current}`"
    @click="cycleTheme"
  >
    <component
      :is="icons[current]"
      class="fill-current w-8 h-8 align-middle px-1"
      aria-hidden="true"
    />
  </button>
</template>

<script setup>
// import IconSystem from '~/assets/icons/theme-system.svg?component'
import IconSystem from '~/assets/icons/icon-eclipse.svg?component'
import IconLight from '~/assets/icons/theme-light.svg?component'
import IconDark from '~/assets/icons/theme-dark.svg?component'

const icons = { system: IconSystem, light: IconLight, dark: IconDark }
const themes = ['system', 'light', 'dark']

// @nuxtjs/color-mode stores the preference in localStorage itself
const colorMode = useColorMode()

const current = computed(() =>
  themes.includes(colorMode.preference) ? colorMode.preference : 'system',
)
const next = computed(
  () => themes[(themes.indexOf(current.value) + 1) % themes.length],
)

const cycleTheme = () => {
  colorMode.preference = next.value
}
</script>
