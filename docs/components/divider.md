# Divider

Visual separator line for content sections.
Can be horizontal (default) or vertical.

## Import

```typescript
import { Divider } from 'vuiii'
```

## Basic Usage

<script setup>
import { Divider } from '../../src'
</script>

<ComponentDemo storybook="components-divider--default">
  <div style="width: 100%">
    <div>Section 1</div>
    <Divider />
    <div>Section 2</div>
  </div>
</ComponentDemo>

```vue
<div>Section 1</div>
<Divider />
<div>Section 2</div>
```

## Props

| Prop          | Type                          | Default        | Description        |
| ------------- | ----------------------------- | -------------- | ------------------ |
| `orientation` | `'horizontal' \| 'vertical'`  | `'horizontal'` | Separator direction |

## Vertical

A vertical divider takes its height from the flex row it sits in, so it needs a flex parent with
`align-items` set.

<ComponentDemo>
  <div style="display: flex; align-items: center;">
    <span>Item 1</span>
    <Divider orientation="vertical" />
    <span>Item 2</span>
    <Divider orientation="vertical" />
    <span>Item 3</span>
  </div>
</ComponentDemo>

```vue
<div style="display: flex; align-items: center">
  <span>Item 1</span>
  <Divider orientation="vertical" />
  <span>Item 2</span>
</div>
```

## In a Generated Form

`FormFields` renders a `Divider` wherever it finds the `FORM_DIVIDER` constant in the field list,
so you can separate sections without leaving the config array.

```ts
import { FORM_DIVIDER } from 'vuiii'

const fields = [
  { name: 'name', component: Input, label: 'Name' },
  FORM_DIVIDER,
  { name: 'email', component: Input, label: 'Email' },
]
```

See [Composing Forms](/getting-started/composing-forms) for the rest of the field config.

::: tip Storybook
For interactive examples with all variants, see [Divider in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-divider--docs).
:::
