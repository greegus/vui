<template>
  <div
    class="InputWrapper vuiii-input"
    :class="[
      $attrs.class,
      {
        'vuiii-input--invalid': $props.invalid,
        'vuiii-input--disabled': $attrs.disabled,
        'InputWrapper--pill': $props.pill,
        [`vuiii-input--${$props.size}`]: $props.size,
      },
    ]"
    @click="$emit('click', $event)"
  >
    <slot v-if="slots.prefix || props.prefixIcon" name="prefix">
      <component
        :is="isPrefixIconClickable ? 'button' : 'div'"
        class="vuiii-input__prefix-icon"
        :class="{ 'InputWrapper__icon': isPrefixIconClickable }"
        :type="isPrefixIconClickable ? 'button' : undefined"
        :aria-label="isPrefixIconClickable ? $props.prefixIconLabel || $props.prefixIcon : undefined"
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
        :type="isSuffixIconClickable ? 'button' : undefined"
        :aria-label="isSuffixIconClickable ? $props.suffixIconLabel || $props.suffixIcon : undefined"
        @click.prevent="$emit('suffix-icon-click')"
      >
        <Icon v-if="$props.suffixIcon" :name="$props.suffixIcon || ''" :size="$props.size" />
      </component>
    </slot>
  </div>
</template>

<script lang="ts">
/**
 * Base wrapper component for input styling. Used internally by Input, Select, Autocomplete.
 * Provides consistent styling, icon slots, and size variants across all input components.
 *
 * @component InputWrapper
 *
 * @example
 * // Typically used internally, but can be used for custom inputs
 * import { InputWrapper } from 'vuiii'
 *
 * <InputWrapper size="normal" prefix-icon="user">
 *   <input class="vuiii-input__nested" v-model="value" />
 * </InputWrapper>
 *
 * @example
 * // With validation state
 * <InputWrapper :invalid="hasError" size="normal">
 *   <input class="vuiii-input__nested" v-model="value" />
 * </InputWrapper>
 *
 * @example
 * // With clickable icons
 * <InputWrapper
 *   suffix-icon="x-mark"
 *   @suffix-icon-click="clearValue"
 * >
 *   <input class="vuiii-input__nested" v-model="value" />
 * </InputWrapper>
 *
 * @slot default - The input element (should have class="vuiii-input__nested")
 * @slot prefix - Custom prefix content (replaces prefixIcon)
 * @slot suffix - Custom suffix content (replaces suffixIcon)
 *
 * @emits click - When wrapper is clicked
 * @emits prefix-icon-click - When prefix icon is clicked
 * @emits suffix-icon-click - When suffix icon is clicked
 */
import type { InputSize } from '@/types'

export type InputWrapperProps = {
  prefixIcon?: string
  suffixIcon?: string
  /** Accessible label for a clickable prefix icon (falls back to the icon name). */
  prefixIconLabel?: string
  /** Accessible label for a clickable suffix icon (falls back to the icon name). */
  suffixIconLabel?: string
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
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import '@/assets/css/input.css'
import { computed, getCurrentInstance, useAttrs, useSlots } from 'vue'

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
const instance = getCurrentInstance()

/**
 * Read off the raw vnode props rather than `useAttrs()`: because both events are declared in
 * `defineEmits`, Vue removes their listeners from `$attrs`, which would leave these flags
 * permanently false and the icons rendered as plain, unfocusable elements.
 */
const isPrefixIconClickable = computed<boolean>(() => Boolean(instance?.vnode.props?.onPrefixIconClick))
const isSuffixIconClickable = computed<boolean>(() => Boolean(instance?.vnode.props?.onSuffixIconClick))
</script>

<style scoped>
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
