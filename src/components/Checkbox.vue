<template>
  <label class="Checkbox" :class="{ 'Checkbox--disabled': $props.disabled }">
    <input
      :checked="$props.modelValue"
      class="Checkbox__input"
      :required="$props.required"
      :disabled="$props.disabled"
      type="checkbox"
      @input="$emit('update:modelValue', ($event.target as any).checked)"
    />

    <div v-if="$props.switch" class="Checkbox__switch">
      <div class="Checkbox__switchDot"></div>
    </div>

    <div v-else class="Checkbox__checkbox vuiii-input">
      <Icon name="check" class="Checkbox__checkboxIcon" />
    </div>

    <div v-if="$slots.default || $props.label" class="Checkbox__label">
      <span v-if="$props.required" class="Checkbox__required">*</span>

      <slot>
        {{ $props.label }}
      </slot>
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

import Icon from './Icon.vue'

defineProps<{
  modelValue?: boolean
  required?: boolean
  disabled?: boolean
  switch?: boolean
  label?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
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
  position: absolute;
  left: -99999px;
}

.Checkbox__checkbox {
  --vuiii-input-transition: all 0.1s;
  --vuiii-input-padding: 0;

  width: var(--vuiii-icon-size);
  aspect-ratio: 1 / 1;
  min-height: 0;

  & .Checkbox__checkboxIcon {
    scale: 50%;
    opacity: 0;
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
  padding: 3px;
  margin-top: -1px;
  width: 2.25rem;
  border-radius: 999px;
  transition: all 0.15s ease-out;
  background: var(--vuiii-input-borderColor, --vuiii-field-borderColor);
  border: 1px solid var(--vuiii-input-borderColor, --vuiii-field-borderColor);

  & .Checkbox__switchDot {
    width: 1.25rem;
    aspect-ratio: 1 / 1;
    background: var(--vuiii-color-white);
    border-radius: 999px;
    transition: all 0.15s ease-out;
  }

  @nest input:checked + & {
    background: var(--vuiii-color-primary);
    border-color: var(--vuiii-color-primary);

    & .Checkbox__switchDot {
      transform: translateX(1rem);
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
  margin-left: 0.5rem;
  align-self: center;
}

.Checkbox__required {
  line-height: 1;
  color: var(--vuiii-color-danger);
}
</style>
