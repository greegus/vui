<template>
  <InputWrapper
    :prefix-icon="$props.prefixIcon"
    :suffix-icon="$props.suffixIcon"
    :size="$props.size"
    :invalid="$props.invalid"
    :pill="$props.pill"
    :class="$attrs.class"
    :disabled="$attrs.disabled"
    @click="input.focus()"
    @prefix-icon-click="$emit('prefix-icon-click')"
    @suffix-icon-click="$emit('suffix-icon-click')"
  >
    <template v-if="slots.prefix" #prefix>
      <slot name="prefix" />
    </template>

    <input
      ref="input"
      :aria-label="($attrs.placeholder as string) || 'input'"
      v-bind="attrsWithoutClass"
      class="vuiii-input__nested Input__input"
      :class="[
        inputClass,
        {
          'Input__input--withPrefixIcon': $props.prefixIcon,
          'Input__input--withSuffixIcon': $props.suffixIcon,
        },
      ]"
      :type="($attrs.type as string) || 'text'"
      :value="modelValue"
      @input="handleInput($event)"
    />

    <template v-if="slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
  </InputWrapper>
</template>

<script lang="ts">
/**
 * Text input component with icon support, size variants, and validation states.
 * Wraps native input with InputWrapper for consistent styling.
 *
 * @component Input
 *
 * @example
 * // Basic usage
 * import { Input } from 'vuiii'
 *
 * <Input v-model="name" placeholder="Enter your name" />
 *
 * @example
 * // Different input types (passed via attrs)
 * <Input v-model="email" type="email" placeholder="Email" />
 * <Input v-model="password" type="password" placeholder="Password" />
 * <Input v-model="count" type="number" placeholder="Count" />
 *
 * @example
 * // With icons
 * <Input v-model="search" prefixIcon="magnifying-glass" placeholder="Search..." />
 * <Input v-model="email" suffixIcon="envelope" placeholder="Email" />
 *
 * @example
 * // With clickable icons (emits events)
 * <Input
 *   v-model="password"
 *   :suffix-icon="showPassword ? 'eye-slash' : 'eye'"
 *   :type="showPassword ? 'text' : 'password'"
 *   @suffix-icon-click="showPassword = !showPassword"
 * />
 *
 * @example
 * // Different sizes
 * <Input v-model="text" size="small" placeholder="Small" />
 * <Input v-model="text" size="normal" placeholder="Normal" />
 * <Input v-model="text" size="large" placeholder="Large" />
 *
 * @example
 * // Validation state
 * <Input v-model="email" :invalid="!isValidEmail" placeholder="Email" />
 *
 * @example
 * // Value as number or date (for type="number" or type="date")
 * <Input v-model="count" type="number" value-as-number />
 * <Input v-model="date" type="date" value-as-date />
 *
 * @example
 * // Programmatic control via ref
 * const inputRef = ref<InputRef>()
 *
 * inputRef.value?.focus()
 * inputRef.value?.select()
 *
 * @slot prefix - Content before the input (replaces prefixIcon)
 * @slot suffix - Content after the input (replaces suffixIcon)
 *
 * @emits prefix-icon-click - When prefix icon is clicked
 * @emits suffix-icon-click - When suffix icon is clicked
 */
export type InputRef = {
  input: HTMLInputElement;
  focus: () => void;
  select: () => void;
};

export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { ref, useAttrs, useSlots } from "vue";

import InputWrapper, {
  type InputWrapperEmits,
  type InputWrapperProps,
  type InputWrapperSlots,
} from "@/components/InputWrapper.vue";
import { useAttrsWithoutClass } from "@/composables/useAttrsWithoutClass";

type ModelValueType = string | number | Date | null | undefined;

const modelValue = defineModel<ModelValueType>();

const props = defineProps<
  InputWrapperProps & {
    inputClass?: any;
    valueAsNumber?: boolean;
    valueAsDate?: boolean;
  }
>();

defineEmits<InputWrapperEmits>();

defineSlots<InputWrapperSlots>();

const attrsWithoutClass = useAttrsWithoutClass();
const slots = useSlots();

const input = ref();

function retrieveTargetValue(e: Event): ModelValueType {
  const target = e.target as HTMLInputElement;

  if (props.valueAsNumber) {
    return target.valueAsNumber;
  }

  if (props.valueAsDate) {
    return target.valueAsDate;
  }

  return target.value;
}

function handleInput(e: Event) {
  modelValue.value = retrieveTargetValue(e);
}

defineExpose({
  input,
  focus: () => input.value.focus(),
  select: () => input.value.select(),
});
</script>

<style scoped>
.Input__input {
  width: 100%;
  flex: auto;
  align-self: stretch;
}
</style>
