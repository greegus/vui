# Typography

Typography component for consistent text styling.
Automatically selects the appropriate HTML tag based on the variant.

## Import

```typescript
import { Typography } from 'vuiii'
```

## Basic Usage

<script setup>
import { Typography } from '../../src'
</script>

<ComponentDemo storybook="components-typography--default">
  <div>
    <Typography variant="display">Display Text</Typography>
    <Typography variant="heading1">Heading 1</Typography>
    <Typography variant="heading2">Heading 2</Typography>
    <Typography variant="body1">Body text paragraph</Typography>
    <Typography variant="caption">Small caption text</Typography>
  </div>
</ComponentDemo>

```vue
<Typography variant="display">Display Text</Typography>
<Typography variant="heading1">Heading 1</Typography>
<Typography variant="heading2">Heading 2</Typography>
<Typography variant="body1">Body text paragraph</Typography>
<Typography variant="caption">Small caption text</Typography>
```

## Props

| Prop      | Type                                                                                                                          | Default   | Description                        |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------- |
| `variant` | `'display' \| 'heading1'…'heading6' \| 'body1' \| 'body2' \| 'label' \| 'caption'`                                             | `'body1'` | Text style to apply                |
| `tag`     | `'h1'…'h6' \| 'p' \| 'span' \| 'div' \| 'caption'`                                                                            | -         | Overrides the tag the variant picks |

## Slots

| Slot      | Description   |
| --------- | ------------- |
| `default` | Text content  |

## Automatic Tag Selection

Each variant renders the semantically matching element, so the document outline follows the visual
hierarchy without you repeating yourself.

| Variant                  | Tag     |
| ------------------------ | ------- |
| `display`, `heading1`    | `h1`    |
| `heading2`…`heading6`    | `h2`…`h6` |
| `body1`, `body2`         | `p`     |
| `label`, `caption`       | `span`  |

```vue
<Typography variant="heading1">Renders as h1</Typography>
<Typography variant="body1">Renders as p</Typography>
<Typography variant="label">Renders as span</Typography>
```

## Overriding the Tag

Use `tag` when the visual weight and the document structure need to disagree — a section heading
that should look like a `heading1` but must stay an `h2` for the outline.

<ComponentDemo>
  <Typography variant="heading1" tag="h2">Styled as heading1, renders as h2</Typography>
</ComponentDemo>

```vue
<Typography variant="heading1" tag="h2">Styled as heading1, renders as h2</Typography>
```

## All Variants

<ComponentDemo>
  <div>
    <Typography variant="display">display</Typography>
    <Typography variant="heading1">heading1</Typography>
    <Typography variant="heading2">heading2</Typography>
    <Typography variant="heading3">heading3</Typography>
    <Typography variant="heading4">heading4</Typography>
    <Typography variant="heading5">heading5</Typography>
    <Typography variant="heading6">heading6</Typography>
    <Typography variant="body1">body1</Typography>
    <Typography variant="body2">body2</Typography>
    <Typography variant="label">label</Typography>
    <Typography variant="caption">caption</Typography>
  </div>
</ComponentDemo>

::: tip Design tokens
The sizes, weights and line heights come from CSS variables — see
[Typography tokens](/design-tokens/typography) to restyle them globally.
:::

::: tip Storybook
For interactive examples with all variants, see [Typography in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-typography--docs).
:::
