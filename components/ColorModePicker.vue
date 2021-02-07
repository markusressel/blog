<template>
  <ul>
    <li v-for="color of colors" :key="color" class="p-2">
      <component
        :is="`icon-${color}`"
        :class="{ selected: color === $colorMode.value }"
        class="align-middle hover:shadow-2xl"
        @click="$colorMode.preference = color"
      />
    </li>
  </ul>
</template>

<script>
import IconSystem from '@/assets/icons/theme-system.svg?inline'
import IconLight from '@/assets/icons/theme-light.svg?inline'
import IconDark from '@/assets/icons/theme-dark.svg?inline'

export default {
  components: {
    IconSystem,
    IconLight,
    IconDark,
  },
  data() {
    return {
      selected: false,
      colors: ['system', 'light', 'dark'],
    }
  },
}
</script>

<style scoped>
ul li {
  display: inline-block;
}

svg {
  cursor: pointer;
}

svg.selected {
  color: var(--color-primary);
}
</style>
