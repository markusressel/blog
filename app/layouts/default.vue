<template>
  <div
    class="min-h-screen flex flex-col transition-colors duration-200 ease-linear bg-gray-300 dark:bg-gray-900"
  >
    <PageHeader
      class="sticky top-0 z-20 bg-gray-200/90 dark:bg-gray-800/90 backdrop-blur transition-colors duration-200 px-2 shadow-lg"
    />
    <main class="flex-1 px-2 md:px-4 py-5">
      <slot />
    </main>
    <PageFooter />
  </div>
</template>
