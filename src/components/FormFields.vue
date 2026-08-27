<template>
  <div class="FormFields" :class="`FormFields--${props.orientation}`">
    <template v-for="(item, index) in props.fields" :key="getItemKey(item, index)">
      <!-- Recursive: Render nested array with opposite orientation -->
      <FormFields
        v-if="Array.isArray(item)"
        v-model="modelValue"
        :fields="item"
        :validation-results="props.validationResults"
        :orientation="oppositeOrientation"
        class="FormFields__row"
      />

      <!-- Divider rendering -->
      <Divider v-else-if="item === FORM_DIVIDER" />

      <!-- Regular field rendering -->
      <FormGroup
        v-else
        :for="fieldId(item.name)"
        :label="item.label"
        :description="item.description"
        :hint="item.hint"
        :required="resolvedFields.get(item.name)?.required"
        :error="props.validationResults?.[item.name]?.errorMessage || props.validationResults?.[item.name]?.isInvalid"
      >
        <slot :name="`field:${String(item.name)}`" v-bind="{ ...item, ...resolvedFields.get(item.name), index }">
          <component
            :is="item.component"
            :id="fieldId(item.name)"
            :model-value="getFieldValue(item.name)"
            v-bind="resolvedFields.get(item.name)?.props"
            :required="resolvedFields.get(item.name)?.required"
            :disabled="resolvedFields.get(item.name)?.disabled"
            :invalid="props.validationResults?.[item.name]?.isInvalid"
            @update:model-value="setFieldValue(item.name, $event)"
          />
        </slot>
      </FormGroup>
    </template>
  </div>
</template>

<script lang="ts" setup generic="Data extends {}">
/**
 * Dynamic form generator that renders fields from a configuration array.
 * Supports vertical/horizontal layouts, nested rows, dividers, and validation integration.
 *
 * @component FormFields
 *
 * @example
 * // Basic vertical form
 * import { FormFields, Input, Select } from 'vuiii'
 *
 * const fields: FormField<UserData>[] = [
 *   { name: 'email', component: Input, label: 'Email', props: { type: 'email' } },
 *   { name: 'name', component: Input, label: 'Name' },
 *   { name: 'role', component: Select, label: 'Role', props: { options: ['admin', 'user'] } }
 * ]
 *
 * <FormFields :fields="fields" v-model="formData" />
 *
 * @example
 * // Horizontal row (fields side-by-side) - nest arrays for horizontal grouping
 * const fields: FormFieldOrRow<UserData>[] = [
 *   [
 *     { name: 'firstName', component: Input, label: 'First Name' },
 *     { name: 'lastName', component: Input, label: 'Last Name' }
 *   ],
 *   { name: 'email', component: Input, label: 'Email' }
 * ]
 *
 * @example
 * // With dividers between sections
 * import { FORM_DIVIDER } from 'vuiii'
 *
 * const fields: FormFieldOrRow<UserData>[] = [
 *   { name: 'name', component: Input, label: 'Name' },
 *   FORM_DIVIDER,
 *   { name: 'email', component: Input, label: 'Email' }
 * ]
 *
 * @example
 * // With validation results from useValidation
 * const { validatedFields, validate } = useValidation(validateForm)
 *
 * <FormFields
 *   :fields="fields"
 *   v-model="data"
 *   :validation-results="validatedFields"
 * />
 *
 * @example
 * // Dynamic props based on current form values
 * const fields: FormField<UserData>[] = [
 *   {
 *     name: 'country',
 *     component: Select,
 *     label: 'Country',
 *     props: { options: countries }
 *   },
 *   {
 *     name: 'state',
 *     component: Select,
 *     label: 'State',
 *     // props / required / disabled can be functions of the whole form data
 *     props: (data) => ({ options: statesByCountry[data.country] }),
 *     disabled: (data) => !data.country
 *   }
 * ]
 *
 * @example
 * // Custom getter/setter for complex data transformations
 * const fields: FormField<UserData>[] = [
 *   {
 *     name: 'fullName',
 *     component: Input,
 *     label: 'Full Name',
 *     value: {
 *       getter: (data) => `${data.firstName} ${data.lastName}`,
 *       setter: (value, data) => {
 *         const [firstName, lastName] = value.split(' ')
 *         return { ...data, firstName, lastName }
 *       }
 *     }
 *   }
 * ]
 *
 * @slot field:{fieldName} - Custom render slot for a specific field. Receives field config and index.
 *   @example <template #field:email="{ name, label, index }">Custom email input</template>
 */
import { computed, useId } from 'vue'

import Divider from '@/components/Divider.vue'
import FormGroup from '@/components/FormGroup.vue'
import type { FormField, FormFieldOrRow, ObjectKeyOrAnyString, ValidationFieldResults } from '@/types'
import { FORM_DIVIDER } from '@/types'

const props = withDefaults(
  defineProps<{
    fields: FormFieldOrRow<Data>[]
    validationResults?: Partial<Record<ObjectKeyOrAnyString<Data>, ValidationFieldResults>>
    orientation?: 'vertical' | 'horizontal'
  }>(),
  {
    orientation: 'vertical',
  },
)

const modelValue = defineModel<Data>({ required: true })

// Get opposite orientation for nested arrays
const oppositeOrientation = computed(() => (props.orientation === 'vertical' ? 'horizontal' : 'vertical'))

// Stable per-field id used to link FormGroup's label to the rendered input
const idBase = useId()
const fieldId = (name: FormField<Data>['name']): string => `${idBase}-${String(name)}`

// Helper for Vue keys
const getItemKey = (item: FormFieldOrRow<Data>, index: number): string => {
  if (Array.isArray(item)) {
    return item.map((f) => f.name).join('|')
  }
  if (item === FORM_DIVIDER) {
    return `divider-${index}`
  }
  return String(item.name)
}

const fieldsByName = computed(() => {
  const flatFields: FormField<Data>[] = []
  props.fields.forEach((item) => {
    if (Array.isArray(item)) {
      flatFields.push(...item)
    } else if (item !== FORM_DIVIDER) {
      flatFields.push(item)
    }
    // Skip dividers - they don't have values
  })
  return new Map<FormField<Data>['name'], FormField<Data>>(flatFields.map((field) => [field.name, field]))
})

/**
 * `props`, `required` and `disabled` resolved once per field per render — the template reads each
 * of them more than once, and a freshly built `props` object on every read would make the rendered
 * control see changed props every time. Also what the `field:{name}` slot receives, so a consumer
 * rendering a field themselves gets resolved values rather than the raw callbacks.
 */
const resolvedFields = computed(() => {
  const resolved = new Map<
    FormField<Data>['name'],
    { props?: Record<string, unknown>; required: boolean; disabled: boolean }
  >()

  fieldsByName.value.forEach((field, name) =>
    resolved.set(name, {
      props: resolveIfComputed(field.props),
      required: Boolean(resolveIfComputed(field.required)),
      disabled: Boolean(resolveIfComputed(field.disabled)),
    }),
  )

  return resolved
})

const getFieldValue = (name: FormField<Data>['name']): unknown => {
  const field = fieldsByName.value.get(name)
  const getter = field?.value?.getter || ((data: Data) => data[name as keyof Data])

  return getter(modelValue.value)
}

const setFieldValue = (name: FormField<Data>['name'], value: unknown): void => {
  const field = fieldsByName.value.get(name)
  const setter = field?.value?.setter || ((value: unknown, data: Data) => ({ ...data, [name]: value }))

  modelValue.value = setter(value, modelValue.value) as Data
}

/**
 * Computed `props` / `required` / `disabled` receive the whole form data, the same as a field's
 * `value.getter`. Passing only the field's own value would make the dependent-field case these
 * callbacks exist for — a state select driven by the chosen country — impossible to express.
 */
const resolveIfComputed = <T = any>(property: any): T => {
  if (typeof property === 'function') {
    return (property as any)?.(modelValue.value)
  }

  return property as T
}
</script>

<style scoped>
/* Vertical orientation (default) */
.FormFields--vertical {
  & > * + * {
    margin-top: 1.5rem;
  }
}

/* Horizontal orientation - mobile first */
.FormFields--horizontal {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* Equal width for all child fields */
  & > * {
    flex: 1 1 0;
    min-width: 0;
  }
}

/* Tablet and up: Horizontal layout */
@media (min-width: 640px) {
  .FormFields--horizontal {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
  }
}

/* Desktop: Prevent wrapping */
@media (min-width: 1024px) {
  .FormFields--horizontal {
    flex-wrap: nowrap;
  }
}
</style>
