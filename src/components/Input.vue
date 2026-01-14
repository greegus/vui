<template>
  <InputWrapper
    :prefix-icon="$props.prefixIcon"
    :suffix-icon="$props.suffixIcon"
    :size="$props.size"
    :invalid="$props.invalid"
    :pill="$props.pill"
    :class="$attrs.class"
    :disabled="$attrs.disabled"
    @click="input.focus()"
    @prefix-icon-click="$emit('prefix-icon-click')"
    @suffix-icon-click="$emit('suffix-icon-click')"
  >
    <template v-if="slots.prefix" #prefix>
      <slot name="prefix" />
    </template>

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
      :value="modelValue"
      @input="handleInput($event)"
    />

    <template v-if="slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
  </InputWrapper>
</template>

<script lang="ts">
export type InputRef = {
  input: HTMLInputElement
  focus: () => void
  select: () => void
}

export default {
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
import { ref, useAttrs, useSlots } from 'vue'

import InputWrapper, {
  type InputWrapperEmits,
  type InputWrapperProps,
  type InputWrapperSlots
} from '@/components/InputWrapper.vue'
import { useAttrsWithoutClass } from '@/composables/useAttrsWithoutClass'

type ModelValueType = string | number | Date | null | undefined

const modelValue = defineModel<ModelValueType>()

defineProps<InputWrapperProps & {
  inputClass?: any
}>()

defineEmits<InputWrapperEmits>()

defineSlots<InputWrapperSlots>()

const attrs = useAttrs()
const attrsWithoutClass = useAttrsWithoutClass()
const slots = useSlots()

const input = ref()

function retrieveTargetValue(e: Event): ModelValueType {
  const target = e.target as HTMLInputElement

  if (attrs.type === 'number') {
    return target.valueAsNumber
  }

  if (attrs.type === 'date') {
    return target.valueAsDate
  }

  return target.value
}

function handleInput(e: Event) {
  modelValue.value = retrieveTargetValue(e)
}

defineExpose({
  input,
  focus: () => input.value.focus(),
  select: () => input.value.select()
})
</script>

<style lang="postcss" scoped>
.Input__input {
  width: 100%;
  flex: auto;
  align-self: stretch;
}
</style>
