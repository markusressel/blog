<template>
  <!-- table of contents -->
  <div>
    <p class="text-xl mb-0">Table of Contents:</p>
    <nav class="">
      <ul class="px-4 my-2">
        <li
          v-for="link of toc"
          :key="link.id"
          class="list-none"
          :class="{
            'font-semibold': link.depth === 2,
          }"
        >
          <nuxtLink
            :to="`#${link.id}`"
            class="hover:underline"
            :class="{
              'py-2': link.depth === 2,
              'ml-3 pb-2': link.depth === 3,
            }"
            >{{ link.text }}</nuxtLink
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    toc: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
