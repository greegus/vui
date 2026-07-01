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
</script>

<ComponentDemo storybook="components-checkbox--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage import { Checkbox } from 'vuiii'

<Checkbox v-model="accepted" label="I accept the terms" />
```

## Props

| Prop            | Type                             | Default    | Description                                        |
| --------------- | -------------------------------- | ---------- | -------------------------------------------------- |
| `modelValue`    | `any`                            | -          | Checked state (`v-model`)                          |
| `required`      | `boolean`                        | `false`    | Shows a required indicator                         |
| `disabled`      | `boolean`                        | `false`    | Disables the checkbox                              |
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
| `symbol`  | Custom checkbox/switch symbol. Props: `{ checked, disabled, indeterminate, size }` |

## Events

The Checkbox exposes its checked state through `v-model` (`update:modelValue`). It emits no other
custom events.

## More Examples

```vue
// Switch variant (toggle)
<Checkbox v-model="enabled" switch label="Enable notifications" />
```

```vue
// With description
<Checkbox v-model="newsletter" label="Subscribe to newsletter" description="Get weekly updates about new features" />
```

```vue
// Required checkbox
<Checkbox v-model="terms" required label="I agree to the terms" />
```

::: tip Storybook
For interactive examples with all variants, see [Checkbox in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-checkbox--docs).
:::
