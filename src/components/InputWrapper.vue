<template>
  <div
    class="InputWrapper vuiii-input"
    :class="[
      $attrs.class,
      {
        'vuiii-input--invalid': $props.invalid,
        'vuiii-input--disabled': $attrs.disabled,
        'InputWrapper--pill': $props.pill,
        [`vuiii-input--${$props.size}`]: $props.size
      }
    ]"
    @click="$emit('click', $event)"
  >
    <slot v-if="slots.prefix || props.prefixIcon" name="prefix">
      <component
        :is="isPrefixIconClickable ? 'button' : 'div'"
        class="vuiii-input__prefix-icon"
        :class="{ 'InputWrapper__icon': isPrefixIconClickable }"
        tabindex="-1"
        @click.prevent="$emit('prefix-icon-click')"
      >
        <Icon v-if="$props.prefixIcon" :name="$props.prefixIcon || ''" :size="$props.size" />
      </component>
    </slot>

    <slot />

    <slot v-if="slots.suffix || props.suffixIcon" name="suffix">
      <component
        :is="isSuffixIconClickable ? 'button' : 'div'"
        class="vuiii-input__suffix-icon"
        :class="{ 'InputWrapper__icon': isSuffixIconClickable }"
        tabindex="-1"
        @click.prevent="$emit('suffix-icon-click')"
      >
        <Icon v-if="$props.suffixIcon" :name="$props.suffixIcon || ''" :size="$props.size" />
      </component>
    </slot>
  </div>
</template>

<script lang="ts">
import type { InputSize } from '@/types'

export type InputWrapperProps = {
  prefixIcon?: string
  suffixIcon?: string
  size?: InputSize
  invalid?: boolean
  pill?: boolean
}

export type InputWrapperEmits = {
  'prefix-icon-click': []
  'suffix-icon-click': []
}

export type InputWrapperSlots = {
  default: void
  prefix?: void
  suffix?: void
}

export default {
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
import '@/assets/css/input.css'

import { computed, useAttrs, useSlots } from 'vue'

import Icon from '@/components/Icon.vue'

const props = defineProps<InputWrapperProps>()

defineEmits<{
  'click': [event: MouseEvent]
  'prefix-icon-click': []
  'suffix-icon-click': []
}>()

defineSlots<{
  default: void
  prefix?: void
  suffix?: void
}>()

const attrs = useAttrs()
const slots = useSlots()

const isPrefixIconClickable = computed<boolean>(() => Boolean(attrs.onPrefixIconClick))
const isSuffixIconClickable = computed<boolean>(() => Boolean(attrs.onSuffixIconClick))
</script>

<style lang="postcss" scoped>
.InputWrapper {
  position: relative;
  display: flex;
  align-items: stretch;
  cursor: text;
  padding-left: 0;
  padding-right: 0;
  line-height: 1;
}

.InputWrapper--pill {
  --borderRadius: 9999px;
}

.InputWrapper__icon {
  cursor: pointer;

  &:hover {
    opacity: 0.75;
  }
}
</style>
