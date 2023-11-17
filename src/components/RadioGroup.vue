<template>
  <div class="RadioGroup" :class="[$attrs.class, { 'RadioGroup--inline': inline }]">
    <label
      v-for="option in normalizedOptions"
      :key="option.value"
      class="RadioGroup__option"
      :class="{ 'RadioGroup__option--disabled': $props.disabled || option.disabled }"
    >
      <input
        v-bind="attrsWithoutClass"
        :value="option.value"
        class="RadioGroup__input"
        type="radio"
        :name="inputName"
        :disabled="$props.disabled || option.disabled"
        :readonly="$props.readonly"
        :checked="option.value === props.modelValue"
        @input="$emit('update:model-value', option.value)"
      />

      <div class="RadioGroup__radio vuiii-input">
        <div class="RadioGroup__radioDot"></div>
      </div>

      <div>
        <slot v-bind="{ option }">
          <div class="RadioGroup__label">
            {{ option.label }}
          </div>
        </slot>

        <div v-if="option.description" class="RadioGroup__description">
          {{ option.description }}
        </div>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
import { computed, useAttrs } from 'vue'

import type { Extractor, Option } from '../types'
import { generateId } from '../utils/generateId'
import { normalizeOptions } from '../utils/normalizeOptions'
import { useAttrsWithoutClass } from '../utils/useAttrsWithoutClass'

defineEmits<{
  'update:model-value': [value: string | number]
}>()

defineSlots<{
  default: { option: Option }
}>()

const attrs = useAttrs()

const inputName = (attrs.name as string) || 'RadioGroup-input-' + generateId()

const props = defineProps<{
  modelValue?: string | number | undefined
  options: any[] | any
  optionLabel?: Extractor
  optionValue?: Extractor
  optionDisabled?: Extractor
  optionDescription?: Extractor
  disabled?: boolean
  readonly?: boolean
  inline?: boolean
}>()

const normalizedOptions = computed<Option[]>(() =>
  normalizeOptions(props.options, {
    value: props.optionValue,
    label: props.optionLabel,
    disabled: props.optionDisabled,
    description: props.optionDescription
  })
)

const attrsWithoutClass = useAttrsWithoutClass()
</script>

<style lang="postcss" scoped>
.RadioGroup {
  & > * + * {
    margin-top: 0.75rem;
  }
}

.RadioGroup--inline {
  display: flex;

  & > * + * {
    margin-top: 0rem;
    margin-left: 1.5rem;
  }
}

.RadioGroup__option {
  display: flex;
  align-items: flex-start;
  vertical-align: top;
  cursor: pointer;
  gap: 0.65rem;
}

.RadioGroup__option--disabled {
  opacity: 0.5;
  cursor: default;
}

.RadioGroup__input {
  position: absolute;
  left: -99999px;
}

.RadioGroup__radio {
  --vuiii-input-transition: all 0.1s;
  --vuiii-input-padding: 0;

  width: var(--vuiii-icon-size);
  aspect-ratio: 1 / 1;
  border-radius: 999px;
  min-height: 0;
  display: flex;

  & .RadioGroup__radioDot {
    margin: auto;
    width: 60%;
    aspect-ratio: 1 / 1;
    background: var(--vuiii-color-white);
    border-radius: 999px;
    scale: 50%;
    opacity: 0;
    transition:
      scale 0.15s ease-out,
      opacity 0.15s ease-out;
  }

  @nest input:checked + & {
    --vuiii-input-bgColor: var(--vuiii-color-primary);
    --vuiii-input-borderColor: var(--vuiii-color-primary);
    --vuiii-input-textColor: var(--vuiii-color-white);

    & .RadioGroup__radioDot {
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

.RadioGroup__label {
  line-height: 1.45;
}

.RadioGroup__description {
  margin-top: 0.1rem;
  opacity: 0.35;
  font-size: var(--vuiii-fontSize--small);
}
</style>
