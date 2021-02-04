<template>
  <ul>
    <li v-for="color of colors" :key="color">
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
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
ul li {
  display: inline-block;
  padding: 5px;
}
p {
  margin: 0;
  padding-top: 5px;
  padding-bottom: 20px;
}

.theme-icon {
  cursor: pointer;
  background-color: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 5px;
  transition: all 0.1s ease;
}
.theme-icon:hover {
  top: -3px;
}
.theme-icon.preferred {
  border-color: var(--color-primary);
  top: -3px;
}
.selected {
  color: var(--color-primary);
}
</style>
