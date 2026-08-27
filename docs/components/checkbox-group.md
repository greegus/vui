# CheckboxGroup

Group of checkboxes for multi-select from a list of options.
Normalizes various option formats and supports custom value parsing.

::: tip Shared option API
Accepts the shared option formats — primitive arrays, object arrays with extractors and key-value objects. See [Option Extractors](/getting-started/option-extractors).
:::

## Import

```typescript
import { CheckboxGroup } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { CheckboxGroup } from '../../src'

const selectedFruits = ref(['Apple'])
const selectedPermissions = ref(['read'])
const selectedInline = ref([])
const selectedIds = ref([1])

const permissions = [
  { id: 'read', name: 'Read', info: 'View content' },
  { id: 'write', name: 'Write', info: 'Edit content' },
  { id: 'delete', name: 'Delete', info: 'Remove content' },
]
</script>

<ComponentDemo storybook="components-checkboxgroup--default">
  <CheckboxGroup v-model="selectedFruits" :options="['Apple', 'Banana', 'Cherry']" />
</ComponentDemo>

```vue
<CheckboxGroup v-model="selectedFruits" :options="['Apple', 'Banana', 'Cherry']" />
```

The model is always an array holding the values of the checked options.

## Props

| Prop                | Type                                            | Default | Description                                     |
| ------------------- | ----------------------------------------------- | ------- | ----------------------------------------------- |
| `modelValue`        | `any[]`                                          | -       | Array of selected values (`v-model`)            |
| `options`           | `any[] \| Record<string, any>`                  | -       | Options to render as checkboxes                 |
| `optionLabel`       | `string \| ((item) => any)`                     | -       | Key or function to extract the display label    |
| `optionValue`       | `string \| ((item) => any)`                     | -       | Key or function to extract the option value     |
| `optionDisabled`    | `string \| ((item) => any)`                     | -       | Key or function to mark an option as disabled   |
| `optionDescription` | `string \| ((item) => any)`                     | -       | Key or function to extract description text      |
| `valueParser`       | `ValueParser`                                   | -       | Custom parser for option values                 |
| `type`              | `'string' \| 'number' \| 'boolean' \| 'date'`   | -       | Type used to parse option values                |
| `disabled`          | `boolean`                                        | `false` | Disables every checkbox in the group            |
| `readonly`          | `boolean`                                        | `false` | Shows the selection, but blocks changing it     |
| `required`          | `boolean`                                        | `false` | Marks the group as required                     |
| `invalid`           | `boolean`                                        | `false` | Renders the validation error state              |
| `inline`            | `boolean`                                        | `false` | Renders checkboxes horizontally                 |
| `size`              | `'small' \| 'normal' \| 'large'`                 | `'normal'` | Checkbox size                                |

## Slots

| Slot      | Description                                          |
| --------- | --------------------------------------------------- |
| `default` | Reserved default slot                               |
| `symbol`  | Custom checkbox symbol. Props: `{ checked, disabled, invalid }` |

## Events

The CheckboxGroup exposes the selected values through `v-model` (`update:modelValue`). It emits no
other custom events.

## With Descriptions

<ComponentDemo>
  <CheckboxGroup
    v-model="selectedPermissions"
    :options="permissions"
    option-value="id"
    option-label="name"
    option-description="info"
  />
</ComponentDemo>

```vue
<script setup>
const permissions = [
  { id: 'read', name: 'Read', info: 'View content' },
  { id: 'write', name: 'Write', info: 'Edit content' },
  { id: 'delete', name: 'Delete', info: 'Remove content' },
]
</script>

<template>
  <CheckboxGroup
    v-model="selectedPermissions"
    :options="permissions"
    option-value="id"
    option-label="name"
    option-description="info"
  />
</template>
```

## Inline Layout

<ComponentDemo>
  <CheckboxGroup v-model="selectedInline" :options="['Option A', 'Option B', 'Option C']" inline />
</ComponentDemo>

```vue
<CheckboxGroup v-model="selected" :options="['Option A', 'Option B', 'Option C']" inline />
```

## Typed Values

`type` applies to every entry of the array, so a numeric model stays numeric both ways — the emitted
values and the ones matched against the options.

<ComponentDemo>
  <CheckboxGroup
    v-model="selectedIds"
    :options="[{ id: 1, name: 'One' }, { id: 2, name: 'Two' }, { id: 3, name: 'Three' }]"
    option-value="id"
    option-label="name"
    type="number"
    inline
  />
</ComponentDemo>

```vue
<!-- selectedIds is number[], and a model of [1] checks the first option -->
<CheckboxGroup
  v-model="selectedIds"
  :options="[
    { id: 1, name: 'One' },
    { id: 2, name: 'Two' },
  ]"
  option-value="id"
  option-label="name"
  type="number"
/>
```

## Disabled Options

<ComponentDemo>
  <CheckboxGroup
    :model-value="[]"
    :options="[{ id: 'a', name: 'Available' }, { id: 'b', name: 'Locked', locked: true }]"
    option-value="id"
    option-label="name"
    option-disabled="locked"
  />
</ComponentDemo>

```vue
<CheckboxGroup
  v-model="selected"
  :options="options"
  option-value="id"
  option-label="name"
  option-disabled="locked"
/>
```

## A Single Checkbox

For one standalone boolean, use [Checkbox](/components/checkbox) — it binds a boolean rather than an
array.

::: tip Storybook
For interactive examples with all variants, see [CheckboxGroup in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-checkboxgroup--docs).
:::
