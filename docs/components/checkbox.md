# Checkbox

Checkbox input with toggle/switch variant and indeterminate state support.
Can be used standalone or within CheckboxGroup.

## Import

```typescript
import { Checkbox } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Checkbox } from '../../src'

const accepted = ref(false)
const enabled = ref(true)
const newsletter = ref(false)
const partial = ref(false)
const sized = ref(true)
</script>

<ComponentDemo storybook="components-checkbox--default">
  <Checkbox v-model="accepted" label="I accept the terms" />
</ComponentDemo>

```vue
<Checkbox v-model="accepted" label="I accept the terms" />
```

## Props

| Prop            | Type                             | Default    | Description                                        |
| --------------- | -------------------------------- | ---------- | -------------------------------------------------- |
| `modelValue`    | `any`                            | -          | Checked state (`v-model`)                          |
| `required`      | `boolean`                        | `false`    | Shows a required indicator                         |
| `disabled`      | `boolean`                        | `false`    | Disables the checkbox                              |
| `readonly`      | `boolean`                        | `false`    | Shows the value, but blocks toggling it            |
| `invalid`       | `boolean`                        | `false`    | Renders the validation error state                 |
| `switch`        | `boolean`                        | `false`    | Renders as a toggle/switch                         |
| `indeterminate` | `boolean`                        | `false`    | Shows the indeterminate state                      |
| `label`         | `string`                         | -          | Label text (alternative to default slot)           |
| `description`   | `string`                         | -          | Additional description text below the label        |
| `size`          | `'small' \| 'normal' \| 'large'` | `'normal'` | Checkbox size                                      |
| `valueParser`   | `ValueParser<boolean>`           | -          | Custom parser to map the checked state to a value  |

## Slots

| Slot      | Description                                                              |
| --------- | ----------------------------------------------------------------------- |
| `default` | Label content (alternative to label prop)                               |
| `symbol`  | Custom checkbox/switch symbol. Props: `{ checked, disabled, indeterminate, invalid, size }` |

## Events

The Checkbox exposes its checked state through `v-model` (`update:modelValue`). It emits no other
custom events.

## Switch Variant

The `switch` prop restyles the same control as a toggle. It stays a native checkbox underneath, so
keyboard behaviour and form semantics are unchanged — pick it when the setting takes effect
immediately rather than on submit.

<ComponentDemo storybook="components-checkbox--switch">
  <Checkbox v-model="enabled" switch label="Enable notifications" />
</ComponentDemo>

```vue
<Checkbox v-model="enabled" switch label="Enable notifications" />
```

## With a Description

<ComponentDemo>
  <Checkbox v-model="newsletter" label="Subscribe to newsletter" description="Get weekly updates about new features" />
</ComponentDemo>

```vue
<Checkbox v-model="newsletter" label="Subscribe to newsletter" description="Get weekly updates about new features" />
```

## Indeterminate

Use `indeterminate` for a parent checkbox whose children are partly selected. It is a visual state
only — the bound value stays whatever it was, so drive it from your own logic.

<ComponentDemo>
  <Checkbox v-model="partial" indeterminate label="Some permissions selected" />
</ComponentDemo>

```vue
<Checkbox
  v-model="allSelected"
  :indeterminate="someSelected && !allSelected"
  label="Select all"
/>
```

## Sizes

<ComponentDemo>
  <div style="display: flex; flex-flow: column; gap: 0.75rem;">
    <Checkbox v-model="sized" size="small" label="Small" />
    <Checkbox v-model="sized" size="normal" label="Normal" />
    <Checkbox v-model="sized" size="large" label="Large" />
  </div>
</ComponentDemo>

```vue
<Checkbox v-model="value" size="small" label="Small" />
<Checkbox v-model="value" size="normal" label="Normal" />
<Checkbox v-model="value" size="large" label="Large" />
```

## Required and Disabled

<ComponentDemo>
  <div style="display: flex; flex-flow: column; gap: 0.75rem;">
    <Checkbox v-model="accepted" required label="I agree to the terms" />
    <Checkbox :model-value="true" disabled label="Managed by your administrator" />
  </div>
</ComponentDemo>

```vue
<Checkbox v-model="terms" required label="I agree to the terms" />
<Checkbox :model-value="true" disabled label="Managed by your administrator" />
```

## Multiple Checkboxes

For a list of options driven by data, reach for
[CheckboxGroup](/components/checkbox-group) instead of repeating `Checkbox` by hand — it
normalizes the options and emits an array.

::: tip Storybook
For interactive examples with all variants, see [Checkbox in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-checkbox--docs).
:::
