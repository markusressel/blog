<template>
  <!-- table of contents -->
  <nav v-if="links.length" aria-labelledby="toc-title">
    <p
      id="toc-title"
      class="text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2"
    >
      Table of Contents
    </p>
    <ul class="border-l-2 border-gray-200 dark:border-gray-700">
      <li v-for="link of links" :key="link.id" class="list-none">
        <a
          :href="`#${link.id}`"
          class="block -ml-0.5 border-l-2 py-1 pr-2 hover:text-blue-500 transition-colors"
          :class="[
            link.depth === 3 ? 'pl-7 text-sm' : 'pl-4 font-semibold',
            link.id === activeId
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-gray-700 dark:text-gray-300',
          ]"
          :aria-current="link.id === activeId ? 'location' : undefined"
          >{{ link.text }}</a
        >
      </li>
    </ul>
  </nav>
</template>

<script setup>
const props = defineProps({
  // nested toc links of @nuxt/content, sub-headings are in `children`
  toc: {
    type: Array,
    default: () => [],
  },
})

const flatten = (links) =>
  links.flatMap((link) => [link, ...flatten(link.children ?? [])])

const links = computed(() => flatten(props.toc))

// highlight the section that is currently being read
const activeId = ref(null)
let observer = null

onMounted(() => {
  const visible = new Set()
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visible.add(entry.target.id)
        } else {
          visible.delete(entry.target.id)
        }
      }
      // the first visible heading in document order wins
      const first = links.value.find((link) => visible.has(link.id))
      if (first) {
        activeId.value = first.id
      }
    },
    // only the upper part of the viewport, below the sticky header, counts
    { rootMargin: '-80px 0px -60% 0px' },
  )
  for (const link of links.value) {
    const heading = document.getElementById(link.id)
    if (heading) {
      observer.observe(heading)
    }
  }
})

onBeforeUnmount(() => observer?.disconnect())
</script>
