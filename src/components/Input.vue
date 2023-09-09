<template>
  <FormGroup
    class="Input"
    :class="$attrs.class"
    :label="$props.label"
    :required="$props.required"
    :invalid="$props.invalid"
    :error-message="$props.errorMessage"
    :description="$props.description"
    :hint="$props.hint"
  >
    <template v-if="$slots.description">
      <slot name="description" />
    </template>

    <template v-if="$slots.hint">
      <slot name="hint" />
    </template>

    <div
      class="Input__wrapper vuiii-input"
      :class="{
        'vuiii-input--invalid': $props.invalid,
        'vuiii-input--disabled': $props.disabled,
        [`vuiii-input--${$props.size}`]: $props.size
      }"
      @click="inputElement.focus()"
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
        ref="inputElement"
        :aria-label="($attrs.placeholder as string) || 'input'"
        v-bind="attrsWithoutClass"
        class="vuiii-input__nested Input__input"
        :class="{
          inputClass,
          'Input__input--withPrefixIcon': $props.prefixIcon,
          'Input__input--withSuffixIcon': $props.suffixIcon
        }"
        :type="($attrs.type as string) || 'text'"
        :value="$props.modelValue"
        :required="$props.required"
        :disabled="$props.disabled"
        :readonly="$props.readonly"
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
  </FormGroup>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
import '../assets/css/input.css'

import { computed, shallowRef, useAttrs, useSlots } from 'vue'

import type { InputSize } from '../types'
import { useAttrsWithoutClass } from '../utils/useAttrsWithoutClass'
import FormGroup, { type FormGroupProps, type FormGroupSlots } from './FormGroup.vue'
import Icon from './Icon.vue'

const props = defineProps<
  FormGroupProps & {
    modelValue?: number | string | Date | null
    prefixIcon?: string
    suffixIcon?: string
    size?: InputSize
    invalid?: boolean
    disabled?: boolean
    required?: boolean
    readonly?: boolean
    inputClass?: any
  }
>()

defineEmits<{
  'update:model-value': [value: number | string | Date | null]
  'prefix-icon-click': []
  'suffix-icon-click': []
}>()

defineSlots<
  FormGroupSlots & {
    prefix: void
    suffix: void
  }
>()

const attrs = useAttrs()
const slots = useSlots()
const inputElement = shallowRef()

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
  inputElement,
  focus: () => inputElement.value.focus(),
  select: () => inputElement.value.select()
})
</script>

<style lang="postcss">
.Input__wrapper.Input__wrapper {
  position: relative;
  display: flex;
  align-items: stretch;
  cursor: text;
  padding-left: 0;
  padding-right: 0;
  line-height: 1;
}

.Input__input.Input__input {
  width: 100%;
  flex: auto;
  align-self: stretch;
}

/*
.Input__input.Input__input--withPrefixIcon {
  padding-left: 0rem;
  margin-left: calc(var(--padding) / -2.5);
}

.Input__input.Input__input--withSuffixIcon {
  padding-right: 0rem;
  margin-right: calc(var(--padding) / -2.5);
}

.Input__prefix,
.Input__suffix {
  display: flex;
  width: calc(var(--padding) * 3);
  opacity: 0.5;
  outline: none;
  align-items: center;
  justify-content: center;
  flex: none;
}
*/

.Input__icon {
  cursor: pointer;

  &:hover {
    opacity: 0.75;
  }
}
</style>
