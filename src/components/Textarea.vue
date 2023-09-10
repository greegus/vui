<template>
  <textarea
    v-bind="attrsWithoutClass"
    ref="textarea"
    class="Textarea vuiii-input"
    :class="[
      $attrs.class,
      {
        'vuiii-input--invalid': $props.invalid,
        'vuiii-input--disabled': $attrs.disabled,
        [`vuiii-input--${$props.size}`]: $props.size
      }
    ]"
    :value="$props.modelValue"
    :required="$props.required"
    @input="$emit('update:model-value', ($event.target as HTMLInputElement).value)"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { InputSize } from '../types'
import { useAttrsWithoutClass } from '../utils/useAttrsWithoutClass'

defineProps<{
  modelValue?: string
  size?: InputSize
  invalid?: boolean
  required?: boolean
}>()

defineEmits<{
  'update:model-value': [value: string]
}>()

const attrsWithoutClass = useAttrsWithoutClass()

const textarea = ref()

defineExpose({
  focus: () => textarea.value.focus(),
  select: () => textarea.value.select()
})
</script>
