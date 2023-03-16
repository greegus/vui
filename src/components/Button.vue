<template>
  <component
    :is="component"
    class="Button vuiii-button"
    :class="{
      [`vuiii-button--${$props.variant}`]: $props.variant,
      [`vuiii-button--${$props.size}`]: $props.size,
      'vuiii-button--disabled': $props.loading || $attrs.disabled,
      'vuiii-button--loading': $props.loading,
      'vuiii-button--active': $props.active,
      'vuiii-button--block': $props.block
    }"
    v-bind="$attrs"
    :type="$attrs.type || (component === 'button' ? 'button' : undefined)"
  >
    <slot name="prefix">
      <Icon
        v-if="$props.prefixIcon || $props.loading"
        class="vuiii-button__icon vuiii-button__icon--prefix"
        :name="$props.loading ? 'spinner' : $props.prefixIcon!"
        :size="$props.size"
      />
    </slot>

    <span v-if="$slots.default || $props.label">
      <slot>{{ $props.label }}</slot>
    </span>

    <slot name="suffix">
      <Icon
        v-if="$props.suffixIcon"
        class="vuiii-button__icon vuiii-button__icon--suffix"
        :name="$props.suffixIcon"
        :size="$props.size"
      />
    </slot>
  </component>
</template>

<script lang="ts" setup>
import '../assets/css/button.css'

import { computed, useAttrs } from 'vue'

import type { ButtonVariant, InputSize } from '../types'
import Icon from './Icon.vue'

defineProps<{
  size?: InputSize
  variant?: ButtonVariant
  prefixIcon?: string
  suffixIcon?: string
  label?: string
  block?: boolean
  loading?: boolean
  active?: boolean
}>()

const attrs = useAttrs()

const component = computed<string>(() => {
  if (attrs.to) {
    return 'router-link'
  }

  if (attrs.href) {
    return 'a'
  }

  return 'button'
})
</script>
