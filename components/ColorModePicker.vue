<template>
  <div class="flex">
    <component
      :is="`icon-` + currentTheme"
      class="fill-current center w-8 h-8 align-middle hover:shadow-2xl px-2"
      @click="cycleTheme()"
    />
  </div>
</template>

<script>
//import IconSystem from '@/assets/icons/theme-system.svg?inline'
import IconSystem from '@/assets/icons/icon-eclipse.svg?inline'
import IconLight from '@/assets/icons/theme-light.svg?inline'
import IconDark from '@/assets/icons/theme-dark.svg?inline'

export default {
  components: {
    IconSystem,
    IconLight,
    IconDark,
  },
  mounted: function() {
    // initialize theme from cookie
    let settings = this.$cookies.get('settings');
    if (settings !== undefined) {
      this.currentTheme = settings.theme;
    } else {
      this.currentTheme = 'system';
    }
  },
  methods: {
    cycleTheme() {
      let index = this.themes.indexOf(this.currentTheme);
      let nextIndex = (index + 1) % this.themes.length;
      let nextTheme = this.themes[nextIndex];
      this.currentTheme = nextTheme;
      this.$cookies.set(
        'settings',
        {
          theme: nextTheme,
        },
        {
          maxAge: 2147483647,
        }
      )
      this.$colorMode.preference = nextTheme;
    },
  },
  data() {
    return {
      selected: false,
      themes: ['system', 'light', 'dark'],
      currentTheme: 'system'
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
