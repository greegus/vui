<template>
  <FormGroup
    class="CheckboxGroup"
    :class="$attrs.class"
    :label="$props.label"
    :required="$props.required"
    :invalid="$props.invalid"
    :error-message="$props.errorMessage"
    :description="$props.description"
    :hint="$props.hint"
  >
    <template v-if="$slots.description">
      <slot name="description" />
    </template>

    <template v-if="$slots.hint">
      <slot name="hint" />
    </template>

    <div class="CheckboxGroup__wrapper">
      <div v-for="option in normalizedOptions" :key="option.value">
        <Checkbox
          :model-value="checkedValues[option.value]"
          :disabled="$props.disabled || option.disabled"
          :readonly="$props.readonly"
          :label="option.label"
          :description="option.description"
          @update:model-value="toggleCheckedValue(option.value, $event)"
        />
      </div>
    </div>
  </FormGroup>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import Checkbox from '@/components/Checkbox.vue'
import FormGroup, { type FormGroupProps, type FormGroupSlots } from '@/components/FormGroup.vue'
import type { Extractor, Option } from '@/types'
import { normalizeOptions } from '@/utils/normalizeOptions'

type CheckedValues = Record<Option['value'], boolean>

const props = defineProps<
  FormGroupProps & {
    modelValue?: Option['value'][]
    options: any[] | Record<string, any>
    optionLabel?: Extractor
    optionValue?: Extractor
    optionDisabled?: Extractor
    optionDescription?: Extractor
    disabled?: boolean
    readonly?: boolean
  }
>()

const emit = defineEmits<{
  'update:model-value': [value: Option['value'][]]
}>()

defineSlots<FormGroupSlots>()

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
.CheckboxGroup__wrapper {
  & > * + * {
    margin-top: 0.75rem;
  }
}
</style>
