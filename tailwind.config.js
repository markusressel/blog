/** @type {import('tailwindcss').Config} */
export default {
  // @nuxtjs/color-mode sets the `dark-mode` class on <html>
  darkMode: ['selector', '.dark-mode'],
  content: ['app/**/*.{vue,js,ts}', 'content/**/*.md', 'nuxt.config.ts'],
}
