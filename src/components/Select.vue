<template>
  <InputWrapper
    class="Select"
    :class="$attrs.class"
    :size="$props.size"
    :invalid="$props.invalid"
    :disabled="$props.disabled"
    :pill="$props.pill"
  >
    <select
      v-bind="attrsWithoutClass"
      class="vuiii-input__nested Select__select"
      :class="inputClass"
      :value="serializedModelValue"
      :required="$props.required"
      @input="handleInput($event)"
    >
      <option
        data-placeholder
        v-if="$props.placeholder"
        :disabled="$props.required"
        :hidden="$props.required"
        value=""
        selected
      >
        {{ $props.placeholder }}
      </option>

      <template v-if="groups">
        <optgroup v-for="(group, index) in groups" :key="index" :label="group.label">
          <option
            v-for="option in group.options"
            :key="option.value"
            :disabled="option.disabled"
            :value="option.value"
            :selected="option.isSelected"
          >
            {{ option.label }}
          </option>
        </optgroup>
      </template>

      <template v-else>
        <option
          v-for="option in options"
          :key="option.value"
          :disabled="option.disabled"
          :value="option.value"
          :selected="option.isSelected"
        >
          {{ option.label }}
        </option>
      </template>
    </select>

    <template #suffix>
      <div class="Select__dropdownIcon vuiii-input__suffix-icon">
        <Icon name="triangle-down" :size="$props.size" />
      </div>
    </template>
  </InputWrapper>
</template>

<script lang="ts">
/**
 * Native select dropdown with support for various option formats and type parsing.
 * Normalizes arrays, objects, and grouped options into a consistent format.
 *
 * @see {@link module:normalizeOptions} for supported option formats and extractor props
 *
 * @component Select
 *
 * @example
 * // Basic usage with string array
 * import { Select } from 'vuiii'
 *
 * <Select v-model="color" :options="['Red', 'Green', 'Blue']" />
 *
 * @example
 * // With object array and extractors
 * const countries = [
 *   { code: 'us', name: 'United States' },
 *   { code: 'uk', name: 'United Kingdom' }
 * ]
 *
 * <Select
 *   v-model="country"
 *   :options="countries"
 *   option-value="code"
 *   option-label="name"
 *   placeholder="Select a country"
 * />
 *
 * @example
 * // With key-value object options
 * const statuses = { draft: 'Draft', published: 'Published', archived: 'Archived' }
 *
 * <Select v-model="status" :options="statuses" />
 *
 * @example
 * // With grouped options (optgroup)
 * const vehicles = [
 *   { category: 'Cars', items: [{ id: 1, name: 'Sedan' }, { id: 2, name: 'SUV' }] },
 *   { category: 'Bikes', items: [{ id: 3, name: 'Mountain' }, { id: 4, name: 'Road' }] }
 * ]
 *
 * <Select
 *   v-model="vehicle"
 *   :options="vehicles"
 *   group-label="category"
 *   group-options="items"
 *   option-value="id"
 *   option-label="name"
 * />
 *
 * @example
 * // With type parsing (automatically converts string value to number)
 * <Select v-model="count" :options="[1, 2, 3, 4, 5]" type="number" />
 *
 * @example
 * // With custom value parser
 * const dateParser = {
 *   parse: (str) => new Date(str),
 *   stringify: (date) => date.toISOString()
 * }
 *
 * <Select v-model="date" :options="dates" :value-parser="dateParser" />
 */
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { computed } from "vue";

import Icon from "@/components/Icon.vue";
import InputWrapper from "@/components/InputWrapper.vue";
import { useAttrsWithoutClass } from "@/composables/useAttrsWithoutClass";
import type { Extractor, InputSize, ValueParser } from "@/types";
import { createTypeParser } from "@/utils/createTypeParser";
import { normalizeGroups, normalizeOptions } from "@/utils/normalizeOptions";

const modelValue = defineModel<any>();

const attrsWithoutClass = useAttrsWithoutClass();

const props = withDefaults(
  defineProps<{
    options: any[] | any;
    optionLabel?: Extractor;
    optionValue?: Extractor;
    optionDisabled?: Extractor;
    groupLabel?: Extractor;
    groupOptions?: Extractor;
    valueParser?: ValueParser<string>;
    placeholder?: string;
    size?: InputSize;
    required?: boolean;
    inputClass?: any;
    invalid?: boolean;
    disabled?: boolean;
    pill?: boolean;
    type?: "string" | "number" | "boolean" | "date";
  }>(),
  {
    size: "normal",
    type: "string",
  },
);

const optionParser = computed(() => {
  return props.valueParser || createTypeParser(props.type);
});

const serializedModelValue = computed(() => optionParser.value.stringify(modelValue.value));

const groups = computed(() => {
  if (!props.groupOptions) {
    return;
  }

  return normalizeGroups(
    props.options,
    {
      groupLabel: props.groupLabel,
      groupOptions: props.groupOptions,
      value: props.optionValue,
      label: props.optionLabel,
      disabled: props.optionDisabled,
      stringifyValue: optionParser.value.stringify,
    },
    modelValue.value,
  );
});

const options = computed(() => {
  if (groups.value) {
    return;
  }

  return normalizeOptions(
    props.options,
    {
      value: props.optionValue,
      label: props.optionLabel,
      disabled: props.optionDisabled,
      stringifyValue: optionParser.value.stringify,
    },
    modelValue.value,
  );
});

function handleInput(e: Event) {
  modelValue.value = optionParser.value.parse((e.target as HTMLSelectElement).value);
}
</script>

<style scoped>
.Select__select {
  width: 100%;
  appearance: none;
  text-overflow: ellipsis;
  align-self: stretch;
  padding-right: calc(var(--padding) + var(--vuiii-icon-size) + 0.5rem);

  &:has(option[data-placeholder]:checked) {
    color: var(--vuiii-input-placeholderColor);
  }

  /* XXX: When placeholder is selected, we need to reset the color of individual option to the default one provided by vuiii-input */
  option {
    color: var(--textColor);
  }

  /* XXX: deal with vertical cropping of the label */
  line-height: 1.5;

  /* XXX: targets only Firerefox to fix the vertical text alignment */
  @supports (-moz-appearance: none) {
    line-height: 3;
  }
}

.Select__dropdownIcon {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
}
</style>
