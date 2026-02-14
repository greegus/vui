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

<ComponentDemo storybook="example-tooltip--default">
  <Tooltip label="This is a tooltip">
    <Button label="Hover me" variant="secondary" />
  </Tooltip>
</ComponentDemo>

```vue
<Tooltip label="This is a tooltip">
  <Button label="Hover me" />
</Tooltip>
```

## Placement

Use the `placement` prop to control where the tooltip appears relative to the trigger.

<ComponentDemo storybook="example-tooltip--placements">
  <div style="display: flex; gap: 48px; align-items: center;">
    <Tooltip label="Top" placement="top">
      <Button label="Top" variant="secondary" />
    </Tooltip>
    <Tooltip label="Bottom" placement="bottom">
      <Button label="Bottom" variant="secondary" />
    </Tooltip>
    <Tooltip label="Left" placement="left">
      <Button label="Left" variant="secondary" />
    </Tooltip>
    <Tooltip label="Right" placement="right">
      <Button label="Right" variant="secondary" />
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

<ComponentDemo storybook="example-tooltip--with-arrow">
  <Tooltip label="Tooltip with arrow" withArrow>
    <Button label="Hover me" variant="secondary" />
  </Tooltip>
</ComponentDemo>

```vue
<Tooltip label="Tooltip with arrow" withArrow>
  <Button label="Hover me" />
</Tooltip>
```

## With Delay

Use the `delay` prop (in milliseconds) to delay showing the tooltip on hover. Moving the mouse away before the delay cancels the tooltip.

```vue
<Tooltip label="Delayed tooltip" :delay="500">
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

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Text content of the tooltip |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position of the tooltip relative to the trigger |
| `withArrow` | `boolean` | `false` | Show an arrow pointing towards the trigger |
| `delay` | `number` | — | Delay in milliseconds before showing the tooltip on hover |
| `offset` | `number` | — | Gap in pixels between the trigger and tooltip (overrides default 4px) |
| `showOnFocus` | `boolean` | `false` | Also show the tooltip when the trigger receives focus |

## Slots

| Slot | Description |
|------|-------------|
| `default` | The trigger content that the tooltip wraps |
| `label` | Custom tooltip label content (alternative to `label` prop) |

::: tip Storybook
For interactive examples with all variants, see [Tooltip in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-tooltip--docs).
:::
