# CheckboxGroup

Group of checkboxes for multi-select from a list of options.
Normalizes various option formats and supports custom value parsing.

## Import

```typescript
import { CheckboxGroup } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { CheckboxGroup } from '../../src'
</script>

<ComponentDemo storybook="components-checkboxgroup--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage with string array import { CheckboxGroup } from 'vuiii'

<CheckboxGroup v-model="selectedFruits" :options="['Apple', 'Banana', 'Cherry']" />
```

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
| `inline`            | `boolean`                                        | `false` | Renders checkboxes horizontally                 |

## Slots

| Slot      | Description                                          |
| --------- | --------------------------------------------------- |
| `default` | Reserved default slot                               |
| `symbol`  | Custom checkbox symbol. Props: `{ checked, disabled }` |

## Events

The CheckboxGroup exposes the selected values through `v-model` (`update:modelValue`). It emits no
other custom events.

## More Examples

```vue
// With object options and extractors const permissions = [ { id: 'read', name: 'Read', info: 'View content' }, { id:
'write', name: 'Write', info: 'Edit content' }, { id: 'delete', name: 'Delete', info: 'Remove content' } ]

<CheckboxGroup
  v-model="selectedPermissions"
  :options="permissions"
  option-value="id"
  option-label="name"
  option-description="info"
/>
```

```vue
// Inline layout (horizontal)
<CheckboxGroup v-model="selected" :options="['Option A', 'Option B', 'Option C']" inline />
```

```vue
// With type parsing (values will be numbers)
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

::: tip Storybook
For interactive examples with all variants, see [CheckboxGroup in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-checkboxgroup--docs).
:::
