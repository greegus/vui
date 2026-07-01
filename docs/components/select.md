# Select

Native select dropdown with support for various option formats and type parsing.
Normalizes arrays, objects, and grouped options into a consistent format.

## Import

```typescript
import { Select } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Select } from '../../src'
</script>

<ComponentDemo storybook="components-select--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage with string array import { Select } from 'vuiii'

<Select v-model="color" :options="['Red', 'Green', 'Blue']" />
```

## Props

| Prop             | Type                                          | Default    | Description                                        |
| ---------------- | --------------------------------------------- | ---------- | ------------------------------------------------- |
| `modelValue`     | `any`                                         | -          | Selected value (use with `v-model`)               |
| `options`        | `any[] \| Record<string, any>`                | -          | Options to display (see Option Parsing)           |
| `optionLabel`    | `string \| ((item) => any)`                   | -          | Key or function to extract the display label      |
| `optionValue`    | `string \| ((item) => any)`                   | -          | Key or function to extract the option value       |
| `optionDisabled` | `string \| ((item) => any)`                   | -          | Key or function to determine if option is disabled |
| `groupLabel`     | `string \| ((item) => any)`                   | -          | Key or function to extract the group label        |
| `groupOptions`   | `string \| ((item) => any)`                   | -          | Key or function to extract the group's options    |
| `valueParser`    | `ValueParser<string>`                         | -          | Custom parser to serialize/deserialize the value  |
| `type`           | `'string' \| 'number' \| 'boolean' \| 'date'` | `'string'` | Built-in value type parsing                       |
| `placeholder`    | `string`                                      | -          | Placeholder option text                           |
| `size`           | `'small' \| 'normal' \| 'large'`              | `'normal'` | Select size                                       |
| `required`       | `boolean`                                     | `false`    | Marks the select as required                      |
| `invalid`        | `boolean`                                     | `false`    | Applies the invalid/error styling                 |
| `disabled`       | `boolean`                                     | `false`    | Disables the select                               |
| `pill`           | `boolean`                                     | `false`    | Rounded pill shape                                |
| `inputClass`     | `any`                                         | -          | Class applied to the nested `<select>` element    |

## Events

The Select uses `v-model` and emits no custom events.

## More Examples

```vue
// With object array and extractors const countries = [ { code: 'us', name: 'United States' }, { code: 'uk', name:
'United Kingdom' } ]

<Select v-model="country" :options="countries" option-value="code" option-label="name" placeholder="Select a country" />
```

```vue
// With key-value object options const statuses = { draft: 'Draft', published: 'Published', archived: 'Archived' }

<Select v-model="status" :options="statuses" />
```

```vue
// With grouped options (optgroup) const vehicles = [ { category: 'Cars', items: [{ id: 1, name: 'Sedan' }, { id: 2,
name: 'SUV' }] }, { category: 'Bikes', items: [{ id: 3, name: 'Mountain' }, { id: 4, name: 'Road' }] } ]

<Select
  v-model="vehicle"
  :options="vehicles"
  group-label="category"
  group-options="items"
  option-value="id"
  option-label="name"
/>
```

::: tip Storybook
For interactive examples with all variants, see [Select in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-select--docs).
:::
