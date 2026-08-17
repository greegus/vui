# IconButton

Icon-only button. A thin `Button` wrapper for actions that need no label.

## Import

```typescript
import { IconButton } from 'vuiii'
```

## Basic Usage

<script setup>
import { IconButton } from '../../src'
</script>

<ComponentDemo storybook="components-iconbutton--default">
  <IconButton icon="pencil" title="Edit" />
  <IconButton icon="trash" color="danger" title="Delete" />
</ComponentDemo>

```vue
<IconButton icon="pencil" title="Edit" @click="edit()" />
<IconButton icon="trash" color="danger" title="Delete" @click="remove()" />
```

## Props

`IconButton` accepts every [Button](/components/button) prop except `prefixIcon`, `suffixIcon`,
`label` and `block`, plus:

| Prop    | Type     | Default | Description                                              |
| ------- | -------- | ------- | -------------------------------------------------------- |
| `icon`  | `string` | -       | Icon name, resolved like any [Icon](/components/icon)     |
| `title` | `string` | -       | Native tooltip, also used as the button's `aria-label`   |

::: warning Always pass a title
The button has no text, so without `title` there is nothing for a screen reader to announce. It
fills both the `title` attribute and `aria-label`.
:::

## Events

Forwards `click`, along with the other native events, to the rendered element.

## Colors

<ComponentDemo>
  <IconButton icon="plus" color="primary" title="Add" />
  <IconButton icon="check" color="success" title="Confirm" />
  <IconButton icon="pencil" color="secondary" title="Edit" />
  <IconButton icon="x" color="danger" title="Remove" />
</ComponentDemo>

```vue
<IconButton icon="plus" color="primary" title="Add" />
<IconButton icon="check" color="success" title="Confirm" />
<IconButton icon="pencil" color="secondary" title="Edit" />
<IconButton icon="x" color="danger" title="Remove" />
```

## Variants

<ComponentDemo>
  <IconButton icon="pencil" color="primary" variant="filled" title="Edit" />
  <IconButton icon="pencil" color="primary" variant="outlined" title="Edit" />
  <IconButton icon="pencil" color="primary" variant="text" title="Edit" />
</ComponentDemo>

```vue
<IconButton icon="pencil" color="primary" variant="filled" title="Edit" />
<IconButton icon="pencil" color="primary" variant="outlined" title="Edit" />
<IconButton icon="pencil" color="primary" variant="text" title="Edit" />
```

## Sizes

<ComponentDemo>
  <IconButton icon="search" size="small" title="Search" />
  <IconButton icon="search" size="normal" title="Search" />
  <IconButton icon="search" size="large" title="Search" />
</ComponentDemo>

```vue
<IconButton icon="search" size="small" title="Search" />
<IconButton icon="search" size="normal" title="Search" />
<IconButton icon="search" size="large" title="Search" />
```

## Loading and Disabled

`loading` swaps the icon for a spinner and disables the button; `disabled` does so without the
spinner. Both apply the real `disabled` attribute, so neither can be clicked or focused.

<ComponentDemo>
  <IconButton icon="trash" loading title="Deleting" />
  <IconButton icon="trash" disabled title="Delete" />
</ComponentDemo>

```vue
<IconButton icon="trash" :loading="isDeleting" title="Delete" />
<IconButton icon="trash" disabled title="Delete" />
```

## In a Table Row

The usual home for icon buttons — `Table`'s `rowOptions` slot.

```vue
<Table :items="users" :columns="columns">
  <template #rowOptions="{ item }">
    <IconButton icon="pencil" title="Edit" @click="edit(item)" />
    <IconButton icon="trash" color="danger" title="Delete" @click="remove(item)" />
  </template>
</Table>
```

::: tip Storybook
For interactive examples with all variants, see [IconButton in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-iconbutton--docs).
:::
