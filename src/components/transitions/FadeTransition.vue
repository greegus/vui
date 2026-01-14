<script lang="ts" setup>
withDefaults(
  defineProps<{
    duration: number;
  }>(),
  {
    duration: 300,
  },
);
</script>

<template>
  <Transition name="fade">
    <slot />
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity v-bind(duration + "ms");
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
