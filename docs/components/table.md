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
import { Table, IconButton, Icon } from '../../src'

const users = [
  { id: 1, name: 'Charlie', email: 'charlie@example.com', active: true, signedUp: new Date('2024-03-01') },
  { id: 2, name: 'Alice', email: 'alice@example.com', active: false, signedUp: new Date('2023-11-14') },
  { id: 3, name: 'Bob', email: 'bob@example.com', active: true, signedUp: new Date('2025-01-22') },
]

const columns = [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' },
]

const sortableColumns = [
  { name: 'name', label: 'Name', sortable: true },
  { name: 'signedUp', label: 'Signed up', sortable: true, formatter: (value) => value.toLocaleDateString('en-GB') },
]

const sortColumn = ref('name')
const sortDir = ref('asc')
const lastClicked = ref('')
</script>

<ComponentDemo storybook="components-table--default">
  <Table :items="users" :columns="columns" />
</ComponentDemo>

```vue
<script setup>
import { Table } from 'vuiii'
import type { TableColumn } from 'vuiii'

type User = { id: number; name: string; email: string }

const columns: TableColumn<User>[] = [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' },
]
</script>

<template>
  <Table :items="users" :columns="columns" />
</template>
```

A column reads `item[name]` by default. Give it a `value` function to derive the cell instead, and a
`formatter` to control how it is displayed.

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

## Custom Cells

`column:{name}` replaces a single column's cells. The slot name does not have to match an existing
data property — a column named `status` with no matching field is a perfectly good place to render
something derived.

<ComponentDemo>
  <Table :items="users" :columns="[{ name: 'name', label: 'Name' }, { name: 'status', label: 'Status' }]">
    <template #column:name="{ value }">
      <strong>{{ value }}</strong>
    </template>
    <template #column:status="{ item }">
      <Icon :name="item.active ? 'check' : 'x'" size="small" />
      {{ item.active ? 'Active' : 'Inactive' }}
    </template>
  </Table>
</ComponentDemo>

```vue
<Table :items="users" :columns="columns">
  <template #column:name="{ value }">
    <strong>{{ value }}</strong>
  </template>
  <template #column:status="{ item }">
    <Badge :color="item.active ? 'success' : 'danger'">
      {{ item.active ? 'Active' : 'Inactive' }}
    </Badge>
  </template>
</Table>
```

## Row Actions

`rowOptions` adds a trailing column of per-row actions. The `tools` slot fills its header cell.

<ComponentDemo>
  <Table :items="users" :columns="columns">
    <template #tools>Actions</template>
    <template #rowOptions="{ item }">
      <IconButton icon="pencil" size="small" :title="`Edit ${item.name}`" />
      <IconButton icon="trash" size="small" color="danger" :title="`Delete ${item.name}`" />
    </template>
  </Table>
</ComponentDemo>

```vue
<Table :items="users" :columns="columns">
  <template #tools>Actions</template>
  <template #rowOptions="{ item }">
    <IconButton icon="pencil" title="Edit" @click="edit(item)" />
    <IconButton icon="trash" color="danger" title="Delete" @click="remove(item)" />
  </template>
</Table>
```

Clicks inside that cell do not bubble up as `click-row`, so row actions and a clickable row can
coexist.

## Sorting

Mark a column `sortable` and the header becomes a button. The sort state is yours to hold, through
`v-model:sort-column-name` and `v-model:sort-direction` — which means the table can either sort the
rows it was given, or you can ignore its rows and refetch from a server.

<ComponentDemo>
  <div style="width: 100%">
    <Table
      :items="users"
      :columns="sortableColumns"
      v-model:sort-column-name="sortColumn"
      v-model:sort-direction="sortDir"
    />
    <div style="margin-top: 0.5rem; opacity: 0.7; font-size: 0.875rem">
      Sorted by {{ sortColumn }} ({{ sortDir }})
    </div>
  </div>
</ComponentDemo>

```vue
<Table
  v-model:sort-column-name="sortColumn"
  v-model:sort-direction="sortDir"
  :items="users"
  :columns="[
    { name: 'name', label: 'Name', sortable: true },
    { name: 'signedUp', label: 'Signed up', sortable: true },
  ]"
/>
```

Values are compared as strings or numbers depending on their type, and empty cells are grouped at the
end. Pass a `sorter` on the column for anything else:

```ts
{ name: 'priority', label: 'Priority', sortable: true, sorter: (a, b) => order[a] - order[b] }
```

## Row Interaction

<ComponentDemo>
  <div style="width: 100%">
    <Table
      :items="users"
      :columns="columns"
      highlight-on-hover
      @click-row="({ item }) => (lastClicked = item.name)"
    />
    <div style="margin-top: 0.5rem; opacity: 0.7; font-size: 0.875rem">
      {{ lastClicked ? `Clicked ${lastClicked}` : 'Click a row' }}
    </div>
  </div>
</ComponentDemo>

```vue
<Table
  :items="users"
  :columns="columns"
  highlight-on-hover
  @click-row="({ item }) => open(item)"
/>
```

`rowClass` accepts a function too, for styling rows by their data:

```vue
<Table :items="users" :columns="columns" :row-class="({ item }) => (item.active ? '' : 'is-muted')" />
```

## Empty State

<ComponentDemo>
  <Table :items="[]" :columns="columns" no-data-message="No users yet" />
</ComponentDemo>

```vue
<Table :items="[]" :columns="columns" no-data-message="No users yet" />
```

Use the `noDataMessage` slot for richer content — an illustration, or a button that creates the first
record.

## Density

<ComponentDemo>
  <div style="display: flex; flex-flow: column; gap: 1.5rem; width: 100%;">
    <Table :items="users.slice(0, 2)" :columns="columns" size="small" />
    <Table :items="users.slice(0, 2)" :columns="columns" size="large" />
  </div>
</ComponentDemo>

```vue
<Table :items="users" :columns="columns" size="small" />
<Table :items="users" :columns="columns" size="large" />
```

## Linked Cells

Give a column an `href` and its cells render as router links.

```ts
const columns: TableColumn<User>[] = [
  { name: 'name', label: 'Name', href: (user) => ({ name: 'user', params: { id: user.id } }) },
]
```

::: tip Storybook
For interactive examples with all variants, see [Table in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-table--docs).
:::
