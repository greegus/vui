<template>
  <div class="FormFields">
    <FormGroup
      v-for="(field, name) in fields"
      :key="name"
      :label="field.label"
      :description="field.description"
      :hint="field.hint"
      :required="field.required"
      :error="errors?.[name]"
    >
      <component
        :is="field.component"
        :model-value="getFieldValue(String(name))"
        v-bind="field.props"
        @update:model-value="setFieldValue(String(name), $event)"
      />
    </FormGroup>
  </div>
</template>

<script lang="ts" setup>
import { AsyncComponentLoader, Component, PropType } from 'vue'

import FormGroup from './FormGroup.vue'

export type FormFieldValue = {
  getter: (modelValue: any) => unknown
  setter: (value: unknown, modelValue: any) => void
}

export type FormField = {
  label?: string
  description?: string
  hint?: string
  required?: boolean
  component: string | Component | AsyncComponentLoader
  props?: Record<string, unknown>
  value?: FormFieldValue
}

export type FormFieldsStructure<T extends any = any> = Record<Partial<keyof T>, FormField>

const emits = defineEmits(['update:modelValue'])

const props = defineProps({
  fields: {
    type: Object as PropType<FormFieldsStructure>,
    default: () => ({})
  },

  modelValue: {
    type: Object as PropType<any>,
    default: () => ({})
  },

  errors: {
    type: Object as PropType<Record<string, boolean | string | string[]>>,
    default: () => ({})
  }
})

function getFieldValue(name: string): unknown {
  const getter = props.fields[name].value?.getter || ((modelValue) => modelValue[name])

  return getter(props.modelValue)
}

function setFieldValue(name: string, value: unknown): void {
  const setter = props.fields[name].value?.setter || ((value, modelValue) => ({ ...modelValue, [name]: value }))
  const modelValue = setter(value, props.modelValue)

  emits('update:modelValue', modelValue)
}
</script>

<style lang="postcss" scoped>
.FormFields {
  & > * + * {
    margin-top: 2rem;
  }
}
</style>
