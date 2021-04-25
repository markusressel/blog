<template>
  <div
    class="m-0 h-screen flex flex-col transition-all duration-200 ease-linear bg-gray-300 dark:bg-gray-900"
  >
    <Header
      class="z-10 m-0 bg-gray-200 dark:bg-gray-800 transition-all duration-200 px-2 shadow-lg"
    />
    <vue-scroll :ops="ops" class="flex-1 overflow-y-scroll">
      <main
        class="flex-1 overflow-auto px-2 md:px-4 py-5 transition-all duration-200 z-0"
      >
        <Nuxt />
      </main>
    </vue-scroll>
    <vue-cookie-accept-decline
      :ref="'cookieNoticePanel'"
      :elementId="'cookieNoticePanel'"
      :debug="false"
      :position="'bottom'"
      :type="'bar'"
      :disableDecline="false"
      :transitionName="'slideFromBottom'"
      :showPostponeButton="false"
      @status="cookieStatus"
      @clicked-accept="cookieClickedAccept"
      @clicked-decline="cookieClickedDecline">

      <!-- Optional -->
      <div slot="postponeContent">
          &times;
      </div>

      <!-- Optional -->
      <div slot="message">
          We use cookies to ensure you get the best experience on our website. <a href="https://cookiesandyou.com/" target="_blank">Learn More...</a>
      </div>

      <!-- Optional -->
      <div slot="declineContent">
        OPT OUT
      </div>

      <!-- Optional -->
      <div slot="acceptContent">
          GOT IT!
      </div>
    </vue-cookie-accept-decline>
    <Footer />
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
        vuescroll: {
          mode: 'native',
          sizeStrategy: 'percent',
          detectResize: true,
          /** Enable locking to the main axis if user moves only slightly on one of them at start */
          locking: true,
        },
        scrollPanel: {
          scrollingX: false,
          speed: 800,
          easing: 'easeOutCubic',
        },
        rail: {},
        bar: {
          background: '#448aff',
          keepShow: true,
        },
      },
    }
  },
  methods: {
    cookieStatus(event) {
      console.log(event)
    },
    cookieClickedAccept() {
      console.log("cookieClickedAccept")
    },
    cookieClickedDecline() {
      console.log("cookieClickedDecline")
    },
  },
  mounted() {
    this.$root.$on('removeposition', filter => { })
  }
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
}
</style>
