import { type Meta, type StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Button from '../components/Button.vue'
import IconButton from '../components/IconButton.vue'
import Table from '../components/Table.vue'
import type { TableColumn } from '../types'
import { type TableItem, tableItems } from './assets/tableItems'

const sortColumnName = ref('total')

const sortDirection = ref<'asc' | 'desc'>('desc')

const formatDate = (date: number) => {
  return Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  }).format(new Date(date * 1000))
}

const formatCurrency = (value: number) => {
  return Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

const lastNameSorter = (a: string, b: string) => {
  return a.split(' ')[1].localeCompare(b.split(' ')[1])
}

const tableColumns: TableColumn<TableItem>[] = [
  {
    name: 'name',
    label: 'Name',
    href: () => '#',
  },
  {
    name: 'date',
    label: 'Date',
    align: 'right',
    formatter: formatDate,
  },
  {
    name: 'sallary',
    label: 'Sallary',
    align: 'right',
    formatter: formatCurrency,
  },
  {
    name: 'bonus',
    label: 'Bonus',
    align: 'right',
    formatter: formatCurrency,
  },
  {
    name: 'total',
    label: 'Total',
    align: 'right',
    value: (item) => item.sallary + item.bonus,
    formatter: formatCurrency,
  },
]

const sortableTableColumns = [...tableColumns]

sortableTableColumns[0] = { ...sortableTableColumns[0], sortable: true, sorter: lastNameSorter }
sortableTableColumns[1] = { ...sortableTableColumns[1], sortable: true }
sortableTableColumns[4] = { ...sortableTableColumns[4], sortable: true }

const meta: Meta<typeof Table<TableItem>> = {
  title: 'Components/Table',
  component: Table as any,
  argTypes: {
    noDataMessage: {
      control: 'text',
      defaultValue: 'No items',
    },
    size: {
      control: 'select',
      options: ['small', 'normal', 'large'],
    },
  },
  args: {
    items: tableItems,
    columns: tableColumns,
    noDataMessage: 'No items',
    highlightOnHover: true,
  },
}

export default meta

type Story = StoryObj<typeof Table<TableItem>>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => ({
    components: { Table, IconButton },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-flow: column; gap: 2rem;">
        <Table v-bind="args" size="small">
          <template #rowOptions>
            <IconButton icon="pencil" size="small" variant="text" />
            <IconButton icon="trash" size="small" color="danger" variant="text" />
          </template>
        </Table>
        <Table v-bind="args" size="normal">
          <template #rowOptions>
            <IconButton icon="pencil" size="normal" variant="text" />
            <IconButton icon="trash" size="normal" color="danger" variant="text" />
          </template>
        </Table>
        <Table v-bind="args" size="large">
          <template #rowOptions>
            <IconButton icon="pencil" size="large" variant="text" />
            <IconButton icon="trash" size="large" color="danger" variant="text" />
          </template>
        </Table>
      </div>
    `,
  }),
}

export const HoverableRows: Story = {
  args: {
    highlightOnHover: true,
  },
}

export const WithSorting: Story = {
  args: {
    columns: sortableTableColumns,
    sortColumnName,
    sortDirection,
  },
}

export const Empty: Story = {
  render: ({ columns }) => ({
    components: {
      Table,
    },

    setup() {
      return {
        items: [],
        columns,
      }
    },

    template: `
      <Table :items="items" :columns="columns" noDataMessage="No items" />
    `,
  }),
}

export const WithRowOptions: Story = {
  render: ({ columns, items }) => ({
    components: {
      Table,
      Button,
    },

    setup() {
      return {
        items,
        columns,
      }
    },

    template: `
      <Table :items="items" :columns="columns" highlightOnHover>
        <template #rowOptions>
          <Button variant="text" size="small" prefixIcon="pencil" />
          <Button variant="text" size="small" prefixIcon="trash" />
        </template>
      </Table>
    `,
  }),
}

export const WithRowClass: Story = {
  render: ({ items, columns }) => ({
    components: {
      Table,
    },

    setup() {
      return {
        items,
        columns,
      }
    },

    template: `
      <Table
        :items="items"
        :columns="columns"
        highlightOnHover
        :rowClass="({ index }) => index % 2 ? 'table--hightlight' : ''"
      />
    `,
  }),
}
