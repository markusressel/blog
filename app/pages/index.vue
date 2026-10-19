<template>
  <div>
    <div
      class="w-11/12 flex-grow bg-white dark:bg-gray-800 bg-opacity-100 rounded-xl max-w-5xl z-10 shadow-md p-4 md:p-6 md:my-2 mx-auto"
    >
      <ContentRenderer
        v-if="page"
        :value="page"
        class="prose dark:prose-invert max-w-none"
        data-snapshot="content"
      />
    </div>

    <div class="flex flex-wrap justify-center">
      <NuxtLink
        to="/projects"
        class="image-link-card flex place-items-center flex-col w-full md:w-48 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mx-0 my-2 md:mx-4 md:my-4 shadow-lg hover:shadow-xl"
      >
        <IconRocket class="fill-current h-24 w-24" />
        <div class="pt-2 text-4xl font-bold">Projects</div>
      </NuxtLink>

      <NuxtLink
        to="/blog"
        class="image-link-card flex place-items-center flex-col w-full md:w-48 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mx-0 my-2 md:mx-4 md:my-4 shadow-lg hover:shadow-xl"
      >
        <IconBlog class="fill-current h-24 w-24" />
        <div class="pt-2 text-4xl font-bold">Blog</div>
      </NuxtLink>

      <a
        href="https://github.com/markusressel"
        target="_blank"
        class="image-link-card flex place-items-center flex-col w-full md:w-48 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mx-0 my-2 md:mx-4 md:my-4 shadow-lg hover:shadow-xl"
      >
        <IconGithub class="fill-current h-24 w-24" />
        <div class="pt-2 text-4xl font-bold">GitHub</div>
      </a>
    </div>
  </div>
</template>

<script setup>
import IconRocket from '~/assets/icons/icon-rocket.svg?component'
import IconBlog from '~/assets/icons/icon-blog.svg?component'
import IconGithub from '~/assets/icons/icon-github.svg?component'

import { getPage } from '~/utils/content'

const { data: page } = await useAsyncData('page-home', () => getPage('home'))

useHead({ title: 'Home' })
</script>
