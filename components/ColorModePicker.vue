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
  mounted: function () {
    // initialize from localStorage
    this.currentTheme = localStorage.getItem("nuxt-color-mode") || "system"
    this.$colorMode.preference = this.currentTheme
  },
  methods: {
    cycleTheme() {
      if (!this.hasUserAllowedStorage) {
        this.$toasted.show('Please accept cookies, otherwise I can\'t save your theme selection for your next visit.', {
          type: 'error',
          duration: 5000,
          keepOnHover: true,
          singleton: true
        })
        return;
      }
      let index = this.themes.indexOf(this.currentTheme)
      let nextIndex = (index + 1) % this.themes.length
      let nextTheme = this.themes[nextIndex]
      this.currentTheme = nextTheme
      this.$colorMode.preference = this.currentTheme
    },
  },
  data() {
    return {
      get hasUserAllowedStorage() {
        return localStorage.getItem("vue-cookie-accept-decline-cookieNoticePanel") == "accept" || false
      },
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
