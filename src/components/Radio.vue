<template>
  <div class="Radio">
    <label
      v-for="option in normalizedOptions"
      :key="option.value"
      class="Radio__option"
      :class="{ 'Radio--disabled': option.disabled }"
    >
      <input
        v-bind="$attrs"
        :value="option.value"
        :checked="$props.modelValue === option.value"
        class="Radio__input vuiii-input"
        type="radio"
        :name="inputName"
        :disabled="option.disabled"
        @input="$emit('update:modelValue', option.value)"
      />

      <div class="Radio__label">
        <slot>
          {{ option.label }}
        </slot>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'

import { Extractor, Option } from '../types'
import { generateId } from '../utils/generateId'
import { normalizeOptions } from '../utils/normalizeOptions'

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const inputName = 'Radio-input-' + generateId()

const props = defineProps<{
  modelValue: string | number | undefined
  options: any[] | any
  optionLabel?: Extractor
  optionValue?: Extractor
  optionDisabled?: Extractor
}>()

const normalizedOptions = computed<Option[]>(() =>
  normalizeOptions(props.options, {
    value: props.optionValue,
    label: props.optionLabel,
    disabled: props.optionDisabled
  })
)
</script>

<style lang="postcss" scoped>
.Radio {
  & > * + * {
    margin-top: 0.5rem;
  }
}

.Radio__option {
  display: flex;
  align-items: flex-start;
  vertical-align: top;
  cursor: pointer;
}

.Radio__input {
  margin-top: 1px;
}

.Radio__label {
  margin-left: 0.5rem;
  line-height: 1.375;
}
</style>
