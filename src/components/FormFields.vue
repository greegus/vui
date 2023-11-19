<template>
  <div class="FormFields">
    <FormGroup
      v-for="(field, index) in normalizedFields"
      :key="field.name"
      :label="field.label"
      :description="field.description"
      :hint="field.hint"
      :required="field.required"
      :invalid="field.invalid"
      :error-message="field.errorMessage"
    >
      <slot :name="`field:${String(field.name)}`" v-bind="{ ...field, index }">
        <component
          :is="field.component"
          :model-value="field.value"
          v-bind="resolveIfComputed(field.name, field.props)"
          :required="field.required"
          :disabled="field.disabled"
          :invalid="field.invalid"
          @update:model-value="setFieldValue(field.name, $event)"
        />
      </slot>
    </FormGroup>
  </div>
</template>

<script lang="ts" setup generic="Data extends {}">
import { computed } from 'vue'

import type { FormField, KeyOfOrString, ValidationFieldResults } from '../types'
import FormGroup from './FormGroup.vue'

const props = defineProps<{
  fields: FormField<Data>[]
  modelValue: any
  validationResults?: Partial<Record<keyof Data, ValidationFieldResults>>
}>()

const normalizedFields = computed(() => {
  return props.fields.map((field) => ({
    ...field,
    value: getFieldValue(field.name),
    required: Boolean(resolveIfComputed(field.name, field.required)),
    disabled: Boolean(resolveIfComputed(field.name, field.disabled)),
    invalid: props.validationResults?.[field.name]?.isInvalid,
    errorMessage: props.validationResults?.[field.name]?.errorMessage
  }))
})

const fieldsByName = computed(() => {
  return new Map<FormField<Data>['name'], FormField<Data>>(props.fields.map((field) => [field.name, field]))
})

const emit = defineEmits<{
  'update:model-value': [value: any]
}>()

const getFieldValue = (name: FormField<Data>['name']): unknown => {
  const getter = fieldsByName.value.get(name)!.value?.getter || ((modelValue) => modelValue[name])

  return getter(props.modelValue)
}

const setFieldValue = (name: FormField<Data>['name'], value: unknown): void => {
  const setter =
    fieldsByName.value.get(name)!.value?.setter || ((value, modelValue) => ({ ...modelValue, [name]: value }))
  const modelValue = setter(value, props.modelValue)

  emit('update:model-value', modelValue)
}

const resolveIfComputed = <T = any,>(name: KeyOfOrString<T>, property: any): T => {
  if (typeof property === 'function') {
    return (property as any)?.(props.modelValue[name])
  }

  return property as T
}
</script>

<style lang="postcss" scoped>
.FormFields {
  & > * + * {
    margin-top: 1.5rem;
  }
}
</style>
