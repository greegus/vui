<template>
  <div class="Radio">
    <label
      v-for="option in normalizedOptions"
      :key="option.value"
      class="Radio__option"
      :class="{ 'Radio--disabled': option.disabled }"
    >
      <input
        v-bind="normalizedAttrs"
        :checked="modelValue === option.value"
        class="Radio__input vuiii-input"
        :required="required"
        type="Radio"
        :name="inputName"
        :disabled="option.disabled"
      />

      <div class="Radio__label">
        <slot>
          {{ option.label }}
        </slot>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { Extractor, normalizeOptions, Option } from '../utils/normalizeOptions'
import { transformInputAttrs } from '../utils/transformInputAttrs'

let iterator = 1

export default defineComponent({
  mixins: [transformInputAttrs],

  inheritAttrs: false,

  props: {
    modelValue: {
      type: [String, Number] as PropType<Option['value']>,
      default: undefined
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

    required: Boolean
  },

  emits: ['update:modelValue'],

  data() {
    return {
      inputName: iterator++
    }
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

<style lang="postcss" scoped>
.Radio {
  & > * + * {
    margin-top: 0.5rem;
  }
}

.Radio__option {
  display: flex;
  align-items: flex-start;
  vertical-align: top;
  cursor: pointer;
}

.Radio__input {
  margin-top: 1px;
}

.Radio__label {
  margin-left: 0.5rem;
  line-height: 1.375;
}
</style>
