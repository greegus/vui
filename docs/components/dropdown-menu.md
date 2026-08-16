# DropdownMenu

Menu component for use inside Dropdown. Displays a list of clickable items with keyboard navigation support.

## Import

```typescript
import { Dropdown, DropdownMenu } from 'vuiii'
```

## Basic Usage

<script setup>
import { Dropdown, DropdownMenu } from '../../src'

const menuItems = [
  { label: 'Edit', icon: 'pencil' },
  { label: 'Duplicate', icon: 'document-duplicate' },
  { label: 'Delete', icon: 'trash' }
]
</script>

<ComponentDemo>
  <Dropdown label="Actions">
    <DropdownMenu :items="menuItems" />
  </Dropdown>
</ComponentDemo>

```vue
<script setup>
const menuItems = [
  { label: 'Edit', icon: 'pencil' },
  { label: 'Duplicate', icon: 'document-duplicate' },
  { label: 'Delete', icon: 'trash' },
]
</script>

<template>
  <Dropdown label="Actions">
    <DropdownMenu :items="menuItems" @itemClick="handleClick" />
  </Dropdown>
</template>
```

## Custom Item Rendering

Use the `item` or `itemLabel` slot to customize how items are displayed:

```vue
<DropdownMenu :items="users">
  <template #item="{ item, index }">
    <div class="user-item">
      <Avatar :src="item.avatar" />
      <span>{{ item.name }}</span>
    </div>
  </template>
</DropdownMenu>
```

## Props

| Prop             | Type                                            | Description                                                        |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------------------ |
| `items`          | `Item[]`                                        | Array of menu items                                                |
| `cursorIndex`    | `number`                                        | Index of the currently highlighted item (for keyboard navigation)  |
| `itemDisabled`   | `(item, index) => boolean`                      | Marks an item unavailable: renders it disabled and emits no click  |
| `itemGroupLabel` | `(item, index) => string \| undefined`          | Groups consecutive items under a heading                           |
| `listRole`       | `'listbox' \| 'menu'`                           | ARIA role for the list element                                     |
| `listId`         | `string`                                        | Id of the list element, referenced by a combobox via `aria-controls` |
| `optionIdPrefix` | `string`                                        | Prefix for per-option ids, used for `aria-activedescendant`        |

## Slots

| Slot         | Description                                                            |
| ------------ | ---------------------------------------------------------------------- |
| `item`       | Replaces the whole item, button included. Props: `{ item, index, cursorIndex }` |
| `itemLabel`  | Replaces only the item's label, keeping the button. Props: `{ item, index, cursorIndex }` |
| `groupLabel` | Replaces a group heading. Props: `{ label }`                           |

## Events

| Event             | Payload           | Description                       |
| ----------------- | ----------------- | --------------------------------- |
| `item-click`      | `{ item, index }` | Emitted when an item is clicked   |
| `item-mouseenter` | `{ item, index }` | Emitted when mouse enters an item |
| `item-mouseleave` | `{ item, index }` | Emitted when mouse leaves an item |

## Disabled Items

`itemDisabled` receives each item and returns whether it is unavailable. Disabled items render as
natively disabled buttons, are marked `aria-disabled`, and emit no `item-click`.

```vue
<DropdownMenu :items="actions" :item-disabled="(action) => !action.allowed" @item-click="run" />
```

## Grouping

`itemGroupLabel` renders a heading wherever the label changes. Items are expected to arrive already
ordered by group — a group split across the list renders its heading twice.

```vue
<DropdownMenu :items="options" :item-group-label="(option) => option.category">
  <template #groupLabel="{ label }">
    <Icon name="folder" /> {{ label }}
  </template>
</DropdownMenu>
```

Indices stay contiguous across the headings, so `cursorIndex`, `optionIdPrefix` and the emitted
payloads keep pointing at the item's position in `items`, not at its rendered row.
