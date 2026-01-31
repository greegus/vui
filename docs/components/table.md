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

<ComponentDemo storybook="example-table--default">
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
    { name: 'createdAt', label: 'Created', sortable: true, sorter: (a, b) => a - b }
  ]"
  v-model:sort-column-name="sortColumn"
  v-model:sort-direction="sortDir"
/>
```

::: tip Storybook
For interactive examples with all variants, see [Table in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-table--docs).
:::
