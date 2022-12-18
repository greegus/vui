<template>
  <div class="Select vuiii-input" :class="{ [`vuiii-input--${$props.size}`]: $props.size }">
    <select class="vuiii-input__nested Select__select" :value="$props.modelValue" :required="$props.required">
      <option v-if="$props.placeholder" :disabled="$props.required" value="" selected>
        {{ $props.placeholder }}
      </option>

      <option v-for="option in normalizedOptions" :key="option.value" :disabled="option.disabled" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <div class="Select__dropdownIcon vuiii-input__suffix-icon">
      <Icon name="triangle-down" :size="$props.size" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { Extractor, InputSize, Option } from '../types'
import { normalizeOptions } from '../utils/normalizeOptions'
import Icon from './Icon.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: Option['value']
    options: any[] | any
    optionLabel?: Extractor
    optionValue?: Extractor
    optionDisabled?: Extractor
    placeholder?: string
    size?: InputSize
    required?: boolean
  }>(),
  {
    modelValue: undefined,
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

<style lang="postcss">
.Select.Select {
  position: relative;
  display: flex;
  align-items: stretch;
  padding-left: 0;
  padding-right: 0;
  line-height: 1;
}

.Select__select.Select__select {
  width: 100%;
  appearance: none;
  text-overflow: ellipsis;
  align-self: stretch;
  padding-right: 0rem;

  /* XXX: targets only Firerefox to fix the vertical text alignment */
  @supports (-moz-appearance: none) {
    line-height: 3;
  }
}

.Select__dropdownIcon {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
}
</style>
