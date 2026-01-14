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
