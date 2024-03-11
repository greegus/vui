<template>
  <div
    class="Select vuiii-input"
    :class="[
      $attrs.class,
      {
        [`vuiii-input--${$props.size}`]: $props.size,
        'Select--pill': $props.pill
      }
    ]"
  >
    <select
      v-bind="attrsWithoutClass"
      class="vuiii-input__nested Select__select"
      :class="inputClass"
      :value="$props.modelValue"
      :required="$props.required"
      @input="$emit('update:model-value', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="$props.placeholder" :disabled="$props.required" value="" selected>
        {{ $props.placeholder }}
      </option>

      <template v-if="groups">
        <optgroup v-for="(group, index) in groups" :key="index" :label="group.label">
          <option v-for="option in group.options" :key="option.value" :disabled="option.disabled" :value="option.value">
            {{ option.label }}
          </option>
        </optgroup>
      </template>

      <template v-else>
        <option v-for="option in options" :key="option.value" :disabled="option.disabled" :value="option.value">
          {{ option.label }}
        </option>
      </template>
    </select>

    <div class="Select__dropdownIcon vuiii-input__suffix-icon">
      <Icon name="triangle-down" :size="$props.size" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'

import type { Extractor, InputSize, Option } from '../types'
import { normalizeGroups, normalizeOptions } from '../utils/normalizeOptions'
import { useAttrsWithoutClass } from '../utils/useAttrsWithoutClass'
import Icon from './Icon.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: Option['value']
    options: any[] | any
    optionLabel?: Extractor
    optionValue?: Extractor
    optionDisabled?: Extractor
    groupLabel?: Extractor
    groupOptions?: Extractor
    placeholder?: string
    size?: InputSize
    required?: boolean
    inputClass?: any
    pill?: boolean
  }>(),
  {
    modelValue: undefined,
    size: 'normal',
    optionLabel: undefined,
    optionValue: undefined,
    optionDisabled: undefined,
    groupLabel: undefined,
    groupOptions: undefined,
    placeholder: undefined
  }
)

defineEmits<{
  'update:model-value': [value: Option['value']]
}>()

const groups = computed(() => {
  if (!props.groupOptions) {
    return
  }

  return normalizeGroups(props.options, {
    groupLabel: props.groupLabel,
    groupOptions: props.groupOptions,
    value: props.optionValue,
    label: props.optionLabel,
    disabled: props.optionDisabled
  })
})

const options = computed(() => {
  if (groups.value) {
    return
  }

  return normalizeOptions(props.options, {
    value: props.optionValue,
    label: props.optionLabel,
    disabled: props.optionDisabled
  })
})

const attrsWithoutClass = useAttrsWithoutClass()
</script>

<style lang="postcss" scoped>
.Select {
  position: relative;
  display: flex;
  align-items: stretch;
  padding-left: 0;
  padding-right: 0;
  line-height: 1;
}

.Select--pill {
  --borderRadius: 9999px;
}

.Select__select {
  width: 100%;
  appearance: none;
  text-overflow: ellipsis;
  align-self: stretch;
  padding-right: calc(var(--padding) + var(--vuiii-icon-size) + 0.5rem);

  /* XXX: deal with vertical cropping of the label */
  line-height: 1.5;

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
