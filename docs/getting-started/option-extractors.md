# Option Extractors

Several VUIII components accept an `options` prop for displaying selectable items. These components support flexible option formats through **option extractors** - props that tell the component how to extract values, labels, and other properties from your data.

## Components Using Option Extractors

- [Select](/components/select)
- [Autocomplete](/components/autocomplete)
- [RadioGroup](/components/radio-group)
- [CheckboxGroup](/components/checkbox-group)
- [RadioButtonGroup](/components/radio-button-group)

## Supported Option Formats

### Primitive Array

The simplest format - value and label are identical.

```typescript
const options = ['Apple', 'Banana', 'Cherry']
// or
const options = [1, 2, 3, 4, 5]
```

```vue
<Select v-model="fruit" :options="['Apple', 'Banana', 'Cherry']" />
```

### Object Array

Use extractor props to specify which properties to use for value and label.

```typescript
const countries = [
  { code: 'us', name: 'United States' },
  { code: 'uk', name: 'United Kingdom' },
  { code: 'de', name: 'Germany' }
]
```

```vue
<Select
  v-model="country"
  :options="countries"
  option-value="code"
  option-label="name"
/>
```

### Key-Value Object

Keys become values, values become labels.

```typescript
const statuses = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived'
}
```

```vue
<Select v-model="status" :options="statuses" />
<!-- Selecting "Published" sets status to "published" -->
```

### Grouped Options

For Select and Autocomplete only. Creates `<optgroup>` elements.

```typescript
const vehicles = [
  {
    category: 'Cars',
    items: [
      { id: 1, name: 'Sedan' },
      { id: 2, name: 'SUV' }
    ]
  },
  {
    category: 'Bikes',
    items: [
      { id: 3, name: 'Mountain' },
      { id: 4, name: 'Road' }
    ]
  }
]
```

```vue
<Select
  v-model="vehicle"
  :options="vehicles"
  group-label="category"
  group-options="items"
  option-value="id"
  option-label="name"
/>
```

## Extractor Props Reference

| Prop | Type | Description | Components |
|------|------|-------------|------------|
| `option-value` | `string \| Function` | Extracts the value from each option | All |
| `option-label` | `string \| Function` | Extracts the display label | All |
| `option-disabled` | `string \| Function` | Determines if option is disabled | All |
| `option-description` | `string \| Function` | Extracts description/helper text | RadioGroup, CheckboxGroup, Autocomplete, RadioButtonGroup |
| `option-icon` | `string \| Function` | Extracts icon name | Autocomplete, RadioButtonGroup |
| `group-label` | `string \| Function` | Extracts group label | Select, Autocomplete |
| `group-options` | `string \| Function` | Extracts array of options from group | Select, Autocomplete |

## Using Function Extractors

For complex extraction logic, use functions instead of property keys.

```vue
<Select
  v-model="userId"
  :options="users"
  :option-value="(user) => user.id"
  :option-label="(user) => `${user.firstName} ${user.lastName}`"
  :option-disabled="(user) => user.status === 'inactive'"
/>
```

```vue
<CheckboxGroup
  v-model="selectedIds"
  :options="items"
  :option-label="(item) => item.name.toUpperCase()"
  :option-description="(item) => `ID: ${item.id} - ${item.category}`"
/>
```

## Value Type Parsing

By default, option values are strings. Use the `type` prop to parse values as different types.

```vue
<!-- Values will be numbers -->
<Select
  v-model="count"
  :options="[{ id: 1, name: 'One' }, { id: 2, name: 'Two' }]"
  option-value="id"
  option-label="name"
  type="number"
/>

<!-- Values will be booleans -->
<RadioGroup
  v-model="enabled"
  :options="[
    { value: true, label: 'Enabled' },
    { value: false, label: 'Disabled' }
  ]"
  option-value="value"
  option-label="label"
  type="boolean"
/>
```

Supported types: `string` (default), `number`, `boolean`, `date`

## Complete Example

```vue
<script setup>
import { ref } from 'vue'
import { Select, CheckboxGroup, RadioGroup } from 'vuiii'

const users = [
  { id: 1, firstName: 'John', lastName: 'Doe', role: 'admin', active: true },
  { id: 2, firstName: 'Jane', lastName: 'Smith', role: 'user', active: true },
  { id: 3, firstName: 'Bob', lastName: 'Wilson', role: 'user', active: false }
]

const selectedUser = ref(null)
const selectedRoles = ref([])
</script>

<template>
  <Select
    v-model="selectedUser"
    :options="users"
    :option-value="(u) => u.id"
    :option-label="(u) => `${u.firstName} ${u.lastName}`"
    :option-disabled="(u) => !u.active"
    type="number"
    placeholder="Select a user"
  />

  <CheckboxGroup
    v-model="selectedRoles"
    :options="[
      { value: 'admin', label: 'Administrator', desc: 'Full access' },
      { value: 'user', label: 'User', desc: 'Limited access' },
      { value: 'guest', label: 'Guest', desc: 'Read only' }
    ]"
    option-value="value"
    option-label="label"
    option-description="desc"
  />
</template>
```
