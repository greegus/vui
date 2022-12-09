<template>
  <div class="CheckboxGroup">
    <div v-for="option in normalizedOptions" :key="option.value">
      <Checkbox
        :disabled="option.disabled"
        :model-value="checkedValues[option.value]"
        :caption="option.label"
        @update:model-value="toggleCheckedValue(option.value)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { Extractor, Option } from '../types'
import { normalizeOptions } from '../utils/normalizeOptions'
import Checkbox from './Checkbox.vue'

type CheckedValues = Record<Option['value'], boolean>

export default defineComponent({
  components: {
    Checkbox
  },

  props: {
    modelValue: {
      type: Array as PropType<Option['value'][]>,
      default: () => []
    },

    options: {
      type: [Array, Object],
      required: true
    },

    optionLabelKey: {
      type: [Function, String, Number] as PropType<Extractor>,
      default: undefined
    },

    optionValueKey: {
      type: [Function, String, Number] as PropType<Extractor>,
      default: undefined
    },

    optionDisabledKey: {
      type: [Function, String, Number] as PropType<Extractor>,
      default: undefined
    }
  },

  emits: ['update:modelValue'],

  computed: {
    normalizedOptions(): Option[] {
      return normalizeOptions(this.options, {
        value: this.optionValueKey,
        label: this.optionLabelKey,
        disabled: this.optionDisabledKey
      })
    },

    checkedValues(): CheckedValues {
      return this.modelValue.reduce(
        (result, value) => ({
          ...result,
          [value]: true
        }),
        {}
      )
    }
  },

  methods: {
    toggleCheckedValue(value: Option['value']) {
      const checkedValues: CheckedValues = {
        ...this.checkedValues,
        [value]: !this.checkedValues[value]
      }

      const modelValue = Object.entries(checkedValues)
        .filter(([_, isChecked]) => isChecked)
        .map(([value]) => value)

      this.$emit('update:modelValue', modelValue)
    }
  }
})
</script>

<style lang="postcss" scoped>
.CheckboxGroup {
  & > * + * {
    margin-top: 0.5rem;
  }
}
</style>
