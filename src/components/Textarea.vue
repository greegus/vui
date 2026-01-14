<template>
  <InputWrapper
    class="Textarea"
    :class="$attrs.class"
    :size="$props.size"
    :invalid="$props.invalid"
    :disabled="$props.disabled"
    :prefix-icon="$props.prefixIcon"
    @click="textareaElement.focus()"
    @prefix-icon-click="$emit('prefix-icon-click')"
  >
    <template v-if="slots.prefix" #prefix>
      <slot name="prefix" />
    </template>

    <textarea
      v-bind="attrsWithoutClass"
      ref="textareaElement"
      class="vuiii-input__nested Textarea__textarea"
      :value="$props.modelValue"
      :disabled="$props.disabled"
      :readonly="$props.readonly"
      @input="handleInput($event)"
    />
  </InputWrapper>
</template>

<script lang="ts">
export type TextareaRef = {
  focus: () => void
  select: () => void
}

export default {
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
import '@/assets/css/input.css'

import { ref, useSlots } from 'vue'

import InputWrapper, {
  type InputWrapperEmits,
  type InputWrapperProps,
  type InputWrapperSlots
} from '@/components/InputWrapper.vue'
import { useAttrsWithoutClass } from '@/composables/useAttrsWithoutClass'

const modelValue = defineModel<string>()

defineProps<
  Omit<InputWrapperProps, 'suffixIcon'> & {
    disabled?: boolean
    readonly?: boolean
  }
>()

defineEmits<Omit<InputWrapperEmits, 'suffix-icon-click'>>()

defineSlots<Omit<InputWrapperSlots, 'suffix'>>()

const attrsWithoutClass = useAttrsWithoutClass()
const slots = useSlots()

const textareaElement = ref()

function handleInput(event: Event) {
  modelValue.value = (event.target as HTMLTextAreaElement).value
}

defineExpose({
  focus: () => textareaElement.value.focus(),
  select: () => textareaElement.value.select()
})
</script>

<style scoped>
.Textarea {
  align-items: flex-start;

  &:deep(.vuiii-input__prefix-icon) {
    margin-top: 0.65em;
  }

  .vuiii-input__nested {
    width: 100%;
    flex: auto;
    align-self: stretch;
    resize: vertical;
  }
}
</style>
