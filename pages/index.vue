<template>
  <div>
    <div
      class="
        w-11/12
        flex-grow
        bg-white
        dark:bg-gray-800
        bg-opacity-100
        rounded-xl
        max-w-5xl
        z-10
        shadow-md
        p-4
        md:p-6
        md:my-2
        mx-auto
      "
    >
      <nuxt-content :document="page" />
    </div>

    <div class="flex flex-wrap justify-center">
      <NuxtLink
        to="/projects"
        class="
          flex
          place-items-center
          flex-col
          w-full
          md:w-48
          bg-gray-100
          dark:bg-gray-800
          rounded-xl
          p-4
          mx-0
          my-2
          md:mx-4
          md:my-4
          shadow-lg
          hover:shadow-xl
        "
      >
        <IconRocket class="fill-current h-24 w-24" />
        <div class="pt-2 text-4xl font-bold">Projects</div>
      </NuxtLink>

      <NuxtLink
        to="/blog"
        class="
          flex
          place-items-center
          flex-col
          w-full
          md:w-48
          bg-gray-100
          dark:bg-gray-800
          rounded-xl
          p-4
          mx-0
          my-2
          md:mx-4
          md:my-4
          shadow-lg
          hover:shadow-xl
        "
      >
        <IconBlog class="fill-current h-24 w-24" />
        <div class="pt-2 text-4xl font-bold">Blog</div>
      </NuxtLink>

      <a
        href="https://github.com/markusressel"
        target="_blank"
        class="
          flex
          place-items-center
          flex-col
          w-full
          md:w-48
          bg-gray-100
          dark:bg-gray-800
          rounded-xl
          p-4
          mx-0
          my-2
          md:mx-4
          md:my-4
          shadow-lg
          hover:shadow-xl
        "
      >
        <IconGithub class="fill-current h-24 w-24" />
        <div class="pt-2 text-4xl font-bold">GitHub</div>
      </a>
    </div>
  </div>
</template>

<script>
import IconRocket from '@/assets/icons/icon-rocket.svg?inline'
import IconBlog from '@/assets/icons/icon-blog.svg?inline'
import IconGithub from '@/assets/icons/icon-github.svg?inline'

import getContent from '@/utils/getContent'

export default {
  components: {
    IconRocket,
    IconBlog,
    IconGithub,
  },
  head() {
    return {
      title: 'Home',
    }
  },
  async asyncData({ $content, error }) {
    const page = await getContent($content, error, 'home')
    return {
      page,
    }
  },
}
</script>
