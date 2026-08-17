<script setup lang="ts">
/**
 * Stand-in for vue-router's RouterLink.
 *
 * VitePress ships its own router and does not register vue-router, so the router-aware components
 * (Button with `to`, Breadcrumbs, Table columns with `href`) would otherwise render an unresolved
 * `<router-link>` element — no anchor, no styling, silently inert in production builds.
 *
 * This renders a real anchor so the demos look and read correctly, but swallows the click: the
 * routes in the examples belong to an imaginary app, not to this site.
 */
import { computed } from 'vue'

const props = defineProps<{
  to?: string | Record<string, any>
  target?: string
}>()

const href = computed(() => (typeof props.to === 'string' ? props.to : '#'))
</script>

<template>
  <a :href="href" :target="target" @click.prevent>
    <slot />
  </a>
</template>
