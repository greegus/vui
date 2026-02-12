# FormFields

Dynamic form generator that renders fields from a configuration array.
Supports vertical/horizontal layouts, nested rows, dividers, and validation integration.

## Import

```typescript
import { FormFields } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { FormFields } from '../../src'
</script>

<ComponentDemo storybook="example-formfields--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic vertical form
import { FormFields, Input, Select } from 'vuiii'

const fields: FormField<UserData>[] = [
  { name: 'email', component: Input, label: 'Email', props: { type: 'email' } },
  { name: 'name', component: Input, label: 'Name' },
  { name: 'role', component: Select, label: 'Role', props: { options: ['admin', 'user'] } }
]

<FormFields :fields="fields" v-model="formData" />
```

## More Examples

```vue
// Horizontal row (fields side-by-side) - nest arrays for horizontal grouping
const fields: FormFieldOrRow<UserData>[] = [
  [
    { name: 'firstName', component: Input, label: 'First Name' },
    { name: 'lastName', component: Input, label: 'Last Name' }
  ],
  { name: 'email', component: Input, label: 'Email' }
]
```

```vue
// With dividers between sections
import { FORM_DIVIDER } from 'vuiii'

const fields: FormFieldOrRow<UserData>[] = [
  { name: 'name', component: Input, label: 'Name' },
  FORM_DIVIDER,
  { name: 'email', component: Input, label: 'Email' }
]
```

```vue
// With validation results from useValidation
const { validatedFields, validate } = useValidation(data, validationRules)

<FormFields
  :fields="fields"
  v-model="data"
  :validation-results="validatedFields"
/>
```

::: tip Storybook
For interactive examples with all variants, see [FormFields in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-formfields--docs).
:::
