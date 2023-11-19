<template>
  <div
    class="Input vuiii-input"
    :class="[
      $attrs.class,
      {
        'vuiii-input--invalid': $props.invalid,
        'vuiii-input--disabled': $attrs.disabled,
        'Input--pill': $props.pill,
        [`vuiii-input--${$props.size}`]: $props.size
      }
    ]"
    @click="input.focus()"
  >
    <slot v-if="slots.prefix || props.prefixIcon" name="prefix">
      <component
        :is="isPrefixIconClickable ? 'button' : 'div'"
        class="vuiii-input__prefix-icon"
        :class="{ 'Input__icon': isPrefixIconClickable }"
        tabindex="-1"
        @click.prevent="$emit('prefix-icon-click')"
      >
        <Icon v-if="$props.prefixIcon" :name="$props.prefixIcon || ''" :size="$props.size" />
      </component>
    </slot>

    <input
      ref="input"
      :aria-label="($attrs.placeholder as string) || 'input'"
      v-bind="attrsWithoutClass"
      class="vuiii-input__nested Input__input"
      :class="[
        inputClass,
        {
          'Input__input--withPrefixIcon': $props.prefixIcon,
          'Input__input--withSuffixIcon': $props.suffixIcon
        }
      ]"
      :type="($attrs.type as string) || 'text'"
      :value="$props.modelValue"
      @input="$emit('update:model-value', retrieveTargetValue($event))"
    />

    <slot v-if="slots.suffix || props.suffixIcon" name="suffix">
      <component
        :is="isSuffixIconClickable ? 'button' : 'div'"
        class="vuiii-input__suffix-icon"
        :class="{ 'Input__icon': isSuffixIconClickable }"
        tabindex="-1"
        @click.prevent="$emit('suffix-icon-click')"
      >
        <Icon v-if="$props.suffixIcon" :name="$props.suffixIcon || ''" :size="$props.size" />
      </component>
    </slot>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
import '../assets/css/input.css'

import { computed, ref, useAttrs, useSlots } from 'vue'

import type { InputSize } from '../types'
import { useAttrsWithoutClass } from '../utils/useAttrsWithoutClass'
import Icon from './Icon.vue'

const props = defineProps<{
  modelValue?: number | string | Date | null
  prefixIcon?: string
  suffixIcon?: string
  size?: InputSize
  invalid?: boolean
  inputClass?: any
  pill?: boolean
}>()

defineEmits<{
  'update:model-value': [value: number | string | Date | null]
  'prefix-icon-click': []
  'suffix-icon-click': []
}>()

defineSlots<{
  prefix: void
  suffix: void
}>()

const attrs = useAttrs()
const slots = useSlots()
const input = ref()

const isPrefixIconClickable = computed<boolean>(() => Boolean(attrs.onPrefixIconClick))
const isSuffixIconClickable = computed<boolean>(() => Boolean(attrs.onSuffixIconClick))

const retrieveTargetValue = (e: Event) => {
  const target = e.target as HTMLInputElement

  if (attrs.type === 'number') {
    return target.valueAsNumber
  }

  if (attrs.type === 'date') {
    return target.valueAsDate
  }

  return target.value
}

const attrsWithoutClass = useAttrsWithoutClass()

defineExpose({
  input,
  focus: () => input.value.focus(),
  select: () => input.value.select()
})
</script>

<style lang="postcss" scoped>
.Input {
  position: relative;
  display: flex;
  align-items: stretch;
  cursor: text;
  padding-left: 0;
  padding-right: 0;
  line-height: 1;
}

.Input--pill {
  --borderRadius: 9999px;
}

.Input__input {
  width: 100%;
  flex: auto;
  align-self: stretch;
}

.Input__icon {
  cursor: pointer;

  &:hover {
    opacity: 0.75;
  }
}
</style>
