# Autocomplete

Autocomplete input with dropdown suggestions and keyboard navigation.
Supports custom option rendering, filtering, and various data formats.

::: tip Shared option API
Accepts the shared option formats — primitive arrays, object arrays with extractors, key-value objects and groups. See [Option Extractors](/getting-started/option-extractors).
:::

## Import

```typescript
import { Autocomplete } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Autocomplete } from '../../src'
</script>

<ComponentDemo storybook="components-autocomplete--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage with string array import { Autocomplete } from 'vuiii'

<Autocomplete v-model="search" :options="['Apple', 'Banana', 'Cherry']" />
```

## Props

| Prop                 | Type                                       | Default    | Description                                    |
| -------------------- | ------------------------------------------ | ---------- | ---------------------------------------------- |
| `modelValue`         | `string`                                   | `''`       | Input text value (`v-model`)                   |
| `options`            | `T[] \| Record<string, any>`               | -          | Options to display in the dropdown             |
| `optionLabel`        | `string \| ((item) => any)`                | -          | Key or function to extract the display label   |
| `optionValue`        | `string \| ((item) => any)`                | -          | Key or function to extract the option value    |
| `optionDisabled`     | `string \| ((item) => any)`                | -          | Key or function to mark an option as disabled  |
| `optionDescription`  | `string \| ((item) => any)`                | -          | Key or function to extract description text     |
| `optionIcon`         | `string \| ((item) => any)`                | -          | Key or function to extract the icon name       |
| `groupLabel`         | `string \| ((item) => any)`                | -          | Key or function to extract a group's label     |
| `groupOptions`       | `string \| ((item) => any)`                | -          | Key or function to extract a group's options   |
| `placeholder`        | `string`                                   | -          | Input placeholder text                         |
| `disabled`           | `boolean`                                  | `false`    | Disables the input                             |
| `size`               | `'small' \| 'normal' \| 'large'`           | `'normal'` | Input size                                     |
| `invalid`            | `boolean`                                  | `false`    | Shows the invalid/error styling                |
| `pill`               | `boolean`                                  | `false`    | Rounded pill shape                             |
| `prefixIcon`         | `string`                                   | -          | Icon name to show before the input             |
| `suffixIcon`         | `string`                                   | -          | Icon name to show after the input              |
| `filter`             | `(option: Option, query: string) => boolean` | -        | Custom filter function                         |
| `dropdownPlacement`  | `'left' \| 'right' \| 'center'`            | -          | Dropdown alignment relative to the input       |
| `inputClass`         | `any`                                      | -          | Class(es) applied to the native input element  |

## Slots

| Slot     | Description                                                       |
| -------- | ---------------------------------------------------------------- |
| `prefix` | Content before the input (replaces prefixIcon)                   |
| `suffix` | Content after the input (replaces suffixIcon)                    |
| `option` | Custom option rendering. Props: `{ option, index, isHighlighted }` |
| `optionGroup` | Custom group heading. Props: `{ label }`                    |

## Events

| Event               | Payload     | Description                     |
| ------------------- | ----------- | ------------------------------- |
| `select`            | `Option<T>` | When an option is selected      |
| `prefix-icon-click` | -           | When the prefix icon is clicked |
| `suffix-icon-click` | -           | When the suffix icon is clicked |

## More Examples

```vue
// With object options and extractors const users = [ { id: 1, name: 'John Doe', email: 'john@example.com' }, { id: 2,
name: 'Jane Smith', email: 'jane@example.com' } ]

<Autocomplete
  v-model="search"
  :options="users"
  option-label="name"
  option-value="id"
  option-description="email"
  @select="(option) => (selectedUser = option.data)"
/>
```

```vue
// With custom filter function const customFilter = (option, query) => { return option.label.startsWith(query) }

<Autocomplete v-model="search" :options="options" :filter="customFilter" />
```

```vue
// With custom option rendering
<Autocomplete v-model="search" :options="users" option-label="name">
  <template #option="{ option, isHighlighted }">
    <div :class="{ highlighted: isHighlighted }">
      <strong>{{ option.label }}</strong>
      <small>{{ option.description }}</small>
    </div>
  </template>
</Autocomplete>
```

## Grouped Options

Pass `group-label` and `group-options` to render the options under a heading per group. Filtering
still runs across every group, and a group whose options are all filtered out drops its heading
with them. Keyboard navigation steps over the options only — headings are never focusable.

```vue
<script setup>
const options = [
  { category: 'Fruits', items: [{ id: 1, name: 'Apple' }, { id: 2, name: 'Banana' }] },
  { category: 'Vegetables', items: [{ id: 3, name: 'Carrot' }] }
]
</script>

<template>
  <Autocomplete
    v-model="search"
    :options="options"
    group-label="category"
    group-options="items"
    option-value="id"
    option-label="name"
  />
</template>
```

Use the `optionGroup` slot to render the heading yourself:

```vue
<Autocomplete v-model="search" :options="options" group-label="category" group-options="items">
  <template #optionGroup="{ label }">
    <Icon name="folder" /> {{ label }}
  </template>
</Autocomplete>
```

::: warning Accessibility
Headings are rendered as presentational entries inside the listbox, so they are shown but not
announced — screen reader users hear the options without their group. Grouping is a visual aid
here; do not rely on it to convey meaning that the option labels do not already carry.
:::

::: tip Storybook
For interactive examples with all variants, see [Autocomplete in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-autocomplete--docs).
:::
