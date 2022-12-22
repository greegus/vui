<template>
  <textarea
    v-bind="$attrs"
    class="Textarea vuiii-input"
    :class="{ [`vuiii-input--${$props.size}`]: $props.size }"
    :value="$props.modelValue"
    @input="$emit('update:model-value', ($event.target as HTMLInputElement).value)"
  />
</template>

<script lang="ts" setup>
import { InputSize } from '../types'

defineProps<{
  modelValue?: string
  size?: InputSize
}>()

defineEmits<{
  (e: 'update:model-value', value: string): void
}>()
</script>
