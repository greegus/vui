# Select

Native select dropdown with support for various option formats and type parsing.
Normalizes arrays, objects, and grouped options into a consistent format.

::: tip Shared option API
Accepts the shared option formats — primitive arrays, object arrays with extractors, key-value objects and groups. See [Option Extractors](/getting-started/option-extractors).
:::

## Import

```typescript
import { Select } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Select } from '../../src'

const color = ref('Green')
const country = ref()
const status = ref('draft')
const vehicle = ref()
const quantity = ref(2)

const countries = [
  { code: 'us', name: 'United States' },
  { code: 'uk', name: 'United Kingdom' },
]

const statuses = { draft: 'Draft', published: 'Published', archived: 'Archived' }

const vehicles = [
  { category: 'Cars', items: [{ id: 1, name: 'Sedan' }, { id: 2, name: 'SUV' }] },
  { category: 'Bikes', items: [{ id: 3, name: 'Mountain' }, { id: 4, name: 'Road' }] },
]
</script>

<ComponentDemo storybook="components-select--default">
  <Select v-model="color" :options="['Red', 'Green', 'Blue']" />
</ComponentDemo>

```vue
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

## Object Options

Point `option-value` and `option-label` at the properties to use. `placeholder` adds a leading empty
option, which is how you offer "nothing selected".

<ComponentDemo>
  <Select v-model="country" :options="countries" option-value="code" option-label="name" placeholder="Select a country" />
</ComponentDemo>

```vue
<script setup>
const countries = [
  { code: 'us', name: 'United States' },
  { code: 'uk', name: 'United Kingdom' },
]
</script>

<template>
  <Select
    v-model="country"
    :options="countries"
    option-value="code"
    option-label="name"
    placeholder="Select a country"
  />
</template>
```

## Key-Value Options

A plain object needs no extractors — keys become values, values become labels. Handy for enums.

<ComponentDemo>
  <Select v-model="status" :options="statuses" />
</ComponentDemo>

```vue
<script setup>
const statuses = { draft: 'Draft', published: 'Published', archived: 'Archived' }
</script>

<template>
  <Select v-model="status" :options="statuses" />
</template>
```

## Grouped Options

`group-label` and `group-options` render native `<optgroup>` elements.

<ComponentDemo>
  <Select
    v-model="vehicle"
    :options="vehicles"
    group-label="category"
    group-options="items"
    option-value="id"
    option-label="name"
    placeholder="Pick a vehicle"
  />
</ComponentDemo>

```vue
<script setup>
const vehicles = [
  { category: 'Cars', items: [{ id: 1, name: 'Sedan' }, { id: 2, name: 'SUV' }] },
  { category: 'Bikes', items: [{ id: 3, name: 'Mountain' }, { id: 4, name: 'Road' }] },
]
</script>

<template>
  <Select
    v-model="vehicle"
    :options="vehicles"
    group-label="category"
    group-options="items"
    option-value="id"
    option-label="name"
  />
</template>
```

## Typed Values

A native select always reports a string. `type` parses the value back, so the model keeps the type
your options actually had.

<ComponentDemo>
  <Select v-model="quantity" :options="[1, 2, 3, 4, 5]" type="number" />
</ComponentDemo>

```vue
<!-- quantity is a number, not '2' -->
<Select v-model="quantity" :options="[1, 2, 3, 4, 5]" type="number" />
```

## Sizes and Validation State

<ComponentDemo>
  <div style="display: flex; flex-flow: column; gap: 0.75rem; width: 100%;">
    <Select :options="['Red', 'Green']" size="small" />
    <Select :options="['Red', 'Green']" size="large" />
    <Select :options="['Red', 'Green']" invalid />
    <Select :options="['Red', 'Green']" disabled />
  </div>
</ComponentDemo>

```vue
<Select v-model="color" :options="colors" size="small" />
<Select v-model="color" :options="colors" :invalid="!!errors.color" />
<Select v-model="color" :options="colors" disabled />
```

::: tip Storybook
For interactive examples with all variants, see [Select in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-select--docs).
:::
