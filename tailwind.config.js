import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  // @nuxtjs/color-mode sets the `dark-mode` class on <html>
  darkMode: ['selector', '.dark-mode'],
  content: ['app/**/*.{vue,js,ts}', 'content/**/*.md', 'nuxt.config.ts'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            // inline code is styled in main.css, without backticks
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            // blockquotes are styled in main.css, without quotation marks
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:last-of-type::after': { content: 'none' },
            a: {
              color: '#2196f3',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            },
          },
        },
      },
    },
  },
  plugins: [typography],
}
