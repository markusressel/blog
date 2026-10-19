<template>
  <NuxtImg
    class="w-12 h-12 rounded-lg"
    width="48"
    height="48"
    densities="x1 x2"
    format="webp"
    alt=""
    src="/images/avatar.jpg"
  />
</template>

<style>
.NuxtLogo {
  animation: 1s appear;
  margin: auto;
}

@keyframes appear {
  0% {
    opacity: 0;
  }
}
</style>
