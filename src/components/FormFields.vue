<template>
  <div class="FormFields">
    <FormGroup
      v-for="(field, name) in fields"
      :key="name"
      :label="field.label"
      :description="field.description"
      :hint="field.hint"
      :required="field.required"
      :error="(errors?.[name] as any)"
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

<script lang="ts">
import { AsyncComponentLoader, Component, defineComponent, PropType } from 'vue'

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

export type FormFieldsStructure<T extends any = any> = Record<keyof T | string, FormField>

export default defineComponent({
  components: {
    FormGroup
  },

  props: {
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
  },

  emits: ['update:modelValue'],

  methods: {
    getFieldValue(name: string): unknown {
      const getter = this.fields[name].value?.getter || ((modelValue) => modelValue[name])

      return getter(this.modelValue)
    },

    setFieldValue(name: string, value: unknown): void {
      const setter = this.fields[name].value?.setter || ((value, modelValue) => ({ ...modelValue, [name]: value }))
      const modelValue = setter(value, this.modelValue)

      this.$emit('update:modelValue', modelValue)
    }
  }
})
</script>

<style lang="postcss" scoped>
.FormFields {
  & > * + * {
    margin-top: 2rem;
  }
}
</style>
