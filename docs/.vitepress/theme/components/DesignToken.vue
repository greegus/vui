<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const props = defineProps<{
  cssVar: string
  type?: 'color' | 'size' | 'shadow' | 'border-radius'
}>()

const computedValue = ref('')

onMounted(() => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(props.cssVar).trim()
  computedValue.value = value
})

const previewStyle = computed(() => {
  const cssValue = `var(${props.cssVar})`

  switch (props.type) {
    case 'color':
      return { backgroundColor: cssValue }
    case 'shadow':
      return { boxShadow: cssValue, backgroundColor: 'white' }
    case 'border-radius':
      return { borderRadius: cssValue, backgroundColor: 'var(--vp-c-brand-1)' }
    case 'size':
      return {
        width: cssValue,
        height: cssValue,
        backgroundColor: 'var(--vp-c-brand-1)',
        maxWidth: '40px',
        maxHeight: '40px',
      }
    default:
      return { backgroundColor: cssValue }
  }
})
</script>

<template>
  <div class="design-token">
    <div class="token-preview" :style="previewStyle" />
    <div class="token-info">
      <code class="token-name">{{ cssVar }}</code>
      <span class="token-value">{{ computedValue }}</span>
    </div>
  </div>
</template>
