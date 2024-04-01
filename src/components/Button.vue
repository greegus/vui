<template>
  <component
    :is="component"
    class="Button vuiii-button"
    :class="{
      [`vuiii-button--variant-${$props.variant}`]: $props.variant,
      [`vuiii-button--size-${$props.size}`]: $props.size,
      'vuiii-button--disabled': $props.disabled || $props.loading,
      'vuiii-button--loading': $props.loading,
      'vuiii-button--outlined': $props.outlined && $props.variant,
      'vuiii-button--block': $props.block,
      'vuiii-button--pill': $props.pill
    }"
    v-bind="$attrs"
    :type="component === 'button' ? $props.type : undefined"
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

import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import type { ButtonVariant, InputSize } from '../types'
import Icon from './Icon.vue'

export interface NativeButtonProps {
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export interface ButtonProps extends NativeButtonProps {
  size?: InputSize
  variant?: ButtonVariant
  prefixIcon?: string
  suffixIcon?: string
  label?: string
  block?: boolean
  loading?: boolean
  outlined?: boolean
  pill?: boolean
  to?: RouteLocationRaw
  href?: string
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button'
})

defineSlots<{
  prefix: void
  default: void
  suffix: void
}>()

const component = computed<string>(() => {
  if (props.to) {
    return 'router-link'
  }

  if (props.href) {
    return 'a'
  }

  return 'button'
})
</script>
