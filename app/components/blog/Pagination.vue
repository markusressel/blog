<template>
  <div class="grid gap-4 grid-cols-4">
    <div v-if="currentPage === 1" :class="disabledStyle">
      <span class="hidden sm:inline">First</span>
      <DoubleBack />
    </div>

    <NuxtLink
      v-else
      :to="{ name: 'blog', query: { page: 1 } }"
      :class="buttonStyles"
    >
      <DoubleBack />
      <span class="hidden sm:inline">First</span>
    </NuxtLink>

    <div v-if="currentPage === 1" :class="disabledStyle">
      <span class="hidden sm:inline">Prev</span>
      <SingleBack />
    </div>

    <NuxtLink
      v-else
      :to="{ name: 'blog', query: { page: prevPage } }"
      :class="buttonStyles"
    >
      <SingleBack />
      <span class="hidden sm:inline">Prev</span>
    </NuxtLink>

    <div v-if="currentPage === totalPages" :class="disabledStyle">
      <span class="hidden sm:inline">Next</span>
      <SingleFwd />
    </div>

    <NuxtLink
      v-else
      :to="{ name: 'blog', query: { page: nextPage } }"
      :class="buttonStyles"
    >
      <span class="hidden sm:inline">Next</span>
      <SingleFwd />
    </NuxtLink>

    <div v-if="currentPage === totalPages" :class="disabledStyle">
      <span class="hidden sm:inline">Last</span>
      <DoubleFwd />
    </div>

    <NuxtLink
      v-else
      :to="{ name: 'blog', query: { page: totalPages } }"
      :class="buttonStyles"
    >
      <span class="hidden sm:inline">Last</span>
      <DoubleFwd />
    </NuxtLink>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      type: Number,
      default: 0,
    },
    perPage: {
      type: Number,
      default: 5,
    },
  },
  computed: {
    buttonStyles() {
      return 'border rounded-full px-4 py-1 text-sm text-bold bg-white dark:bg-gray-800 flex justify-center items-center sm:uppercase hover:bg-blue-500 hover:text-white transform duration-500 ease-in-out'
    },
    disabledStyle() {
      return 'border rounded-full px-4 py-1 text-sm bg-white dark:bg-gray-800 flex justify-center items-center sm:uppercase text-gray-300 dark:text-gray-600'
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage)
    },
    currentPage() {
      return parseInt(this.$route.query.page) || 1
    },
    prevPage() {
      return this.currentPage > 1 ? this.currentPage - 1 : 1
    },
    nextPage() {
      return this.currentPage < this.totalPages
        ? this.currentPage + 1
        : this.totalPages
    },
  },
}
</script>
