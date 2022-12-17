<template>
  <div class="RadioGroup">
    <label
      v-for="option in normalizedOptions"
      :key="option.value"
      class="RadioGroup__option"
      :class="{ 'RadioGroup__option--disabled': option.disabled }"
    >
      <input
        v-bind="$attrs"
        :value="option.value"
        class="RadioGroup__input"
        type="radio"
        :name="inputName"
        :disabled="option.disabled"
        @input="$emit('update:modelValue', option.value)"
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

import { Extractor, Option } from '../types'
import { generateId } from '../utils/generateId'
import { normalizeOptions } from '../utils/normalizeOptions'

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
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
}>()

const normalizedOptions = computed<Option[]>(() =>
  normalizeOptions(props.options, {
    value: props.optionValue,
    label: props.optionLabel,
    disabled: props.optionDisabled,
    description: props.optionDescription
  })
)
</script>

<style lang="postcss" scoped>
.RadioGroup {
  & > * + * {
    margin-top: 0.75rem;
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
    width: 0.65rem;
    aspect-ratio: 1 / 1;
    background: var(--vuiii-color-white);
    border-radius: 999px;
    scale: 50%;
    opacity: 0;
    transition: scale 0.15s ease-out, opacity 0.15s ease-out;
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