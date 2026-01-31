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
  { label: 'Delete', icon: 'trash' }
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

| Prop | Type | Description |
|------|------|-------------|
| `items` | `any[]` | Array of menu items |
| `cursorIndex` | `number` | Index of currently focused item (for keyboard navigation) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `itemClick` | `{ item, index }` | Emitted when an item is clicked |
| `itemMouseenter` | `{ item, index }` | Emitted when mouse enters an item |
| `itemMouseleave` | `{ item, index }` | Emitted when mouse leaves an item |

