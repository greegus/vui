<template>
  <component :is="component" class="Icon" />
</template>

<script lang="ts" setup>
import { shallowRef, watch } from 'vue'

import { IconComponent, resolveIconComponent } from '../utils/iconsResolver'

const props = defineProps<{
  name: string
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
  width: 1.5rem;
  aspect-ratio: 1 / 1;
  flex: none;
}
</style>
