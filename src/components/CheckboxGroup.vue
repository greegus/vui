<template>
  <div class="CheckboxGroup" :class="{ 'CheckboxGroup--inline': $props.inline }">
    <div v-for="option in normalizedOptions" :key="option.value">
      <Checkbox
        :disabled="option.disabled"
        :model-value="checkedValues.has(option.value)"
        :label="option.label"
        :description="option.description"
        @update:model-value="toggleCheckedValue(option.value, $event)"
      >
        <template v-if="$slots.symbol" #symbol="{ checked, disabled }">
          <slot name="symbol" v-bind="{ checked, disabled }" />
        </template>
      </Checkbox>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * Group of checkboxes for multi-select from a list of options.
 * Normalizes various option formats and supports custom value parsing.
 *
 * @see {@link module:normalizeOptions} for supported option formats and extractor props
 *
 * @component CheckboxGroup
 *
 * @example
 * // Basic usage with string array
 * import { CheckboxGroup } from 'vuiii'
 *
 * <CheckboxGroup v-model="selectedFruits" :options="['Apple', 'Banana', 'Cherry']" />
 *
 * @example
 * // With object options and extractors
 * const permissions = [
 *   { id: 'read', name: 'Read', info: 'View content' },
 *   { id: 'write', name: 'Write', info: 'Edit content' },
 *   { id: 'delete', name: 'Delete', info: 'Remove content' }
 * ]
 *
 * <CheckboxGroup
 *   v-model="selectedPermissions"
 *   :options="permissions"
 *   option-value="id"
 *   option-label="name"
 *   option-description="info"
 * />
 *
 * @example
 * // Inline layout (horizontal)
 * <CheckboxGroup
 *   v-model="selected"
 *   :options="['Option A', 'Option B', 'Option C']"
 *   inline
 * />
 *
 * @example
 * // With type parsing (values will be numbers)
 * <CheckboxGroup
 *   v-model="selectedIds"
 *   :options="[{ id: 1, name: 'One' }, { id: 2, name: 'Two' }]"
 *   option-value="id"
 *   option-label="name"
 *   type="number"
 * />
 *
 * @example
 * // With custom symbol slot
 * <CheckboxGroup v-model="selected" :options="options">
 *   <template #symbol="{ checked, disabled }">
 *     <Icon :name="checked ? 'check-circle' : 'circle'" />
 *   </template>
 * </CheckboxGroup>
 *
 * @slot symbol - Custom checkbox symbol. Props: { checked, disabled }
 */
import { computed } from "vue";

import Checkbox from "@/components/Checkbox.vue";
import type { Extractor, Option, ValueParser } from "@/types";
import { createTypeParser } from "@/utils/createTypeParser";
import { normalizeOptions } from "@/utils/normalizeOptions";

const modelValue = defineModel<any[]>();

const props = withDefaults(
  defineProps<{
    options: any[] | any;
    optionLabel?: Extractor;
    optionValue?: Extractor;
    optionDisabled?: Extractor;
    optionDescription?: Extractor;
    valueParser?: ValueParser;
    type?: "string" | "number" | "boolean" | "date";
    inline?: boolean;
  }>(),
  {},
);

defineSlots<{
  default?: void;
  symbol?: (props: { checked: boolean; disabled: boolean }) => any;
}>();

const valueParser = computed(() => {
  return props.valueParser || createTypeParser(props.type);
});

const normalizedOptions = computed<Option[]>(() => {
  return normalizeOptions(props.options, {
    value: props.optionValue,
    label: props.optionLabel,
    disabled: props.optionDisabled,
    description: props.optionDescription,
    stringifyValue: valueParser.value.stringify,
  });
});

const checkedValues = computed<Set<string | number>>(() => {
  return new Set(modelValue.value);
});

const toggleCheckedValue = (value: any, checked: boolean) => {
  const newCheckedValues = new Set(checkedValues.value.values());
  const parsedValue = valueParser.value.parse(value);

  if (checked) {
    newCheckedValues.add(parsedValue);
  } else {
    newCheckedValues.delete(parsedValue);
  }

  modelValue.value = Array.from(newCheckedValues);
};
</script>

<style scoped>
.CheckboxGroup {
  & > * + * {
    margin-top: 0.75rem;
  }
}

.CheckboxGroup--inline {
  display: flex;
  align-items: flex-start;

  & > * + * {
    margin-top: 0rem;
    margin-left: 1.5rem;
  }
}
</style>
