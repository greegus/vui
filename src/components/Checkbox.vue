<template>
  <label class="Checkbox" :class="{ 'Checkbox--disabled': $props.disabled }">
    <input
      v-show="!$props.switch"
      :checked="$props.modelValue"
      class="Checkbox__input vuiii-input"
      :required="$props.required"
      :disabled="$props.disabled"
      type="checkbox"
      @input="$emit('update:modelValue', ($event.target! as any).checked)"
    />

    <div v-if="$props.switch" class="Checkbox__switch" :class="{ 'Checkbox__switch--active': $props.modelValue }">
      <div class="Checkbox__switchDot"></div>
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

defineProps<{
  modelValue: boolean
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
  margin-top: 1px;
}

.Checkbox__switch {
  padding: 3px;
  margin-top: -1px;
  width: 2.25rem;
  border-radius: 999px;
  transition: all 0.15s ease-out;
  background: rgb(115, 115, 115) /* neutral.500 */;

  &--active {
    background: var(--vuiii-color-primary);
  }
}

.Checkbox__switchDot {
  width: 1.25rem;
  aspect-ratio: 1 / 1;
  background: white;
  border-radius: 999px;
  transition: all 0.15s ease-out;
}

.Checkbox__switch--active .Checkbox__switchDot {
  transform: translateX(0.75rem);
}

.Checkbox__label {
  margin-left: 0.5rem;
  line-height: 1.375;
}

.Checkbox__required {
  line-height: 1;
  color: var(--vuiii-color-danger);
}
</style>
