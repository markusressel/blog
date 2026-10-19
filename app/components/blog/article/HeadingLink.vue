<template>
  <!-- jumps to the heading and copies its link -->
  <a
    :href="`#${id}`"
    class="relative"
    aria-hidden="true"
    tabindex="-1"
    @click="copyLink"
    ><span class="icon icon-link"></span
    ><span
      v-if="copied"
      class="not-prose absolute left-0 -top-7 whitespace-nowrap rounded-md bg-gray-800 dark:bg-gray-200 px-2 py-0.5 text-xs font-normal text-white dark:text-gray-900 shadow"
      >Link copied</span
    ></a
  >
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const copied = ref(false)
let timeout = null

const copyLink = async () => {
  const url = new URL(`#${props.id}`, window.location.href).href
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    // clipboard not available (e.g. no HTTPS), the link still jumps to the heading
    return
  }
  copied.value = true
  clearTimeout(timeout)
  timeout = setTimeout(() => (copied.value = false), 1500)
}

onBeforeUnmount(() => clearTimeout(timeout))
</script>
