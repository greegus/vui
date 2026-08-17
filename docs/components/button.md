# Button

Polymorphic button component that renders as `<button>`, `<a>`, or `<router-link>`.
Supports color palettes, render variants, sizes, icons, and loading states.

## Import

```typescript
import { Button } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Button } from '../../src'
</script>

<ComponentDemo storybook="components-button--default">
  <Button label="Click me" />
  <Button color="primary" label="Submit" />
  <Button color="danger" label="Delete" />
</ComponentDemo>

```vue
import { Button } from 'vuiii'

<Button label="Click me" />
<Button color="primary" label="Submit" />
<Button color="danger" label="Delete" />
```

## Props

| Prop         | Type                                                     | Default       | Description                              |
| ------------ | -------------------------------------------------------- | ------------- | ---------------------------------------- |
| `label`      | `string`                                                 | -             | Button text content                      |
| `color`      | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'accent'` | `'secondary'` | Color palette                            |
| `variant`    | `'filled' \| 'outlined' \| 'text'`                       | `'filled'`    | Render style                             |
| `size`       | `'small' \| 'normal' \| 'large'`                         | `'normal'`    | Button size                              |
| `prefixIcon` | `string`                                                 | -             | Icon name to show before label           |
| `suffixIcon` | `string`                                                 | -             | Icon name to show after label            |
| `loading`    | `boolean`                                                | `false`       | Shows spinner and disables button        |
| `disabled`   | `boolean`                                                | `false`       | Disables the button                      |
| `block`      | `boolean`                                                | `false`       | Full width button                        |
| `pill`       | `boolean`                                                | `false`       | Rounded pill shape                       |
| `type`       | `'button' \| 'submit' \| 'reset'`                        | `'button'`    | Native button type                       |
| `to`         | `RouteLocationRaw`                                        | -             | Vue Router link (renders as router-link) |
| `href`       | `string`                                                 | -             | External URL (renders as anchor)         |

::: tip Color vs variant
`color` picks the palette, `variant` decides how it is drawn — `filled` (solid background),
`outlined` (transparent with a colored border) or `text` (no background or border). `accent` defaults
to the primary color and is meant for selection-style emphasis.
:::

## Slots

| Slot      | Description                                       |
| --------- | ------------------------------------------------- |
| `default` | Button label content (alternative to label prop)  |
| `prefix`  | Custom prefix content (replaces prefixIcon)       |
| `suffix`  | Custom suffix content (replaces suffixIcon)       |

## Events

The Button forwards native events (`click`, etc.) to the rendered element (`<button>`, `<a>`, or
`<router-link>`). It emits no custom events.

## More Examples

### Colors

<ComponentDemo>
  <Button color="primary" label="Primary" />
  <Button color="secondary" label="Secondary" />
  <Button color="success" label="Success" />
  <Button color="danger" label="Danger" />
</ComponentDemo>

```vue
<Button color="primary" label="Primary" />
<Button color="secondary" label="Secondary" />
<Button color="success" label="Success" />
<Button color="danger" label="Danger" />
```

### Variants

<ComponentDemo>
  <Button color="primary" variant="filled" label="Filled" />
  <Button color="primary" variant="outlined" label="Outlined" />
  <Button color="primary" variant="text" label="Text" />
</ComponentDemo>

```vue
<Button color="primary" variant="filled" label="Filled" />
<Button color="primary" variant="outlined" label="Outlined" />
<Button color="primary" variant="text" label="Text" />
```

### With Icons

<ComponentDemo>
  <Button prefixIcon="plus" label="Add Item" />
  <Button label="Download" suffixIcon="arrow-narrow-down" />
  <Button prefixIcon="check" suffixIcon="chevron-down" label="Save" />
</ComponentDemo>

```vue
<Button prefixIcon="plus" label="Add Item" />
<Button label="Download" suffixIcon="arrow-narrow-down" />
<Button prefixIcon="check" suffixIcon="chevron-down" label="Save" />
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
  <Button :to="'/about'" label="About" color="secondary" />
</ComponentDemo>

```vue
<Button :to="{ name: 'home' }" label="Go Home" />
<Button :to="'/about'" label="About" color="secondary" />
```

::: tip Storybook
For interactive examples with all colors and variants, see [Button in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-button--docs).
:::
