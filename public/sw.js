// The Nuxt 2 site registered a caching service worker (@nuxtjs/pwa) at /sw.js.
// Browsers that still have it installed fetch this file on their next visit:
// it clears the old caches and unregisters itself.
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
      await self.registration.unregister()
      const clients = await self.clients.matchAll({ type: 'window' })
      clients.forEach((client) => client.navigate(client.url))
    })(),
  )
})
