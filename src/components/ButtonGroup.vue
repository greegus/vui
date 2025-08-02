<template>
  <div class="ButtonGroup">
    <slot />
  </div>
</template>

<style scoped>
.ButtonGroup {
  display: flex;
  align-items: center;

  & :deep(.Button:not(:first-child)) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &:deep(.Button:not(:last-child)) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    margin-right: calc(var(--vuiii-button-borderWidth, 1px) * -0.5);
  }
}
</style>
