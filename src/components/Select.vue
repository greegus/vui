<template>
  <select
    class="Select vuiii-input"
    v-bind="normalizedAttrs"
    :class="[$attrs.class, { 'vuiii-input--small': size === 'small' }]"
    :value="modelValue"
  >
    <option v-if="placeholder" :disabled="!allowEmpty" selected value="">
      {{ placeholder }}
    </option>

    <option v-for="option in normalizedOptions" :key="option.value" :disabled="option.disabled" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script lang="ts">
import '../assets/css/input.css'

import { defineComponent, PropType } from 'vue'

import { Extractor, normalizeOptions, Option } from '../utils/normalizeOptions'
import { transformInputAttrs } from '../utils/transformInputAttrs'

const sizes = ['normal', 'small'] as const

type Size = typeof sizes[number]

export default defineComponent({
  mixins: [transformInputAttrs],

  props: {
    modelValue: {
      type: [String, Number, Object],
      default: ''
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
    },

    placeholder: {
      type: String,
      default: ''
    },

    size: {
      type: String as PropType<Size>,
      default: 'normal',
      validator: (value: Size) => sizes.includes(value)
    },

    allowEmpty: Boolean
  },

  computed: {
    normalizedOptions(): Option[] {
      return normalizeOptions(this.options, {
        value: this.optionValueKey,
        label: this.optionLabelKey,
        disabled: this.optionDisabledKey
      })
    }
  }
})
</script>
