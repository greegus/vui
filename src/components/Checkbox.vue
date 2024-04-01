<template>
  <label
    class="Checkbox"
    :class="[
      $attrs.class,
      {
        [`Checkbox--size-${$props.size}`]: $props.size,
        'Checkbox--disabled': $props.disabled
      }
    ]"
  >
    <input
      :checked="serializedModelValue"
      class="Checkbox__input"
      :required="$props.required"
      :disabled="$props.disabled"
      type="checkbox"
      v-bind="attrsWithoutClass"
      @input="handleInput($event)"
    />

    <div v-if="$props.switch" class="Checkbox__switch">
      <div class="Checkbox__switchDot"></div>
    </div>

    <div v-else class="Checkbox__checkbox vuiii-input">
      <Icon name="check" class="Checkbox__checkboxIcon" :size="$props.size" />
    </div>

    <div v-if="$slots.default || $props.label || $props.description">
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
import '@/assets/css/input.css'

import { computed } from 'vue'

import Icon from '@/components/Icon.vue'
import { useAttrsWithoutClass } from '@/composables/useAttrsWithoutClass'
import type { InputSize, ValueParser } from '@/types'

const modelValue = defineModel()

const attrsWithoutClass = useAttrsWithoutClass()

const props = defineProps<{
  required?: boolean
  disabled?: boolean
  switch?: boolean
  label?: string
  description?: string
  size?: InputSize
  valueParser?: ValueParser<boolean>
}>()

defineSlots<{
  default: void
}>()

const valueParser = computed<ValueParser<boolean>>(() => {
  return (
    props.valueParser || {
      parse: Boolean,
      stringify: Boolean
    }
  )
})

const serializedModelValue = computed(() => {
  return valueParser.value.stringify(modelValue.value)
})

function handleInput(event: Event) {
  modelValue.value = valueParser.value.parse((event.target as HTMLInputElement).checked)
}
</script>

<style lang="postcss" scoped>
.Checkbox {
  --checkbox-iconSize: var(--vuiii-icon-size);
  --checkbox-labelFontSize: var(--vuiii-fontSize);

  display: inline-flex;
  align-items: center;
  vertical-align: top;
  cursor: pointer;
  gap: 0.65rem;

  &.Checkbox--size-small {
    --checkbox-iconSize: var(--vuiii-icon-size--small);
    --checkbox-labelFontSize: var(--vuiii-fontSize--small);
  }

  &.Checkbox--size-large {
    --checkbox-iconSize: var(--vuiii-icon-size--large);
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
  --vuiii-input-textColor: var(--vuiii-checkbox-iconColor--checked);

  border-radius: min(0.25rem, var(--vuiii-input-borderRadius, 0));
  position: relative;
  align-self: flex-start;
  flex-shrink: 0;
  width: var(--checkbox-iconSize);
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
    transition:
      scale 0.15s ease-out,
      opacity 0.15s ease-out;
  }

  input:checked + & {
    --vuiii-input-bgColor: var(--vuiii-checkbox-bgColor--checked);
    --vuiii-input-borderColor: var(--vuiii-checkbox-borderColor--checked);

    & .Checkbox__checkboxIcon {
      scale: 100%;
      opacity: 1;
    }
  }

  input:focus-visible:not(:checked) + & {
    --borderColor: var(--vuiii-input-borderColor--focus);
  }
}

.Checkbox__switch {
  --ratio: 1.6;

  align-self: flex-start;
  flex-shrink: 0;
  padding: 1px;
  width: calc(var(--checkbox-iconSize) * var(--ratio));
  border-radius: 999px;
  transition: all 0.15s ease-out;
  background: var(--vuiii-input-borderColor, --vuiii-field-borderColor);
  border: 1px solid var(--vuiii-input-borderColor, --vuiii-field-borderColor);

  & .Checkbox__switchDot {
    width: calc(var(--checkbox-iconSize) - 4px);
    aspect-ratio: 1;
    background: var(--vuiii-color-white);
    border-radius: 999px;
    transition: all 0.15s ease-out;
  }

  input:checked + & {
    background: var(--vuiii-checkbox-bgColor--checked);
    border-color: var(--vuiii-checkbox-borderColor--checked);

    & .Checkbox__switchDot {
      transform: translateX(calc(var(--checkbox-iconSize) * var(--ratio) - var(--checkbox-iconSize) + 4px));
    }
  }

  input:focus-visible:not(:checked) + & {
    border-color: var(--vuiii-input-borderColor--focus);
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
