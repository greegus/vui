<template>
  <ButtonGroup role="radiogroup">
    <Button
      v-for="option in normalizedOptions"
      :key="option.value"
      role="radio"
      :aria-checked="option.isSelected"
      :outlined="!option.isSelected"
      :label="option.label"
      :disabled="$props.disabled || option.disabled"
      :title="option.description"
      :prefix-icon="option.icon"
      :variant
      :size
      @click="modelValue = option.value"
    />
  </ButtonGroup>
</template>

<script lang="ts" setup>
/**
 * Button-styled radio group for single selection with visual button appearance.
 * Each option is rendered as a Button within a ButtonGroup.
 *
 * @see {@link module:normalizeOptions} for supported option formats and extractor props
 *
 * @component RadioButtonGroup
 *
 * @example
 * // Basic usage
 * <RadioButtonGroup v-model="view" :options="['List', 'Grid', 'Table']" />
 *
 * @example
 * // With object options
 * <RadioButtonGroup
 *   v-model="status"
 *   :options="[{ id: 'active', name: 'Active' }, { id: 'inactive', name: 'Inactive' }]"
 *   option-value="id"
 *   option-label="name"
 * />
 *
 * @example
 * // With icons
 * <RadioButtonGroup
 *   v-model="view"
 *   :options="[
 *     { value: 'list', label: 'List', icon: 'list' },
 *     { value: 'grid', label: 'Grid', icon: 'grid' }
 *   ]"
 *   option-value="value"
 *   option-label="label"
 *   option-icon="icon"
 * />
 */
import { computed } from 'vue'

import Button from '@/components/Button.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import type { ButtonVariant, Extractor, InputSize, Option } from '@/types'
import { normalizeOptions } from '@/utils/normalizeOptions'

const modelValue = defineModel<any>()

const props = defineProps<{
  options: any[] | Record<string, any>
  optionLabel?: Extractor
  optionValue?: Extractor
  optionDisabled?: Extractor
  optionIcon?: Extractor
  optionDescription?: Extractor
  variant?: ButtonVariant
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
      icon: props.optionIcon,
    },
    modelValue.value,
  ),
)
</script>
