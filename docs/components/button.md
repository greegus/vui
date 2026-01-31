# Button

Polymorphic button component that renders as `<button>`, `<a>`, or `<router-link>`.
Supports multiple variants, sizes, icons, and loading states.

## Import

```typescript
import { Button } from "vuiii";
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Button } from '../../src'
</script>

<ComponentDemo storybook="example-button--default">
  <Button label="Click me" />
  <Button variant="primary" label="Submit" />
  <Button variant="danger" label="Delete" />
</ComponentDemo>

```vue
import { Button } from 'vuiii'

<Button label="Click me" />
<Button variant="primary" label="Submit" />
<Button variant="danger" label="Delete" />
```

## Props

| Prop         | Type                                   | Default    | Description                              |
| ------------ | -------------------------------------- | ---------- | ---------------------------------------- |
| `label`      | `string`                               | -          | Button text content                      |
| `variant`    | `'primary' \| 'secondary' \| 'danger'` | -          | Visual style variant                     |
| `size`       | `'small' \| 'normal' \| 'large'`       | `'normal'` | Button size                              |
| `prefixIcon` | `string`                               | -          | Icon name to show before label           |
| `suffixIcon` | `string`                               | -          | Icon name to show after label            |
| `loading`    | `boolean`                              | `false`    | Shows spinner and disables button        |
| `disabled`   | `boolean`                              | `false`    | Disables the button                      |
| `outlined`   | `boolean`                              | `false`    | Outlined style (requires variant)        |
| `block`      | `boolean`                              | `false`    | Full width button                        |
| `pill`       | `boolean`                              | `false`    | Rounded pill shape                       |
| `type`       | `'button' \| 'submit' \| 'reset'`      | `'button'` | Native button type                       |
| `to`         | `RouteLocationRaw`                     | -          | Vue Router link (renders as router-link) |
| `href`       | `string`                               | -          | External URL (renders as anchor)         |

## Slots

| Slot      | Description                                      |
| --------- | ------------------------------------------------ |
| `default` | Button label content (alternative to label prop) |
| `prefix`  | Custom prefix content (replaces prefixIcon)      |
| `suffix`  | Custom suffix content (replaces suffixIcon)      |

## More Examples

### With Icons

<ComponentDemo>
  <Button prefixIcon="plus" label="Add Item" />
  <Button label="Download" suffixIcon="arrow-down" />
  <Button prefixIcon="save" suffixIcon="chevron-down" label="Save" />
</ComponentDemo>

```vue
<Button prefixIcon="plus" label="Add Item" />
<Button label="Download" suffixIcon="arrow-down" />
<Button prefixIcon="save" suffixIcon="chevron-down" label="Save" />
```

### Different Sizes

<ComponentDemo>
  <Button size="small" label="Small" />
  <Button size="normal" label="Normal" />
  <Button size="large" label="Large" />
</ComponentDemo>

```vue
<Button size="small" label="Small" />
<Button size="normal" label="Normal" />
<Button size="large" label="Large" />
```

### As Router Link

<ComponentDemo>
  <Button :to="'/'" label="Go Home" />
  <Button :to="'/about'" label="About" variant="secondary" />
</ComponentDemo>

```vue
<Button :to="{ name: 'home' }" label="Go Home" />
<Button :to="'/about'" label="About" variant="secondary" />
```

::: tip Storybook
For interactive examples with all variants, see [Button in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-button--docs).
:::
