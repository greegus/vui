<template>
  <div class="CheckboxGroup" :class="{ 'CheckboxGroup--inline': $props.inline }">
    <div v-for="option in normalizedOptions" :key="option.value">
      <Checkbox
        :disabled="option.disabled"
        :model-value="checkedValues.has(option.value)"
        :label="option.label"
        :description="option.description"
        @update:model-value="toggleCheckedValue(option.value, $event)"
      >
        <template v-if="$slots.symbol" #symbol="{ checked, disabled }">
          <slot name="symbol" v-bind="{ checked, disabled }" />
        </template>
      </Checkbox>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import Checkbox from '@/components/Checkbox.vue'
import type { Extractor, Option, ValueParser } from '@/types'
import { createTypeParser } from '@/utils/createTypeParser'
import { normalizeOptions } from '@/utils/normalizeOptions'

const modelValue = defineModel<any[]>()

const props = withDefaults(
  defineProps<{
    options: any[] | any
    optionLabel?: Extractor
    optionValue?: Extractor
    optionDisabled?: Extractor
    optionDescription?: Extractor
    valueParser?: ValueParser
    type?: 'string' | 'number' | 'boolean' | 'date'
    inline?: boolean
  }>(),
  {}
)

defineSlots<{
  default?: void
  symbol?: (props: { checked: boolean; disabled: boolean }) => any
}>()

const valueParser = computed(() => {
  return props.valueParser || createTypeParser(props.type)
})

const normalizedOptions = computed<Option[]>(() => {
  return normalizeOptions(props.options, {
    value: props.optionValue,
    label: props.optionLabel,
    disabled: props.optionDisabled,
    description: props.optionDescription,
    stringifyValue: valueParser.value.stringify
  })
})

const checkedValues = computed<Set<string | number>>(() => {
  return new Set(modelValue.value)
})

const toggleCheckedValue = (value: any, checked: boolean) => {
  const newCheckedValues = new Set(checkedValues.value.values())
  const parsedValue = valueParser.value.parse(value)

  checked ? newCheckedValues.add(parsedValue) : newCheckedValues.delete(parsedValue)

  modelValue.value = Array.from(newCheckedValues)
}
</script>

<style lang="postcss" scoped>
.CheckboxGroup {
  & > * + * {
    margin-top: 0.75rem;
  }

  &--inline {
    display: flex;
    flex-wrap: wrap;

    & > * {
      margin-top: 0rem;
      margin-left: 1.5rem;
    }
  }
}
</style>
