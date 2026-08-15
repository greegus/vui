<template>
  <ButtonGroup role="radiogroup">
    <Button
      v-for="option in normalizedOptions"
      :key="option.value"
      role="radio"
      :aria-checked="option.isSelected"
      :color="option.isSelected ? 'accent' : 'secondary'"
      :variant="option.isSelected ? variant : 'outlined'"
      :label="option.label"
      :disabled="$props.disabled || option.disabled"
      :title="option.description"
      :prefix-icon="option.icon"
      :size
      @click="handleInput(option.value)"
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
 *
 * @example
 * // Typed values - the model keeps the parsed type instead of a string
 * <RadioButtonGroup v-model="rating" :options="[1, 2, 3]" type="number" />
 *
 * @example
 * // With a custom value parser
 * <RadioButtonGroup
 *   v-model="startsOn"
 *   :options="dates"
 *   :value-parser="{ stringify: (d) => d.toISOString(), parse: (v) => new Date(v) }"
 * />
 */
import { computed } from 'vue'

import Button from '@/components/Button.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import type { Extractor, InputSize, Option, OptionsProp, ValueParser } from '@/types'
import { createTypeParser } from '@/utils/createTypeParser'
import { normalizeOptions } from '@/utils/normalizeOptions'

const modelValue = defineModel<any>()

const props = withDefaults(
  defineProps<{
    options: OptionsProp
    optionLabel?: Extractor
    optionValue?: Extractor
    optionDisabled?: Extractor
    optionIcon?: Extractor
    optionDescription?: Extractor
    valueParser?: ValueParser<string>
    /** Render variant of the active button. */
    variant?: 'filled' | 'outlined'
    disabled?: boolean
    size?: InputSize
    type?: 'string' | 'number' | 'boolean' | 'date'
  }>(),
  {
    variant: 'filled',
    type: 'string',
  },
)

const optionParser = computed(() => {
  return props.valueParser || createTypeParser(props.type)
})

const normalizedOptions = computed<Option[]>(() =>
  normalizeOptions(
    props.options,
    {
      value: props.optionValue,
      label: props.optionLabel,
      disabled: props.optionDisabled,
      description: props.optionDescription,
      icon: props.optionIcon,
      stringifyValue: optionParser.value?.stringify,
    },
    modelValue.value,
  ),
)

// Options are normalized into the stringified domain, so the picked value is parsed back before
// it reaches the model — matching Select, RadioGroup and CheckboxGroup.
function handleInput(value: Option['value']) {
  modelValue.value = optionParser.value.parse(String(value))
}
</script>

<style scoped>
/* Raise the active button so its (primary) border sits above the overlapping neighbours */
:deep(.Button[aria-checked='true']) {
  z-index: 1;
}
</style>
