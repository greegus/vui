<template>
  <label class="Checkbox" :class="[$attrs.class, { 'Checkbox--disabled': $attrs.disabled }]">
    <input
      v-show="!$props.switch"
      v-bind="normalizedAttrs"
      :checked="modelValue"
      class="Checkbox__input input"
      :required="required"
      type="checkbox"
    />

    <div v-if="$props.switch" class="Checkbox__switch" :class="{ 'Checkbox__switch--active': modelValue }">
      <div class="Checkbox__switchDot"></div>
    </div>

    <div v-if="$slots.default || caption" class="Checkbox__label">
      <span v-if="required" class="Checkbox__required">*</span>

      <slot>
        {{ caption }}
      </slot>
    </div>
  </label>
</template>

<script lang="ts">
import '../assets/css/input.css'

import { defineComponent } from 'vue'

import { transformInputAttrs } from '../utils/transformInputAttrs'

export default defineComponent({
  mixins: [transformInputAttrs],

  inheritAttrs: false,

  props: {
    modelValue: Boolean,

    required: Boolean,

    switch: Boolean,

    caption: {
      type: String,
      default: ''
    }
  }
})
</script>

<style lang="postcss" scoped>
.Checkbox {
  display: inline-flex;
  align-items: flex-start;
  vertical-align: top;
  cursor: pointer;

  &--disabled {
    opacity: 0.5;
  }
}

.Checkbox__input {
  margin-top: 1px;
}

.Checkbox__switch {
  padding: 3px;
  margin-top: -1px;
  width: 2.25rem;
  border-radius: 999px;
  transition: all 0.15s ease-out;
  background: rgb(115, 115, 115) /* neutral.500 */;

  &--active {
    background: var(--vui-color-primary);
  }
}

.Checkbox__switchDot {
  width: 1.25rem;
  aspect-ratio: 1 / 1;
  background: white;
  border-radius: 999px;
  transition: all 0.15s ease-out;
}

.Checkbox__switch--active .Checkbox__switchDot {
  transform: translateX(0.75rem);
}

.Checkbox__label {
  margin-left: 0.5rem;
  line-height: 1.375;
}

.Checkbox__required {
  line-height: 1;
  color: var(--vui-color-danger);
}
</style>
