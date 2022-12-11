<template>
  <div class="FormFields">
    <FormGroup
      v-for="(field, name) in $props.fields"
      :key="name"
      :label="field.label"
      :description="field.description"
      :hint="field.hint"
      :required="field.required"
      :error="($props.errors?.[name] as any)"
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
import { FormFieldsStructure } from '@/types'

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
  (e: 'update:modelValue', value: any): void
}>()

const getFieldValue = (name: string): unknown => {
  const getter = props.fields[name].value?.getter || ((modelValue) => modelValue[name])

  return getter(props.modelValue)
}

const setFieldValue = (name: string, value: unknown): void => {
  const setter = props.fields[name].value?.setter || ((value, modelValue) => ({ ...modelValue, [name]: value }))
  const modelValue = setter(value, props.modelValue)

  emit('update:modelValue', modelValue)
}
</script>

<style lang="postcss" scoped>
.FormFields {
  & > * + * {
    margin-top: 2rem;
  }
}
</style>
