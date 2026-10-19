import VueCookieAcceptDecline from 'vue-cookie-accept-decline'

import 'vue-cookie-accept-decline/dist/vue-cookie-accept-decline.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VueCookieAcceptDecline', VueCookieAcceptDecline)
})
