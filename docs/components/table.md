# Table

Data table component with sorting, custom columns, cell formatting, and row customization.
Supports dynamic slot-based cell rendering and sortable columns.

## Import

```typescript
import { Table } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Table } from '../../src'
</script>

<ComponentDemo storybook="components-table--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic table with typed columns
import { Table } from 'vuiii'
import type { TableColumn } from 'vuiii'

type User = { id: number; name: string; email: string }

const columns: TableColumn<User>[] = [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' }
]

<Table :items="users" :columns="columns" />
```

## Props

| Prop               | Type                                              | Default | Description                                          |
| ------------------ | ------------------------------------------------- | ------- | --------------------------------------------------- |
| `items`            | `T[]`                                             | -       | Array of row items to render                         |
| `columns`          | `TableColumn<T>[]`                                | -       | Column definitions                                   |
| `rowClass`         | `string \| ((row: { item, index }) => any)`       | -       | Class applied to each row (static or per-row)        |
| `highlightOnHover` | `boolean`                                         | `false` | Highlights rows on hover                             |
| `noDataMessage`    | `string`                                          | -       | Message shown when `items` is empty                  |
| `size`             | `'small' \| 'normal' \| 'large'`                  | `'normal'` | Row/cell density (padding + font size)            |
| `sortColumnName`   | `string \| null`                                  | `null`  | Currently sorted column (use with `v-model:sort-column-name`) |
| `sortDirection`    | `'asc' \| 'desc'`                                 | `'asc'` | Sort direction (use with `v-model:sort-direction`)   |

## Slots

| Slot            | Description                                                     |
| --------------- | --------------------------------------------------------------- |
| `column:{name}` | Custom cell content for a column. Props: `{ item, value, index, column }` |
| `header:{name}` | Custom header content for a column. Props: `{ column }`         |
| `rowOptions`    | Actions displayed at the end of each row. Props: `{ item, index }` |
| `noDataMessage` | Custom content when `items` is empty                            |
| `tools`         | Additional header row tools (adds an extra `th` column)         |

## Events

| Event            | Payload                                     | Description                            |
| ---------------- | ------------------------------------------- | -------------------------------------- |
| `click-row`      | `{ item: T, index: number }`                | When a row is clicked                  |
| `mouseenter-row` | `{ item: T, index: number }`                | When the mouse enters a row            |
| `mouseleave-row` | `{ item: T, index: number }`                | When the mouse leaves a row            |
| `sort`           | `{ sortColumnName: string, sortDirection: 'asc' \| 'desc' }` | When sort column or direction changes  |

## More Examples

```vue
// With custom cell rendering via slots
<Table :items="users" :columns="columns">
  <template #column:name="{ item, value }">
    <strong>{{ value }}</strong>
  </template>
  <template #column:status="{ item }">
    <Badge :variant="item.active ? 'success' : 'danger'">
      {{ item.active ? 'Active' : 'Inactive' }}
    </Badge>
  </template>
</Table>
```

```vue
// With row actions (rowOptions slot)
<Table :items="users" :columns="columns">
  <template #rowOptions="{ item, index }">
    <IconButton icon="pencil" @click="edit(item)" />
    <IconButton icon="trash" @click="remove(item)" />
  </template>
</Table>
```

```vue
// With sorting (v-model for sort state)
<Table
  :items="users"
  :columns="[
    { name: 'name', label: 'Name', sortable: true },
    { name: 'createdAt', label: 'Created', sortable: true, sorter: (a, b) => a - b },
  ]"
  v-model:sort-column-name="sortColumn"
  v-model:sort-direction="sortDir"
/>
```

::: tip Storybook
For interactive examples with all variants, see [Table in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-table--docs).
:::
