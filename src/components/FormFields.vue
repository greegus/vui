<template>
  <div class="FormFields">
    <FormGroup
      v-for="(field, name) in $props.fields"
      :key="name"
      :label="field.label"
      :description="field.description"
      :hint="field.hint"
      :required="resolveIfComputed(String(name), field.required)"
      :error="($props.errors?.[name] as any)"
    >
      <component
        :is="field.component"
        :model-value="getFieldValue(String(name))"
        v-bind="resolveIfComputed(String(name), field.props)"
        :required="resolveIfComputed(String(name), field.required)"
        :disabled="resolveIfComputed(String(name), field.disabled)"
        @update:model-value="setFieldValue(String(name), $event)"
      />
    </FormGroup>
  </div>
</template>

<script lang="ts" setup>
import type { FormFieldsStructure } from '@/types'

import FormGroup from './FormGroup.vue'

const props = withDefaults(
  defineProps<{
    fields: FormFieldsStructure
    modelValue: any
    errors?: Record<string, any>
  }>(),
  {
    errors: () => ({})
  }
)

const emit = defineEmits<{
  (e: 'update:model-value', value: any): void
}>()

const getFieldValue = (name: string): unknown => {
  const getter = props.fields[name].value?.getter || ((modelValue) => modelValue[name])

  return getter(props.modelValue)
}

const setFieldValue = (name: string, value: unknown): void => {
  const setter = props.fields[name].value?.setter || ((value, modelValue) => ({ ...modelValue, [name]: value }))
  const modelValue = setter(value, props.modelValue)

  emit('update:model-value', modelValue)
}

const resolveIfComputed = <T = any>(name: string, property: any): T => {
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
