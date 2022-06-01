<template>
  <component :is="{ ...component }" class="Icon" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { resolveGlobImport } from '../utils/resolveGlobImport'

type IconResolver = (name: string) => string | undefined | void

let customIconResolver: IconResolver

export function registerCustomIconResolver(resolver: IconResolver) {
  customIconResolver = resolver
}

function resolveIconComponent(name: string): string | undefined {
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

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      component: undefined as any
    }
  },

  watch: {
    name: {
      immediate: true,
      handler() {
        this.component = resolveIconComponent(this.name)
      }
    }
  }
})
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
