<template>
  <div class="CheckboxGroup">
    <div v-for="option in normalizedOptions" :key="option.value">
      <Checkbox
        :disabled="option.disabled"
        :model-value="checkedValues[option.value]"
        :label="option.label"
        :description="option.description"
        @update:model-value="toggleCheckedValue(option.value, $event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import Checkbox from '@/components/Checkbox.vue'
import type { Extractor, Option } from '@/types'
import { normalizeOptions } from '@/utils/normalizeOptions'

type CheckedValues = Record<Option['value'], boolean>

const props = defineProps<{
  modelValue?: Option['value'][]
  options: any[] | Record<string, any>
  optionLabel?: Extractor
  optionValue?: Extractor
  optionDisabled?: Extractor
  optionDescription?: Extractor
}>()

const emit = defineEmits<{
  'update:model-value': [value: Option['value'][]]
}>()

const normalizedOptions = computed<Option[]>(() => {
  return normalizeOptions(props.options, {
    value: props.optionValue,
    label: props.optionLabel,
    disabled: props.optionDisabled,
    description: props.optionDescription
  })
})

const checkedValues = computed<Record<string, boolean>>(() => {
  return (props.modelValue || []).reduce(
    (result, value) => ({
      ...result,
      [value]: true
    }),
    {}
  )
})

const toggleCheckedValue = (key: Option['value'], value: boolean) => {
  const updatedCheckedValues: CheckedValues = {
    ...checkedValues.value,
    [key]: value
  }

  const modelValue = Object.entries(updatedCheckedValues)
    .filter(([_, isChecked]) => isChecked)
    .map(([value]) => value)

  emit('update:model-value', modelValue)
}
</script>

<style lang="postcss" scoped>
.CheckboxGroup {
  & > * + * {
    margin-top: 0.75rem;
  }
}
</style>
