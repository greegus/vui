<template>
  <div class="Form">
    <form v-if="modelValue" :disabled="submitting" @submit.prevent="submit?.()">
      <div v-for="(block, index) in structure" :key="index">
        <div v-if="block.title" class="Form__title">{{ block.title }}</div>

        <FormFields
          :fields="block.fields"
          :model-value="modelValue"
          :errors="errors"
          @update:model-value="emits('update:modelValue', $event)"
          @change="emits('change', $event)"
        />
      </div>

      <slot name="buttons" v-bind="{ cancel, submit }">
        <div v-if="submit || cancel" class="Form__buttons">
          <Button
            v-if="submit"
            variant="primary"
            type="submit"
            :label="submitLabel"
            :disabled="submitting"
            :prefix-icon="submitting ? 'spinner' : undefined"
          />

          <Button v-if="cancel" :label="cancelLabel" :disabled="submitting" @click="cancel()" />
        </div>
      </slot>
    </form>

    <Icon v-else name="spinner" />
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { RouteLocationRaw, useRouter } from 'vue-router'

import Button from './Button.vue'
import FormFields, { FormFieldsStructure } from './FormFields.vue'
import Icon from './Icon.vue'

export type FormStructure<T = any> = {
  title?: string
  separator?: boolean
  fields: FormFieldsStructure<T>
}[]

const emits = defineEmits(['update:modelValue', 'change', 'submit', 'cancel'])

const router = useRouter()

const props = defineProps({
  structure: {
    type: Object as PropType<FormStructure>,
    default: () => ({})
  },

  modelValue: {
    type: Object as PropType<any>,
    default: () => undefined
  },

  errors: {
    type: Object as PropType<Record<string, boolean | string | string[]>>,
    default: () => ({})
  },

  submit: {
    type: Function as PropType<(modelValue: any) => void>,
    default: undefined
  },

  submitLabel: {
    type: String as PropType<string>,
    default: 'Submit'
  },

  cancel: {
    type: [Function, Object] as PropType<(() => void) | RouteLocationRaw>,
    default: undefined
  },

  cancelLabel: {
    type: String as PropType<string>,
    default: 'Cancel'
  },

  submitting: Boolean
})

function submit() {
  props.submit?.(props.modelValue)
}

function cancel() {
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
