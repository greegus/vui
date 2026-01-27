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
        :checked="option.isSelected"
        @input="handleInput(option.value)"
      />

      <slot name="symbol" v-bind="{ disabled: !!disabled, checked: !!option.isSelected }">
        <div class="RadioGroup__radio vuiii-input">
          <div class="RadioGroup__radioDot"></div>
        </div>
      </slot>

      <div v-if="option.label || option.description || $slots.default">
        <slot v-bind="{ option }">
          <div class="RadioGroup__label">{{ option.label }}</div>
        </slot>

        <div v-if="option.description" class="RadioGroup__description">
          {{ option.description }}
        </div>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
/**
 * Radio button group for single selection from a list of options.
 * Normalizes various option formats and supports custom value parsing.
 *
 * @see {@link module:normalizeOptions} for supported option formats and extractor props
 *
 * @component RadioGroup
 *
 * @example
 * // Basic usage with string array
 * import { RadioGroup } from 'vuiii'
 *
 * <RadioGroup v-model="color" :options="['Red', 'Green', 'Blue']" />
 *
 * @example
 * // With object options and extractors
 * const plans = [
 *   { id: 'free', name: 'Free', info: '0$/month' },
 *   { id: 'pro', name: 'Pro', info: '10$/month' },
 *   { id: 'enterprise', name: 'Enterprise', info: 'Contact us' }
 * ]
 *
 * <RadioGroup
 *   v-model="selectedPlan"
 *   :options="plans"
 *   option-value="id"
 *   option-label="name"
 *   option-description="info"
 * />
 *
 * @example
 * // Inline layout (horizontal)
 * <RadioGroup
 *   v-model="size"
 *   :options="['Small', 'Medium', 'Large']"
 *   inline
 * />
 *
 * @example
 * // With type parsing
 * <RadioGroup
 *   v-model="quantity"
 *   :options="[1, 2, 3, 4, 5]"
 *   type="number"
 * />
 *
 * @example
 * // With custom option rendering
 * <RadioGroup v-model="theme" :options="themes" option-value="id">
 *   <template #default="{ option }">
 *     <div class="theme-preview" :style="{ background: option.data.color }">
 *       {{ option.label }}
 *     </div>
 *   </template>
 * </RadioGroup>
 *
 * @example
 * // With custom symbol slot
 * <RadioGroup v-model="selected" :options="options">
 *   <template #symbol="{ checked, disabled }">
 *     <Icon :name="checked ? 'circle-dot' : 'circle'" />
 *   </template>
 * </RadioGroup>
 *
 * @slot default - Custom option content. Props: { option }
 * @slot symbol - Custom radio symbol. Props: { checked, disabled }
 */
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { computed, useAttrs, useId } from "vue";

import { useAttrsWithoutClass } from "@/composables/useAttrsWithoutClass";
import type { Extractor, Option, ValueParser } from "@/types";
import { createTypeParser } from "@/utils/createTypeParser";
import { normalizeOptions } from "@/utils/normalizeOptions";

const modelValue = defineModel<any>();

defineSlots<{
  default?: (props: { option: Option }) => any;
  symbol: (props: { checked: boolean; disabled: boolean }) => any;
}>();

const attrs = useAttrs();

const attrsWithoutClass = useAttrsWithoutClass();

const inputName = (attrs.name as string) || `RadioGroup-input-${useId()}`;

const props = withDefaults(
  defineProps<{
    options: any[] | any;
    optionLabel?: Extractor;
    optionValue?: Extractor;
    optionDisabled?: Extractor;
    optionDescription?: Extractor;
    valueParser?: ValueParser<string>;
    disabled?: boolean;
    readonly?: boolean;
    inline?: boolean;
    type?: "string" | "number" | "boolean" | "date";
  }>(),
  {
    type: "string",
  },
);

const optionParser = computed(() => {
  return props.valueParser || createTypeParser(props.type);
});

const normalizedOptions = computed<Option[]>(() =>
  normalizeOptions(
    props.options,
    {
      value: props.optionValue,
      label: props.optionLabel,
      disabled: props.optionDisabled,
      description: props.optionDescription,
      stringifyValue: optionParser.value?.stringify,
    },
    modelValue.value,
  ),
);

function handleInput(value: any) {
  modelValue.value = optionParser.value.parse(value);
}
</script>

<style scoped>
.RadioGroup {
  & > * + * {
    margin-top: 0.75rem;
  }
}

.RadioGroup--inline {
  display: flex;
  align-items: flex-start;

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
  flex: 0 0 auto;

  & .RadioGroup__radioDot {
    margin: auto;
    width: 60%;
    aspect-ratio: 1 / 1;
    background: var(--vuiii-checkbox-iconColor--checked);
    border-radius: 999px;
    scale: 50%;
    opacity: 0;
    transition:
      scale 0.15s ease-out,
      opacity 0.15s ease-out;
  }

  input:checked + & {
    --vuiii-input-bgColor: var(--vuiii-checkbox-bgColor--checked);
    --vuiii-input-borderColor: var(--vuiii-checkbox-borderColor--checked);

    & .RadioGroup__radioDot {
      scale: 100%;
      opacity: 1;
    }
  }

  input:focus:not(:checked) + & {
    --borderColor: var(--vuiii-input-borderColor--focus);
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
