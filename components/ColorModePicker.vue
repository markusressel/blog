<template>
  <div class="flex">
    <component
      :is="`icon-` + $colorMode.value"
      :class="{ selected: theme === $colorMode.value }"
      class="align-middle hover:shadow-2xl px-1 md:px-2"
      @click="cycleTheme(theme)"
    />
  </div>
</template>

<script>
import IconSystem from '@/assets/icons/theme-system.svg?inline'
import IconLight from '@/assets/icons/theme-light.svg?inline'
import IconDark from '@/assets/icons/theme-dark.svg?inline'

export default {
  components: {
    IconSystem,
    IconLight,
    IconDark,
  },
  methods: {
    cycleTheme(theme) {
      var theme = this.$cookies.get('settings').theme

      let index = this.themes.indexOf(theme)
      let nextIndex = (index + 1) % this.themes.length

      let nextTheme = this.themes[nextIndex]

      this.$colorMode.preference = nextTheme
      this.$cookies.set(
        'settings',
        {
          theme: nextTheme,
        },
        {
          maxAge: 2147483647,
        }
      )
    },
  },
  data() {
    return {
      selected: false,
      themes: ['system', 'light', 'dark'],
    }
  },
}
</script>

<style scoped>
ul li {
  display: inline-block;
}

svg {
  cursor: pointer;
}

svg.selected {
  color: var(--color-primary);
}
</style>
