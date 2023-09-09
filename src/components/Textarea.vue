<template>
  <FormGroup
    class="Textarea"
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

    <textarea
      v-bind="attrsWithoutClass"
      ref="textareaElement"
      class="Textarea__textarea vuiii-input"
      :class="{
        'vuiii-input--invalid': $props.invalid,
        'vuiii-input--disabled': $props.disabled,
        [`vuiii-input--${$props.size}`]: $props.size
      }"
      :value="$props.modelValue"
      :required="$props.required"
      :disabled="$props.disabled"
      :readonly="$props.readonly"
      :rows="$props.rows"
      @input="$emit('update:model-value', ($event.target as HTMLInputElement).value)"
    />
  </FormGroup>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'

import type { InputSize } from '../types'
import { useAttrsWithoutClass } from '../utils/useAttrsWithoutClass'
import FormGroup, { type FormGroupProps, type FormGroupSlots } from './FormGroup.vue'

defineProps<
  FormGroupProps & {
    modelValue?: string
    size?: InputSize
    textareaClass?: any
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    rows?: number | string
  }
>()

defineEmits<{
  'update:model-value': [value: string]
}>()

defineSlots<FormGroupSlots>()

const textareaElement = shallowRef()

const attrsWithoutClass = useAttrsWithoutClass()

defineExpose({
  textareaElement,
  focus: () => textareaElement.value.focus(),
  select: () => textareaElement.value.select()
})
</script>
