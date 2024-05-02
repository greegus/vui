<template>
  <!-- name: spinner -->
  <svg fill="none" stroke="currentColor" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.5 12.5c0 6.1-4.9 11-11 11s-11-4.9-11-11 4.9-11 11-11"
      shape-rendering="geometricPrecision"
      style="stroke-width: 2; stroke-miterlimit: 10; stroke: currentColor; fill: none"
      vector-effect="non-scaling-stroke"
      class="IconSpinner"
    />
  </svg>
</template>

<style lang="postcss" scoped>
.IconSpinner {
  will-change: transform;
  animation: animation 0.7s infinite linear;
  transform-origin: center;
}

@keyframes animation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
