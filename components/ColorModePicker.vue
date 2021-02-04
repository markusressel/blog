<template>
  <ul>
    <li v-for="color of colors" :key="color" class="p-2 text-right">
      <component
        :is="`icon-${color}`"
        @click="$colorMode.preference = color"
        v-bind:class="{ selected: color === $colorMode.value }"
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

.theme-icon {
  cursor: pointer;
  background-color: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 5px;
}

.theme-icon:hover {
  top: -3px;
}
.selected {
  color: var(--color-primary);
}
</style>
