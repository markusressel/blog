<template>
  <div
    class="m-0 h-screen flex flex-col transition-all duration-200 ease-linear bg-gray-300 dark:bg-gray-900"
  >
    <PageHeader
      class="z-10 m-0 bg-gray-200 dark:bg-gray-800 transition-all duration-200 px-2 shadow-lg"
    />
    <div ref="scrollContainer" class="scroll-container flex-1 overflow-y-auto">
      <main class="flex-1 px-2 md:px-4 py-5 transition-all duration-200 z-0">
        <slot />
      </main>
    </div>
    <ClientOnly>
      <VueCookieAcceptDecline
        element-id="cookieNoticePanel"
        :debug="false"
        position="bottom"
        type="bar"
        :disable-decline="false"
        transition-name="slideFromBottom"
        :show-postpone-button="false"
      >
        <template #message>
          To save your user settings (like the theme) I use local storage. If
          you don't need that, just opt out.
          <a href="https://cookiesandyou.com/" target="_blank">Learn More...</a>
        </template>

        <template #declineContent>OPT OUT</template>

        <template #acceptContent>GOT IT!</template>
      </VueCookieAcceptDecline>
      <Toaster rich-colors position="bottom-right" />
    </ClientOnly>
    <PageFooter />
  </div>
</template>

<script setup>
import { Toaster } from 'vue-sonner'

// The page scrolls inside this container, not the window, so the router's
// scroll behavior has no effect. Reset it on navigation, but keep anchors working.
const scrollContainer = ref(null)
const router = useRouter()
router.afterEach((to, from) => {
  if (to.path !== from.path && !to.hash) {
    scrollContainer.value?.scrollTo({ top: 0 })
  }
})
</script>

<style>
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}

.scroll-container {
  scrollbar-color: #448aff transparent;
}
</style>
