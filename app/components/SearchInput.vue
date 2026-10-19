<template>
  <div ref="root">
    <div class="relative">
      <input
        ref="input"
        v-model="searchQuery"
        type="search"
        autocomplete="off"
        placeholder="Search Blog Posts"
        aria-label="Search blog posts"
        role="combobox"
        aria-autocomplete="list"
        aria-controls="search-results"
        :aria-expanded="showResults"
        :aria-activedescendant="
          activeIndex >= 0 ? `search-result-${activeIndex}` : undefined
        "
        class="rounded-full pl-4 pr-10 py-2 placeholder-gray-600 dark:placeholder-gray-300 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border-none shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 z-50 w-full"
        @focus="loadIndex"
        @keydown.down.prevent="move(1)"
        @keydown.up.prevent="move(-1)"
        @keydown.enter.prevent="openActive"
        @keydown.esc="close"
      />
      <kbd
        v-if="!searchQuery"
        class="hidden md:block absolute right-3 top-1/2 -translate-y-1/2 rounded border border-gray-300 dark:border-gray-500 px-1.5 text-xs text-gray-500 dark:text-gray-300 pointer-events-none"
        aria-hidden="true"
        >/</kbd
      >
    </div>

    <div
      v-if="showResults"
      class="absolute right-0 mt-3 max-h-[80vh] overflow-y-auto w-full md:w-2/3 mr-1"
    >
      <div
        class="rounded-xl bg-gray-100 dark:bg-gray-900 border-4 border-solid border-gray-400 dark:border-gray-700 z-50"
      >
        <ul
          v-if="results.length"
          id="search-results"
          role="listbox"
          aria-label="Search results"
        >
          <li
            v-for="(result, index) of results"
            :id="`search-result-${index}`"
            :key="result.slug"
            role="option"
            :aria-selected="index === activeIndex"
            :class="[
              'px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700',
              { 'bg-gray-300 dark:bg-gray-700': index === activeIndex },
            ]"
            @mouseenter="activeIndex = index"
          >
            <NuxtLink
              :to="result.to"
              style="text-decoration: none"
              tabindex="-1"
              @click="close"
            >
              <div class="font-bold">{{ result.title }}</div>
              <div v-if="result.section" class="text-sm text-blue-500">
                # {{ result.section }}
              </div>
              <div class="text-gray-800 dark:text-gray-200">
                {{ result.description }}
              </div>
            </NuxtLink>
          </li>
        </ul>
        <div v-else-if="searchIndex" class="px-4 py-2">Nothing found 😢</div>
        <div v-else class="px-4 py-2">Loading…</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MiniSearch from 'minisearch'

const MAX_RESULTS = 6

const root = ref(null)
const input = ref(null)
const searchQuery = ref('')
const activeIndex = ref(-1)
const searchIndex = shallowRef(null)
const articles = shallowRef(new Map())

const showResults = computed(() => searchQuery.value.trim().length > 0)

// The index is prerendered at build time (server/routes/search-index.json.ts)
// and only downloaded when the search is used for the first time.
let loading = null
const loadIndex = () => {
  loading ??= $fetch('/search-index.json').then((data) => {
    const search = new MiniSearch({
      fields: ['title', 'titles', 'content'],
      storeFields: ['slug', 'hash', 'title'],
      searchOptions: {
        boost: { title: 3, titles: 2 },
        prefix: true,
        fuzzy: 0.2,
        combineWith: 'AND',
      },
    })
    search.addAll(data.sections)
    articles.value = new Map(
      data.articles.map((article) => [article.slug, article]),
    )
    searchIndex.value = search
  })
  return loading
}

// one result per article, linking to its best matching section
const results = computed(() => {
  const query = searchQuery.value.trim()
  if (!searchIndex.value || !query) {
    return []
  }
  const seen = new Set()
  const list = []
  for (const hit of searchIndex.value.search(query)) {
    if (seen.has(hit.slug)) {
      continue
    }
    seen.add(hit.slug)
    const article = articles.value.get(hit.slug)
    if (!article) {
      continue
    }
    const isIntro = !hit.hash
    list.push({
      slug: hit.slug,
      title: article.title,
      description: article.description,
      section: isIntro ? null : hit.title,
      to: `/blog/post/${hit.slug}${isIntro ? '' : `#${hit.hash}`}`,
    })
    if (list.length === MAX_RESULTS) {
      break
    }
  }
  return list
})

watch(searchQuery, (query) => {
  activeIndex.value = -1
  if (query) {
    loadIndex()
  }
})

const move = (step) => {
  const count = results.value.length
  if (count) {
    activeIndex.value = (activeIndex.value + step + count) % count
  }
}

const openActive = () => {
  const result = results.value[Math.max(activeIndex.value, 0)]
  if (result) {
    close()
    navigateTo(result.to)
  }
}

const close = () => {
  searchQuery.value = ''
  input.value?.blur()
}

// Close the results when clicking anywhere else. Not done on blur, because the
// input also loses focus when the browser window does (e.g. switching tabs).
const onPointerDown = (event) => {
  if (root.value && !root.value.contains(event.target)) {
    searchQuery.value = ''
  }
}

// focus the search with "/" or Ctrl+K / Cmd+K
const onKeyDown = (event) => {
  const target = event.target
  const isTyping =
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA'].includes(target.tagName))
  const isShortcut =
    (event.key === '/' && !isTyping) ||
    (event.key === 'k' && (event.ctrlKey || event.metaKey))
  if (isShortcut) {
    event.preventDefault()
    input.value?.focus()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onKeyDown)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeyDown)
})
</script>
