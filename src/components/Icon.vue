<template>
  <component :is="component" class="Icon" />
</template>

<script lang="ts">
/* eslint-disable vue/prefer-import-from-vue */
import { shallowRef, watch } from 'vue'

import { resolveGlobImport } from '../utils/resolveGlobImport'

type IconComponent = any
type IconResolver = (name: string) => IconComponent

let customIconResolver: IconResolver

export function registerCustomIconResolver(resolver: IconResolver) {
  customIconResolver = resolver
}

function resolveIconComponent(name: string): IconComponent {
  let component

  if (customIconResolver) {
    component = customIconResolver(name)
  }

  if (!component) {
    component = resolveGlobImport(icons, `${name}.vue`)
  }

  return component
}

// @ts-ignore
const icons = import.meta.globEager('../icons/*.vue')
</script>

<script lang="ts" setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

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
