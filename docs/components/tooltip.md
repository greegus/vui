# Tooltip

Tooltip component that wraps content and shows a label on hover.
Uses CSS Anchor Positioning for placement relative to the trigger element.
Supports delay, focus trigger, arrow indicator, and custom label content via slot.

## Import

```typescript
import { Tooltip } from 'vuiii'
```

## Basic Usage

<script setup>
import { Tooltip, Button, Input } from '../../src'
</script>

<ComponentDemo storybook="components-tooltip--default">
  <Tooltip label="This is a tooltip">
    <Button label="Hover me" color="secondary" />
  </Tooltip>
</ComponentDemo>

```vue
<Tooltip label="This is a tooltip">
  <Button label="Hover me" />
</Tooltip>
```

## Placement

Use the `placement` prop to control where the tooltip appears relative to the trigger.

<ComponentDemo storybook="components-tooltip--placements">
  <div style="display: flex; gap: 48px; align-items: center;">
    <Tooltip label="Top" placement="top">
      <Button label="Top" color="secondary" />
    </Tooltip>
    <Tooltip label="Bottom" placement="bottom">
      <Button label="Bottom" color="secondary" />
    </Tooltip>
    <Tooltip label="Left" placement="left">
      <Button label="Left" color="secondary" />
    </Tooltip>
    <Tooltip label="Right" placement="right">
      <Button label="Right" color="secondary" />
    </Tooltip>
  </div>
</ComponentDemo>

```vue
<Tooltip label="Top tooltip" placement="top">
  <Button label="Top" />
</Tooltip>

<Tooltip label="Bottom tooltip" placement="bottom">
  <Button label="Bottom" />
</Tooltip>

<Tooltip label="Left tooltip" placement="left">
  <Button label="Left" />
</Tooltip>

<Tooltip label="Right tooltip" placement="right">
  <Button label="Right" />
</Tooltip>
```

## With Arrow

Add the `withArrow` prop to display an arrow pointing towards the trigger element.

<ComponentDemo storybook="components-tooltip--with-arrow">
  <Tooltip label="Tooltip with arrow" withArrow>
    <Button label="Hover me" color="secondary" />
  </Tooltip>
</ComponentDemo>

```vue
<Tooltip label="Tooltip with arrow" withArrow>
  <Button label="Hover me" />
</Tooltip>
```

## With Delay

Add the `delayed` flag to show the tooltip after a short default delay (the `--vuiii-tooltip-delay` token, 500ms). Moving the mouse away before the delay cancels the tooltip.

<ComponentDemo storybook="components-tooltip--delayed">
  <Tooltip label="Delayed tooltip" delayed>
    <Button label="Hover and wait" color="secondary" />
  </Tooltip>
</ComponentDemo>

```vue
<Tooltip label="Delayed tooltip" delayed>
  <Button label="Hover and wait" />
</Tooltip>
```

For a custom delay, use the `delay` prop (in milliseconds). It takes precedence over `delayed`.

```vue
<Tooltip label="Delayed tooltip" :delay="800">
  <Button label="Hover and wait" />
</Tooltip>
```

## Offset

Use the `offset` prop (in pixels) to adjust the gap between the trigger and the tooltip bubble.

```vue
<Tooltip label="Default gap" />

<Tooltip label="More space" :offset="12">
  <Button label="Hover me" />
</Tooltip>
```

## Custom Label Slot

Use the `#label` slot for rich tooltip content instead of plain text.

```vue
<Tooltip>
  <template #label>
    <strong>Rich</strong> tooltip content
  </template>
  <Button label="Hover me" />
</Tooltip>
```

## Show on Focus

Enable `showOnFocus` to also show the tooltip when the trigger element receives focus. Useful for accessibility.

```vue
<Tooltip label="Accessible tooltip" showOnFocus>
  <Input placeholder="Focus me" />
</Tooltip>
```

## Props

| Prop          | Type                                     | Default | Description                                                           |
| ------------- | ---------------------------------------- | ------- | --------------------------------------------------------------------- |
| `label`       | `string`                                 | —       | Text content of the tooltip                                           |
| `placement`   | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position of the tooltip relative to the trigger                       |
| `withArrow`   | `boolean`                                | `false` | Show an arrow pointing towards the trigger                            |
| `delayed`     | `boolean`                                | `false` | Show after a short default delay (`--vuiii-tooltip-delay`, 500ms)     |
| `delay`       | `number`                                 | —       | Explicit delay in milliseconds before showing (overrides `delayed`)   |
| `offset`      | `number`                                 | —       | Gap in pixels between the trigger and tooltip (overrides default 4px) |
| `showOnFocus` | `boolean`                                | `false` | Also show the tooltip when the trigger receives focus                 |

## Slots

| Slot      | Description                                                |
| --------- | ---------------------------------------------------------- |
| `default` | The trigger content that the tooltip wraps                 |
| `label`   | Custom tooltip label content (alternative to `label` prop) |

::: tip Storybook
For interactive examples with all variants, see [Tooltip in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-tooltip--docs).
:::
