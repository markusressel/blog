<template>
  <div class="h-screen flex flex-col transition-all duration-200 ease-linear">
    <Header
      class="z-10 bg-gray-100 dark:bg-gray-900 transition-all duration-200 p-4 shadow-md"
    />
    <vue-scroll :ops="ops">
      <main
        class="flex-1 overflow-auto px-4 py-5 bg-gray-100 dark:bg-gray-900 transition-all duration-200"
      >
        <Nuxt />
      </main>
    </vue-scroll>
    <Footer class="z-10 shadow-md" />
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default {
  name: 'MainLayout',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      ops: {
        vuescroll: {},
        scrollPanel: {
          speed: 800,
          easing: 'easeOutCubic',
        },
        rail: {},
        bar: {
          keepShow: true,
        },
      },
    }
  },
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
