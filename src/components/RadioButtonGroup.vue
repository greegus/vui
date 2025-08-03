<template>
  <ButtonGroup>
    <Button
      v-for="option in normalizedOptions"
      :key="option.value"
      variant="primary"
      :outlined="!option.isSelected"
      :label="option.label"
      :disabled="$props.disabled || option.disabled"
      :title="option.description"
      :prefix-icon="option.icon"
      :size="$props.size"
      @click="modelValue = option.value"
    />
  </ButtonGroup>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import Button from '@/components/Button.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import type { Extractor, InputSize, Option, ValueParser } from '@/types'
import { normalizeOptions } from '@/utils/normalizeOptions'

const modelValue = defineModel<any>()

const props = defineProps<{
  options: any[] | any
  optionLabel?: Extractor
  optionValue?: Extractor
  optionDisabled?: Extractor
  optionIcon?: Extractor
  optionDescription?: Extractor
  valueParser?: ValueParser<string>
  disabled?: boolean
  size?: InputSize
}>()

const normalizedOptions = computed<Option[]>(() =>
  normalizeOptions(
    props.options,
    {
      value: props.optionValue,
      label: props.optionLabel,
      disabled: props.optionDisabled,
      description: props.optionDescription,
      icon: props.optionIcon
    },
    modelValue.value
  )
)
</script>
