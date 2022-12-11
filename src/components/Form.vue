<template>
  <div class="Form">
    <form v-if="$props.modelValue" :disabled="$props.submitting" @submit.prevent="handleSubmit?.()">
      <div v-for="(block, index) in $props.structure" :key="index">
        <div v-if="block.title" class="Form__title">{{ block.title }}</div>

        <FormFields
          :fields="block.fields"
          :model-value="$props.modelValue"
          :errors="$props.errors"
          @update:model-value="$emit('update:modelValue', $event)"
          @change="$emit('change', $event)"
        />
      </div>

      <slot name="buttons" v-bind="{ cancel: $props.cancel, submit: $props.submit, submitting: $props.submitting }">
        <div v-if="$props.submit || $props.cancel" class="Form__buttons">
          <Button
            v-if="$props.submit"
            variant="primary"
            type="submit"
            :label="$props.submitLabel"
            :loading="$props.submitting"
            :prefix-icon="$props.submitting ? 'spinner' : undefined"
          />

          <Button
            v-if="$props.cancel"
            :label="$props.cancelLabel"
            :disabled="$props.submitting"
            @click="handleCancel()"
          />
        </div>
      </slot>
    </form>

    <Icon v-else name="spinner" />
  </div>
</template>

<script lang="ts" setup>
import { RouteLocationRaw, useRouter } from 'vue-router'

import { FormStructure } from '@/types'

import Button from './Button.vue'
import FormFields from './FormFields.vue'
import Icon from './Icon.vue'

const props = withDefaults(
  defineProps<{
    structure: FormStructure
    modelValue: unknown
    errors?: Record<string, any>
    submit?: (modelValue: any) => void
    submitLabel?: string
    cancel?: (() => void) | RouteLocationRaw
    cancelLabel: string
    submitting: boolean
  }>(),
  {
    structure: () => [],
    errors: () => ({}),
    submit: undefined,
    submitLabel: 'Submit',
    cancel: undefined,
    cancelLabel: 'Cancel'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
  (e: 'change', change: Record<string, unknown>): void
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const router = useRouter()

const handleSubmit = () => {
  emit('submit')
  typeof props.submit === 'function' ? props.submit?.(props.modelValue) : props.submit && router.push(props.submit)
}

const handleCancel = () => {
  emit('cancel')
  typeof props.cancel === 'function' ? props.cancel?.() : props.cancel && router.push(props.cancel)
}
</script>

<style lang="postcss" scoped>
.Form {
  & > * + * {
    margin-top: 2rem;
  }
}

.Form__buttons {
  display: flex;
  align-items: center;
  margin-top: 2rem;

  & > * + * {
    margin-left: 1rem;
  }
}
</style>
