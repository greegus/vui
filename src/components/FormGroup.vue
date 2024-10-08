<template>
  <div class="FormGroup" :class="{ 'FormGroup--invalid': $props.error }">
    <div v-if="$props.label || $slots.label" class="FormGroup__header">
      <label class="FormGroup__label" :for="$props.for">
        <slot name="label">
          {{ $props.label }}
        </slot>
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

    <div v-if="$props.error && typeof $props.error === 'string'" class="FormGroup__error">
      {{ $props.error }}
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  label?: string
  for?: string
  required?: boolean
  error?: string | boolean
  description?: string
  hint?: string
}>()

defineSlots<{
  default: void
  label: void
  description: void
  hint: void
}>()
</script>

<style lang="postcss" scoped>
.FormGroup {
  width: 100%;
}

.FormGroup__header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.25rem;
}

.FormGroup__label {
  font-size: var(--vuiii-label-fontSize);
  font-weight: var(--vuiii-label-fontWeight);
  text-transform: var(--vuiii-label-textTransform);
}

.FormGroup__required {
  line-height: 1;
  color: var(--vuiii-color-danger);
}

.FormGroup__description {
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  margin-top: -0.25rem;
  max-width: 48rem; /* max-w-3xl */
  color: rgb(115, 115, 115);
}

.FormGroup__hint {
  font-size: 0.8rem;
  margin-top: 0.25rem;
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
