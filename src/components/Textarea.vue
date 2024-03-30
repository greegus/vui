<template>
  <textarea
    v-bind="$attrs"
    ref="textareaElement"
    class="Textarea vuiii-input"
    :class="{
      'vuiii-input--invalid': $props.invalid,
      'vuiii-input--disabled': $props.disabled,
      [`vuiii-input--${$props.size}`]: $props.size
    }"
    :value="$props.modelValue"
    :disabled="$props.disabled"
    :readonly="$props.readonly"
    :invalid="$props.invalid"
    @input="handleInput($event)"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { InputSize } from '@/types'

const modelValue = defineModel<string>()

defineProps<{
  invalid?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: InputSize
}>()

const textareaElement = ref()

function handleInput(event: Event) {
  modelValue.value = (event.target as HTMLTextAreaElement).value
}

defineExpose({
  focus: () => textareaElement.value.focus(),
  select: () => textareaElement.value.select()
})
</script>
