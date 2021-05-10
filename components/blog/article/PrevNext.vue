<template>
  <div class="flex justify-between">
    <NuxtLink
      v-if="prev"
      :to="{ name: 'blog-post-slug', params: { slug: prev.slug } }"
      class="
        shadow-lg
        border
        rounded-full
        px-6
        py-2
        mb-0
        mr-1
        text-sm text-bold text-center
        bg-white
        dark:bg-gray-800
        self-end
        flex
        justify-center
        items-center
        sm:uppercase
        hover:bg-blue-500
        text-blue-500
        hover:text-white
        transform
        duration-300
        ease-in-out
      "
    >
      <<<br />
      {{ prev.title }}
    </NuxtLink>
    <span v-else>&nbsp;</span>
    <NuxtLink
      v-if="next"
      :to="{ name: 'blog-post-slug', params: { slug: next.slug } }"
      class="
        shadow-lg
        border
        rounded-full
        px-6
        py-2
        mb-0
        ml-1
        text-sm text-bold text-center
        bg-white
        dark:bg-gray-800
        self-end
        flex
        justify-center
        items-center
        sm:uppercase
        hover:bg-blue-500
        text-blue-500
        hover:text-white
        transform
        duration-300
        ease-in-out
      "
    >
      >><br />
      {{ next.title }}
    </NuxtLink>
    <span v-else>&nbsp;</span>
  </div>
</template>

<script>
export default {
  props: {
    prev: {
      type: Object,
      default: () => null,
    },
    next: {
      type: Object,
      default: () => null,
    },
  },
}
</script>
