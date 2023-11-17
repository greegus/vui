<template>
  <component :is="component" class="Icon" :class="{ [`Icon--${$props.size}`]: $props.size }" />
</template>

<script lang="ts" setup>
import { shallowRef, watch } from 'vue'

import type { IconSize } from '../types'
import { type IconComponent, resolveIconComponent } from '../utils/iconsResolver'

const props = defineProps<{
  name: string
  size?: IconSize
}>()

const component = shallowRef<IconComponent>(undefined)

watch(
  () => props.name,
  () => (component.value = resolveIconComponent(props.name)),
  { immediate: true }
)
</script>

<style lang="postcss" scoped>
.Icon {
  display: inline-block;
  vertical-align: middle;
  width: var(--vuiii-icon-size);
  aspect-ratio: 1 / 1;
  flex: none;
}

.Icon--small {
  width: var(--vuiii-icon-size--small);
}

.Icon--large {
  width: var(--vuiii-icon-size--large);
}
</style>
