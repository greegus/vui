<template>
  <div class="FormFields" :class="`FormFields--${props.orientation}`">
    <template v-for="(item, index) in props.fields" :key="getItemKey(item, index)">
      <!-- Recursive: Render nested array with opposite orientation -->
      <FormFields
        v-if="Array.isArray(item)"
        :fields="item"
        :model-value="props.modelValue"
        :validation-results="props.validationResults"
        :orientation="oppositeOrientation"
        class="FormFields__row"
        @update:model-value="emit('update:model-value', $event)"
      />

      <!-- Divider rendering -->
      <Divider v-else-if="item === FORM_DIVIDER" />

      <!-- Regular field rendering -->
      <FormGroup
        v-else
        :label="item.label"
        :description="item.description"
        :hint="item.hint"
        :required="normalizeRequired(item)"
        :invalid="props.validationResults?.[item.name]?.isInvalid"
        :error-message="props.validationResults?.[item.name]?.errorMessage"
      >
        <slot :name="`field:${String(item.name)}`" v-bind="{ ...item, index }">
          <component
            :is="item.component"
            :model-value="getFieldValue(item.name)"
            v-bind="resolveIfComputed(item.name, item.props)"
            :required="normalizeRequired(item)"
            :disabled="normalizeDisabled(item)"
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
 * const { validatedFields, validate } = useValidation(data, validationRules)
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
 *     // Props can be a function that receives current field value
 *     props: (countryValue) => ({ options: statesByCountry[countryValue] }),
 *     disabled: (countryValue) => !countryValue
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
import { computed } from "vue";

import FormGroup from "@/components/FormGroup.vue";
import Divider from "@/components/Divider.vue";
import type { FormField, FormFieldOrRow, ObjectKeyOrAnyString, ValidationFieldResults } from "@/types";
import { FORM_DIVIDER } from "@/types";

const props = withDefaults(
  defineProps<{
    fields: FormFieldOrRow<Data>[];
    modelValue: any;
    validationResults?: Partial<Record<ObjectKeyOrAnyString<Data>, ValidationFieldResults>>;
    orientation?: "vertical" | "horizontal";
  }>(),
  {
    orientation: "vertical",
  }
);

const emit = defineEmits<{
  "update:model-value": [value: any];
}>();

// Get opposite orientation for nested arrays
const oppositeOrientation = computed(() => (props.orientation === "vertical" ? "horizontal" : "vertical"));

// Helper for Vue keys
const getItemKey = (item: FormFieldOrRow<Data>, index: number): string => {
  if (Array.isArray(item)) {
    return item.map((f) => f.name).join("|");
  }
  if (item === FORM_DIVIDER) {
    return `divider-${index}`;
  }
  return String(item.name);
};

// Helper to normalize required prop
const normalizeRequired = (field: FormField<Data>): boolean => {
  return Boolean(resolveIfComputed(field.name, field.required));
};

// Helper to normalize disabled prop
const normalizeDisabled = (field: FormField<Data>): boolean => {
  return Boolean(resolveIfComputed(field.name, field.disabled));
};

const fieldsByName = computed(() => {
  const flatFields: FormField<Data>[] = [];
  props.fields.forEach((item) => {
    if (Array.isArray(item)) {
      flatFields.push(...item);
    } else if (item !== FORM_DIVIDER) {
      flatFields.push(item);
    }
    // Skip dividers - they don't have values
  });
  return new Map<FormField<Data>["name"], FormField<Data>>(flatFields.map((field) => [field.name, field]));
});

const getFieldValue = (name: FormField<Data>["name"]): unknown => {
  const getter = fieldsByName.value.get(name)!.value?.getter || ((modelValue: Data) => modelValue[name as keyof Data]);

  return getter(props.modelValue);
};

const setFieldValue = (name: FormField<Data>["name"], value: unknown): void => {
  const setter =
    fieldsByName.value.get(name)!.value?.setter || ((value: unknown, modelValue: Data) => ({ ...modelValue, [name]: value }));
  const modelValue = setter(value, props.modelValue);

  emit("update:model-value", modelValue);
};

const resolveIfComputed = <T = any,>(name: ObjectKeyOrAnyString<T>, property: any): T => {
  if (typeof property === "function") {
    return (property as any)?.(props.modelValue[name]);
  }

  return property as T;
};
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
