import { readdirSync, readFileSync } from 'node:fs'

// Prerender every article explicitly: the crawler only reaches articles that
// are linked from the first page of the blog list or from prev/next links.
const articleRoutes = readdirSync('content/articles')
  .filter((file) => file.endsWith('.md'))
  .filter(
    (file) =>
      !/^dummy:\s*true\s*$/m.test(
        readFileSync(`content/articles/${file}`, 'utf8'),
      ),
  )
  .map((file) => `/blog/post/${file.replace(/\.md$/, '')}`)

const blogPageRoutes = Array.from(
  { length: Math.ceil(articleRoutes.length / 5) - 1 },
  (_, index) => `/blog/page/${index + 2}`,
)

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/sitemap',
    '@nuxtjs/tailwindcss',
    'nuxt-svgo',
  ],

  app: {
    head: {
      title: "Markus' Blog",
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:site_name', content: "Markus' Blog" },
        { property: 'og:type', content: 'website' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  css: ['~/assets/css/main.css'],

  experimental: {
    // smooth page changes in browsers that support the View Transition API
    viewTransition: true,
  },

  image: {
    // Resize and convert images at build time into static files. Without this,
    // the module would switch to the Netlify Image CDN when building on Netlify.
    provider: 'ipx',
    // Images live in public/. Remote images can't be prerendered into static files
    // when their URL has a query string; this host is only used by dummy articles,
    // which are never prerendered.
    domains: ['images.freeimages.com'],
    format: ['webp'],
    quality: 80,
  },

  // Auto import components without their folder as name prefix
  components: [{ path: '~/components', pathPrefix: false }],

  runtimeConfig: {
    public: {
      baseUrl: 'https://markusressel.de',
    },
  },

  site: {
    url: 'https://markusressel.de',
    name: "Markus' Blog",
  },

  routeRules: {
    '/blog/post': { redirect: { to: '/blog', statusCode: 301 } },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/blog',
        '/blog/tags',
        '/search-index.json',
        '/projects.json',
        ...blogPageRoutes,
        ...articleRoutes,
      ],
    },
  },

  content: {
    experimental: {
      sqliteConnector: 'native',
    },
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3,
        },
        highlight: {
          theme: 'dark-plus',
          langs: [
            'bash',
            'diff',
            'go',
            'kotlin',
            'markdown',
            'python',
            'shell',
            'shellsession',
            'yaml',
          ],
        },
      },
    },
  },

  colorMode: {
    // keeps the `dark-mode` class on <html> that the styles rely on
    classSuffix: '-mode',
    storageKey: 'nuxt-color-mode',
  },

  postcss: {
    plugins: {
      // not used, and not loadable from tailwindcss 3 in an ESM project
      'tailwindcss/nesting': false,
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
  },

  svgo: {
    autoImportPath: false,
    defaultImport: 'component',
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },
})
