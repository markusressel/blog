<template>
  <!-- the whole card links to the repository -->
  <a
    :href="project.html_url"
    target="_blank"
    rel="noopener"
    class="project-card group flex flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
    style="color: inherit"
  >
    <!-- first image of the README, resized at build time -->
    <div v-if="project.preview" class="overflow-hidden">
      <img
        :src="project.preview"
        alt=""
        width="1280"
        height="640"
        loading="lazy"
        class="w-full aspect-[12/5] object-cover bg-gray-200 dark:bg-gray-900 transition-transform duration-300 group-hover:scale-105"
        :class="{ 'grayscale group-hover:grayscale-0': project.archived }"
      />
    </div>

    <div class="flex flex-col flex-1 gap-2 px-5 pt-4 pb-5">
      <h3
        class="text-xl font-semibold break-words text-gray-900 dark:text-gray-100 group-hover:text-blue-500 transition-colors"
      >
        {{ project.name }}
      </h3>
      <p
        v-if="project.description"
        class="text-gray-700 dark:text-gray-300 leading-relaxed"
      >
        {{ project.description }}
      </p>

      <ul
        class="mt-auto pt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-600 dark:text-gray-400"
      >
        <li v-if="project.language" class="flex items-center gap-1.5">
          <span
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: languageColor }"
            aria-hidden="true"
          />
          {{ project.language }}
        </li>
        <li
          v-if="
            project.license?.spdx_id &&
            project.license.spdx_id !== 'NOASSERTION'
          "
          class="flex items-center gap-1.5"
        >
          <IconLicense class="w-4 h-4" aria-hidden="true" />
          {{ project.license.spdx_id }}
        </li>
        <li
          class="flex items-center gap-1.5"
          :aria-label="`${project.stargazers_count} stars`"
        >
          <IconStar
            class="w-4 h-4 fill-current text-yellow-500"
            aria-hidden="true"
          />
          {{ project.stargazers_count }}
        </li>
        <li
          class="flex items-center gap-1.5"
          :aria-label="`${project.forks_count} forks`"
        >
          <IconFork class="w-4 h-4" aria-hidden="true" />
          {{ project.forks_count }}
        </li>
      </ul>
    </div>
  </a>
</template>

<script setup>
import IconFork from '~/assets/icons/icon-fork.svg?component'
import IconLicense from '~/assets/icons/icon-license.svg?component'
import IconStar from '~/assets/icons/icon-star.svg?component'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

// colors GitHub uses for these languages
const LANGUAGE_COLORS = {
  C: '#555555',
  'C#': '#178600',
  'C++': '#f34b7d',
  Dart: '#00b4ab',
  Go: '#00add8',
  HTML: '#e34c26',
  Java: '#b07219',
  JavaScript: '#f1e05a',
  Kotlin: '#a97bff',
  Python: '#3572a5',
  Shell: '#89e051',
  TypeScript: '#3178c6',
  Vue: '#41b883',
}

const languageColor = computed(
  () => LANGUAGE_COLORS[props.project.language] ?? '#9ca3af',
)
</script>
