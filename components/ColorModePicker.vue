<template>
  <div class="flex">
    <div v-for="theme of themes" :key="theme" class="px-2">
      <component
        :is="`icon-${theme}`"
        :class="{ selected: theme === $colorMode.value }"
        class="align-middle hover:shadow-2xl"
        @click="setTheme(theme)"
      />
    </div>
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
    setTheme(theme) {
      this.$colorMode.preference = theme
      this.$cookies.set(
        'settings',
        {
          theme: theme,
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
