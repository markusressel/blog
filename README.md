# Markus' Blog

This repository holds all the code for my personal website [https://markusressel.de](https://markusressel.de), which curently consists of a blog and an "about me" page.

The site is written using [Nuxt](https://nuxt.com) 4, which is based on [Vue.js](https://vuejs.org/) 3, with blog posts written in Markdown and rendered by [Nuxt Content](https://content.nuxt.com). Nuxt pre-renders every page into a static site, which is hosted on [Netlify](https://www.netlify.com).

## Build Setup

Requires Node.js 22.

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# generate the static site into dist/ and serve it at localhost:3000
$ yarn generate:serve

# run the end-to-end tests against the generated site
$ yarn test:e2e:ci
```
