<template>
  <component
    :is="resolvedTag"
    class="Typograpgy"
    :class="{
      'vuiii-typography-display': variant === 'display',
      'vuiii-typography-heading1': variant === 'heading1',
      'vuiii-typography-heading2': variant === 'heading2',
      'vuiii-typography-heading3': variant === 'heading3',
      'vuiii-typography-heading4': variant === 'heading4',
      'vuiii-typography-heading5': variant === 'heading5',
      'vuiii-typography-heading6': variant === 'heading6',
      'vuiii-typography-body1': variant === 'body1',
      'vuiii-typography-body2': variant === 'body2',
      'vuiii-typography-caption': variant === 'caption',
      'vuiii-typography-label': variant === 'label'
    }"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const { variant = 'body1', tag } = defineProps<{
  variant?:
    | 'display'
    | 'heading1'
    | 'heading2'
    | 'heading3'
    | 'heading4'
    | 'heading5'
    | 'heading6'
    | 'body1'
    | 'body2'
    | 'label'
    | 'caption'
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'caption'
}>()

const resolvedTag = computed(() => {
  const variantToTagMap = {
    display: 'h1',
    heading1: 'h1',
    heading2: 'h2',
    heading3: 'h3',
    heading4: 'h4',
    heading5: 'h5',
    heading6: 'h6',
    body1: 'p',
    body2: 'p',
    label: 'span',
    caption: 'span'
  }

  return tag || (variant && variantToTagMap[variant]) || 'p'
})
</script>
