<template>
  <select
    class="Select vuiii-input"
    :class="{ [`vuiii-input--${$props.size}`]: $props.size }"
    :value="$props.modelValue"
    @input="$emit('update:modelValue', ($event.target as any).value)"
  >
    <option v-if="$props.placeholder" :disabled="!$props.allowEmpty" selected :value="undefined">
      {{ $props.placeholder }}
    </option>

    <option v-for="option in normalizedOptions" :key="option.value" :disabled="option.disabled" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { Extractor, InputSize, Option } from '../types'
import { normalizeOptions } from '../utils/normalizeOptions'

const props = withDefaults(
  defineProps<{
    modelValue: Option['value']
    options: any[] | any
    optionLabel?: Extractor
    optionValue?: Extractor
    optionDisabled?: Extractor
    placeholder?: string
    size?: InputSize
    allowEmpty?: boolean
  }>(),
  {
    size: 'normal',
    optionLabel: undefined,
    optionValue: undefined,
    optionDisabled: undefined,
    placeholder: undefined
  }
)

defineEmits<{
  (e: 'update:modelValue', value: Option['value']): void
}>()

const normalizedOptions = computed<Option[]>(() =>
  normalizeOptions(props.options, {
    value: props.optionValue,
    label: props.optionLabel,
    disabled: props.optionDisabled
  })
)
</script>
