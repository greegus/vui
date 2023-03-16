<template>
  <label
    class="Checkbox"
    :class="[
      $attrs.class,
      {
        [`Checkbox--size:${$props.size}`]: $props.size,
        'Checkbox--disabled': $props.disabled
      }
    ]"
  >
    <input
      :checked="$props.modelValue"
      class="Checkbox__input"
      :required="$props.required"
      :disabled="$props.disabled"
      type="checkbox"
      v-bind="attrsWithoutClass"
      @input="$emit('update:model-value', ($event.target as any).checked)"
    />

    <div v-if="$props.switch" class="Checkbox__switch">
      <div class="Checkbox__switchDot"></div>
    </div>

    <div v-else class="Checkbox__checkbox vuiii-input">
      <Icon name="check" class="Checkbox__checkboxIcon" :size="$props.size" />
    </div>

    <div>
      <div v-if="$slots.default || $props.label" class="Checkbox__label">
        <span v-if="$props.required" class="Checkbox__required">*</span>

        <slot>
          {{ $props.label }}
        </slot>
      </div>

      <div v-if="$props.description" class="Checkbox__description">
        {{ $props.description }}
      </div>
    </div>
  </label>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
import '../assets/css/input.css'

import type { InputSize } from '@/types'

import { useAttrsWithoutClass } from '../utils/useAttrsWithoutClass'
import Icon from './Icon.vue'

defineProps<{
  modelValue?: boolean
  required?: boolean
  disabled?: boolean
  switch?: boolean
  label?: string
  description?: string
  size?: InputSize
}>()

defineEmits<{
  (e: 'update:model-value', value: boolean): void
}>()

const attrsWithoutClass = useAttrsWithoutClass()
</script>

<style lang="postcss" scoped>
.Checkbox {
  display: inline-flex;
  align-items: center;
  vertical-align: top;
  cursor: pointer;
  gap: 0.65rem;

  --checkboxIconSize: var(--vuiii-icon-size);
  --checkbox-labelFontSize: inherit;

  &.Checkbox--size\:small {
    --checkboxIconSize: var(--vuiii-icon-size--small);
    --checkbox-labelFontSize: var(--vuiii-fontSize--small);
  }

  &.Checkbox--size\:large {
    --checkboxIconSize: var(--vuiii-icon-size--large);
    --checkbox-labelFontSize: var(--vuiii-fontSize--large);
  }
}

.Checkbox--disabled {
  opacity: 0.5;
  cursor: default;
}

.Checkbox__input {
  position: absolute;
  left: -99999px;
}

.Checkbox__checkbox {
  --vuiii-input-transition: all 0.1s;
  --vuiii-input-padding: 0;

  position: relative;
  align-self: flex-start;
  flex-shrink: 0;
  width: var(--checkboxIconSize);
  aspect-ratio: 1 / 1;
  min-height: 0;

  & .Checkbox__checkboxIcon {
    width: 100%;
    scale: 50%;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    transition: scale 0.15s ease-out, opacity 0.15s ease-out;
  }

  @nest input:checked + & {
    --vuiii-input-bgColor: var(--vuiii-color-primary);
    --vuiii-input-borderColor: var(--vuiii-color-primary);
    --vuiii-input-textColor: var(--vuiii-color-white);

    & .Checkbox__checkboxIcon {
      scale: 100%;
      opacity: 1;
    }
  }

  @nest input:focus:not(:checked) + & {
    --borderColor: var(
      --vuiii-input-borderColor--focus,
      var(--vuiii-field-borderColor--focus, var(--vuiii-input-borderColor, var(--vuiii-color-gray--dark)))
    );
  }
}

.Checkbox__switch {
  align-self: flex-start;
  flex-shrink: 0;
  padding: 2px 3px;
  margin-top: -1px;
  width: calc(var(--checkboxIconSize) * 1.4);
  border-radius: 999px;
  transition: all 0.15s ease-out;
  background: var(--vuiii-input-borderColor, --vuiii-field-borderColor);
  border: 1px solid var(--vuiii-input-borderColor, --vuiii-field-borderColor);

  & .Checkbox__switchDot {
    width: calc(var(--checkboxIconSize) * 0.8);
    aspect-ratio: 1 / 1;
    background: var(--vuiii-color-white);
    border-radius: 999px;
    transition: all 0.15s ease-out;
  }

  @nest input:checked + & {
    background: var(--vuiii-color-primary);
    border-color: var(--vuiii-color-primary);

    & .Checkbox__switchDot {
      transform: translateX(calc(var(--checkboxIconSize) * 0.65));
    }
  }

  @nest input:focus:not(:checked) + & {
    border-color: var(
      --vuiii-input-borderColor--focus,
      var(--vuiii-field-borderColor--focus, var(--vuiii-input-borderColor))
    );
  }
}

.Checkbox__label {
  line-height: 1.45;
  font-size: var(--checkbox-labelFontSize);
}

.Checkbox__required {
  line-height: 1;
  color: var(--vuiii-color-danger);
}

.Checkbox__description {
  margin-top: 0.1rem;
  opacity: 0.35;
  font-size: var(--vuiii-fontSize--small);
}
</style>
