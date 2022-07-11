<template>
  <div class="FormGroup" :class="{ 'FormGroup--invalid': error }">
    <div v-if="label" class="FormGroup__header">
      <label class="FormGroup__label">
        {{ label }}
      </label>

      <div v-if="required" class="FormGroup__required">*</div>
    </div>

    <div v-if="$slots.description || description" class="FormGroup__description">
      <slot name="description">
        {{ description }}
      </slot>
    </div>

    <slot />

    <div v-if="$slots.hint || hint" class="FormGroup__hint">
      <slot name="hint">
        {{ hint }}
      </slot>
    </div>

    <div v-if="errorMessage" class="FormGroup__error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    label: {
      type: String,
      default: ''
    },

    error: {
      type: [String, Array, Boolean] as PropType<boolean | string | string[]>,
      default: ''
    },

    description: {
      type: String,
      default: ''
    },

    hint: {
      type: String,
      default: ''
    },

    required: Boolean
  },

  computed: {
    errorMessage(): string {
      if (Array.isArray(this.error)) {
        return this.error.filter(Boolean).join(' ')
      }

      if (typeof this.error === 'string') {
        return this.error
      }

      return ''
    }
  }
})
</script>

<style lang="postcss" scoped>
.FormGroup {
  width: 100%;
}

.FormGroup--invalid {
  &:deep() .vuiii-input,
  &:deep() .vuiii-input:hover {
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
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05rem;
  text-transform: uppercase;
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
  margin-top: 0.5rem;
  max-width: 48rem; /* max-w-3xl */
  color: var(--vuiii-color-danger);
}
</style>
