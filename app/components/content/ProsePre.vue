<template>
  <div class="nuxt-content-highlight not-prose">
    <span v-if="filename" class="filename">{{ filename }}</span>
    <button type="button" class="copy-button" @click="copy">
      {{ copied ? 'Copied!' : 'Copy' }}
    </button>
    <pre
      :class="['line-numbers', $props.class]"
      :data-language="language"
    ><slot /></pre>
  </div>
</template>

<script setup>
const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array,
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: null,
  },
})

const copied = ref(false)

const copy = async () => {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>
