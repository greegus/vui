<template>
  <ButtonGroup>
    <Button
      v-for="option in normalizedOptions"
      :key="option.value"
      variant="primary"
      :outlined="!option.isSelected"
      :label="option.label"
      :disabled="$props.disabled || option.disabled"
      @click="modelValue = option.value"
    />
  </ButtonGroup>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import Button from '@/components/Button.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import type { Extractor, Option, ValueParser } from '@/types'
import { normalizeOptions } from '@/utils/normalizeOptions'

const modelValue = defineModel<any>()

const props = defineProps<{
  options: any[] | any
  optionLabel?: Extractor
  optionValue?: Extractor
  optionDisabled?: Extractor
  optionIcon?: Extractor
  valueParser?: ValueParser<string>
  disabled?: boolean
}>()

const normalizedOptions = computed<Option[]>(() =>
  normalizeOptions(
    props.options,
    {
      value: props.optionValue,
      label: props.optionLabel,
      disabled: props.optionDisabled,
      icon: props.optionIcon
    },
    modelValue.value
  )
)
</script>
