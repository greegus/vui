<template>
  <textarea
    v-bind="$attrs"
    ref="textarea"
    class="Textarea vuiii-input"
    :class="{ [`vuiii-input--${$props.size}`]: $props.size }"
    :value="$props.modelValue"
    @input="$emit('update:model-value', ($event.target as HTMLInputElement).value)"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { InputSize } from '../types'

defineProps<{
  modelValue?: string
  size?: InputSize
}>()

defineEmits<{
  (e: 'update:model-value', value: string): void
}>()

const textarea = ref()

defineExpose({
  focus: () => textarea.value.focus(),
  select: () => textarea.value.select()
})
</script>
