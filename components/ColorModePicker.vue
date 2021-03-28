<template>
  <div class="flex">
    <component
      :is="`icon-` + currentTheme"
      class="align-middle hover:shadow-2xl px-2"
      @click="cycleTheme()"
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
    cycleTheme() {
      let settings = this.$cookies.get('settings');
      if (settings !== undefined) {
        this.currentTheme = settings.theme;
      }
      
      let index = this.themes.indexOf(this.currentTheme);
      let nextIndex = (index + 1) % this.themes.length;

      let nextTheme = this.themes[nextIndex];
      this.currentTheme = nextTheme;
      this.$colorMode.preference = this.currentTheme;
      this.$cookies.set(
        'settings',
        {
          theme: this.currentTheme,
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
      currentTheme: 'system',
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
