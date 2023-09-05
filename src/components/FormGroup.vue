<template>
  <div class="FormGroup" :class="{ 'FormGroup--invalid': $props.invalid }">
    <div v-if="$props.label" class="FormGroup__header">
      <label class="FormGroup__label" :for="$props.for">
        {{ $props.label }}
      </label>

      <div v-if="$props.required" class="FormGroup__required">*</div>
    </div>

    <div v-if="$slots.description || $props.description" class="FormGroup__description">
      <slot name="description">
        {{ $props.description }}
      </slot>
    </div>

    <slot />

    <div v-if="$slots.hint || $props.hint" class="FormGroup__hint">
      <slot name="hint">
        {{ $props.hint }}
      </slot>
    </div>

    <div v-if="$props.invalid && $props.errorMessage" class="FormGroup__error">
      {{ $props.errorMessage }}
    </div>
  </div>
</template>

<script lang="ts" setup>
export type FormGroupProps = {
  label?: string
  required?: boolean
  invalid?: boolean
  errorMessage?: string
  description?: string
  hint?: string
}

export type FormGroupSlots = {
  default: void
  description: void
  hint: void
}

defineProps<FormGroupProps & { for?: string }>()

defineSlots<FormGroupSlots>()
</script>

<style lang="postcss" scoped>
.FormGroup {
  width: 100%;
}

.FormGroup--invalid {
  &:deep() .vuiii-input,
  &:deep() .vuiii-input:hover {
    --textColor: var(--vuiii-field-borderColor--invalid);
    --borderColor: var(--vuiii-field-borderColor--invalid);
    --ringColor: var(--vuiii-field-ringColor--invalid, rgb(225 29 72/0.2) /* rose.600 */);
  }
}

.FormGroup__header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.25rem;
}

.FormGroup__label {
  font-size: var(--vuiii-fontSize--small);
}

.FormGroup__required {
  line-height: 1;
  color: var(--vuiii-color-danger);
}

.FormGroup__description {
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
  max-width: 48rem; /* max-w-3xl */
  color: rgb(115, 115, 115);
}

.FormGroup__hint {
  font-size: 0.8rem;
  margin-top: 0.5rem;
  max-width: 48rem; /* max-w-3xl */
  color: rgb(115, 115, 115);
}

.FormGroup__error {
  font-size: 0.8rem;
  margin-top: 0.25rem;
  max-width: 48rem; /* max-w-3xl */
  color: var(--vuiii-color-danger);
}
</style>
