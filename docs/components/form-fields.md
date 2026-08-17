# FormFields

Dynamic form generator that renders fields from a configuration array.
Supports vertical/horizontal layouts, nested rows, dividers, and validation integration.

::: tip Composition
Generates a form from a config array. For how it relates to `FormGroup` and the bare inputs, see [Composing Forms](/getting-started/composing-forms).
:::

## Import

```typescript
import { FormFields } from 'vuiii'
```

## Props

| Prop                | Type                                                | Default      | Description                                          |
| ------------------- | --------------------------------------------------- | ------------ | ---------------------------------------------------- |
| `modelValue`        | `Data`                                              | -            | The form data (`v-model`, required)                  |
| `fields`            | `FormFieldOrRow<Data>[]`                            | -            | Field config; a nested array becomes a row, `FORM_DIVIDER` a separator |
| `validationResults` | `Record<keyof Data, ValidationFieldResults>`        | -            | Per-field invalid state and error message            |
| `orientation`       | `'vertical' \| 'horizontal'`                        | `'vertical'` | Layout direction; nesting alternates it              |

### Field config

| Key           | Type                                                        | Description                                             |
| ------------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| `name`        | `keyof Data \| string`                                      | Property of the model this field binds to               |
| `component`   | `Component \| AsyncComponentLoader \| string`              | The control to render                                    |
| `label`       | `string`                                                    | Passed to the wrapping `FormGroup`                       |
| `description` | `string`                                                    | Passed to the wrapping `FormGroup`                       |
| `hint`        | `string`                                                    | Passed to the wrapping `FormGroup`                       |
| `props`       | `Record<string, unknown> \| ((data: Data) => Record<string, unknown>)` | Forwarded to the control; as a function, of the whole form data |
| `required`    | `boolean \| ((data: Data) => boolean)`                      | Static, or derived from the whole form data             |
| `disabled`    | `boolean \| ((data: Data) => boolean)`                      | Static, or derived from the whole form data             |
| `value`       | `{ getter, setter }`                                        | Maps the field to something other than one property     |

## Slots

| Slot            | Description                                                                  |
| --------------- | ---------------------------------------------------------------------------- |
| `field:{name}`  | Replaces the control for one field, keeping its label and error handling. Props: the field config plus `index` |

## Events

Exposes the form data through `v-model` (`update:modelValue`). It emits no other custom events.

## Basic Usage

<script setup>
import { ref } from 'vue'
import { FormFields, Input, Select, Textarea, Checkbox, FORM_DIVIDER } from '../../src'

const basic = ref({ email: '', name: '', role: 'user' })
const basicFields = [
  { name: 'email', component: Input, label: 'Email', props: { type: 'email' } },
  { name: 'name', component: Input, label: 'Name' },
  { name: 'role', component: Select, label: 'Role', props: { options: ['admin', 'user'] } },
]

const rows = ref({ firstName: '', lastName: '', email: '' })
const rowFields = [
  [
    { name: 'firstName', component: Input, label: 'First name' },
    { name: 'lastName', component: Input, label: 'Last name' },
  ],
  { name: 'email', component: Input, label: 'Email' },
]

const divided = ref({ name: '', email: '' })
const dividedFields = [
  { name: 'name', component: Input, label: 'Name' },
  FORM_DIVIDER,
  { name: 'email', component: Input, label: 'Email' },
]

const dependent = ref({ country: '', state: '' })
const statesByCountry = {
  us: ['Texas', 'New York'],
  de: ['Bavaria', 'Hesse'],
}
const dependentFields = [
  { name: 'country', component: Select, label: 'Country', props: { options: { us: 'United States', de: 'Germany' }, placeholder: 'Pick one' } },
  {
    name: 'state',
    component: Select,
    label: 'State',
    props: (data) => ({ options: statesByCountry[data.country] ?? [] }),
    disabled: (data) => !data.country,
  },
]

const validated = ref({ email: '' })
const validatedFields = { email: { isInvalid: true, errorMessage: 'Email is required' } }
</script>

<ComponentDemo storybook="components-formfields--default">
  <div style="width: 100%">
    <FormFields v-model="basic" :fields="basicFields" />
  </div>
</ComponentDemo>

```vue
<script setup>
import { FormFields, Input, Select } from 'vuiii'
import type { FormField } from 'vuiii'

type UserData = { email: string; name: string; role: string }

const formData = ref<UserData>({ email: '', name: '', role: 'user' })

const fields: FormField<UserData>[] = [
  { name: 'email', component: Input, label: 'Email', props: { type: 'email' } },
  { name: 'name', component: Input, label: 'Name' },
  { name: 'role', component: Select, label: 'Role', props: { options: ['admin', 'user'] } },
]
</script>

<template>
  <FormFields v-model="formData" :fields="fields" />
</template>
```

`component` takes a component, not a name from a fixed list — VUIII's, your own, or an async one —
and everything in `props` is forwarded to it.

## Rows

Nest an array to lay fields out side by side. Nesting alternates the orientation, so a row inside a
vertical form is horizontal.

<ComponentDemo>
  <div style="width: 100%">
    <FormFields v-model="rows" :fields="rowFields" />
  </div>
</ComponentDemo>

```vue
const fields: FormFieldOrRow<UserData>[] = [
  [
    { name: 'firstName', component: Input, label: 'First name' },
    { name: 'lastName', component: Input, label: 'Last name' },
  ],
  { name: 'email', component: Input, label: 'Email' },
]
```

## Dividers

`FORM_DIVIDER` in the field list renders a [Divider](/components/divider), so sections stay in the
config rather than in the template.

<ComponentDemo>
  <div style="width: 100%">
    <FormFields v-model="divided" :fields="dividedFields" />
  </div>
</ComponentDemo>

```vue
import { FORM_DIVIDER } from 'vuiii'

const fields: FormFieldOrRow<UserData>[] = [
  { name: 'name', component: Input, label: 'Name' },
  FORM_DIVIDER,
  { name: 'email', component: Input, label: 'Email' },
]
```

## Fields That Depend on Other Fields

`props`, `required` and `disabled` each accept a function of the whole form data, so a field can
react to the rest of the form. Pick a country below and the state select fills in.

<ComponentDemo>
  <div style="width: 100%">
    <FormFields v-model="dependent" :fields="dependentFields" />
  </div>
</ComponentDemo>

```vue
const fields: FormField<Address>[] = [
  { name: 'country', component: Select, label: 'Country', props: { options: countries } },
  {
    name: 'state',
    component: Select,
    label: 'State',
    props: (data) => ({ options: statesByCountry[data.country] ?? [] }),
    disabled: (data) => !data.country,
  },
]
```

## Validation

`validation-results` takes the shape `useValidation` produces, so the two connect without adapter
code: each field gets its error message on the `FormGroup` and the invalid state on the control.

<ComponentDemo>
  <div style="width: 100%">
    <FormFields v-model="validated" :fields="[{ name: 'email', component: Input, label: 'Email' }]" :validation-results="validatedFields" />
  </div>
</ComponentDemo>

```vue
<script setup>
const { validate, validatedFields } = useValidation(validateForm)
</script>

<template>
  <FormFields v-model="data" :fields="fields" :validation-results="validatedFields" />
</template>
```

See [Composing Forms](/getting-started/composing-forms) for the full validation and submit flow.

## Overriding a Single Field

`field:{name}` replaces the control for one entry while keeping its label, layout and error
handling — so a generated form is not all-or-nothing.

```vue
<FormFields v-model="form" :fields="fields">
  <template #field:avatar>
    <FilePicker accept="image/*" @files="([file]) => (form.avatar = file)" />
  </template>
</FormFields>
```

## Transforming a Value

When a field does not map to a single model property, give it a `value` getter/setter pair. Both
receive the whole form data.

```ts
const fields: FormField<UserData>[] = [
  {
    name: 'fullName',
    component: Input,
    label: 'Full name',
    value: {
      getter: (data) => `${data.firstName} ${data.lastName}`,
      setter: (value, data) => {
        const [firstName, lastName] = value.split(' ')
        return { ...data, firstName, lastName }
      },
    },
  },
]
```

::: tip Storybook
For interactive examples with all variants, see [FormFields in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-formfields--docs).
:::
