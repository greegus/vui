<template>
  <table class="vuiii-table" :class="{ 'vuiii-table--hover': $props.hightlightOnHover && items?.length }">
    <thead v-if="hasHeader">
      <tr>
        <th
          v-for="(column, key) in normalizedColumns"
          :key="key"
          :style="{ textAlign: column.align || 'left' }"
          :width="column.width"
        >
          {{ column.label }}
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(row, index) in tableRows"
        :key="index"
        :class="row.rowClass"
        @click="$emit('click-row', { index, item: row.item })"
        @mouseenter="$emit('mouseenter-row', { index, item: row.item })"
        @mouseleave="$emit('mouseleave-row', { index, item: row.item })"
      >
        <td
          v-for="cell in row.cells"
          :key="cell.column.name"
          :class="cell.cellClass"
          :align="cell.column.align || 'left'"
        >
          <slot :name="`column:${cell.column.name}`" v-bind="{ item: row.item, value: cell.value, index }">
            <router-link v-if="cell.column.href" class="vuiii-link" :to="cell.column.href(cell.item)">
              {{ cell.value }}
            </router-link>

            <template v-else>
              {{ cell.value }}
            </template>
          </slot>
        </td>
      </tr>

      <tr v-if="!items?.length && ($props.emptyMessage || $slots.emptyMessage)">
        <td :colspan="Object.keys(columns).length">
          <slot name="emptyMessage">
            <div class="vuiii-table__emptyMessage">
              {{ $props.emptyMessage }}
            </div>
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import '@/assets/css/table.css'
import '@/assets/css/typography.css'

import { computed } from 'vue'

import type { TableColumn } from '@/types'

type TableCell = {
  column: TableColumn
  value: any
  cellClass?: string
  item: any
}

type TableRow = {
  item: any
  rowClass?: string
  cells: TableCell[]
}

const props = defineProps<{
  items: any[]
  columns: (TableColumn | string)[]
  rowClass?: string | ((row: { item: any; index: number }) => any)
  hightlightOnHover?: boolean
  emptyMessage?: string
}>()

defineEmits<{
  'click-row': [payload: { item: any; index: number }]
  'mouseenter-row': [payload: { item: any; index: number }]
  'mouseleave-row': [payload: { item: any; index: number }]
}>()

defineSlots<
  {
    [K in `column:${string}`]: { item: any; value: any; index: number }
  } & {
    emptyMessage: void
  }
>()

const normalizedColumns = computed<TableColumn[]>(() => {
  return props.columns.reduce(
    (result, column) => [...result, typeof column === 'string' ? { name: column } : column],
    [] as TableColumn[]
  )
})

const hasHeader = computed(() => {
  return normalizedColumns.value.some((column) => column.label)
})

const tableRows = computed<TableRow[]>(() => {
  const generateCell = (column: TableColumn, item: any): TableCell => {
    const value = typeof column.value === 'function' ? column.value(item) : item[column.name]
    const formattedValue = typeof column.format === 'function' ? column.format(value) : value
    const cellClass = typeof column.cellClass === 'function' ? column.cellClass({ item, value }) : column.cellClass

    return {
      column,
      value: formattedValue,
      cellClass,
      item
    }
  }

  return (
    props.items?.map((item, index) => {
      const rowClass = typeof props.rowClass === 'function' ? props.rowClass({ item, index }) : props.rowClass

      const cells = normalizedColumns.value.reduce((result, column) => {
        return [...result, generateCell(column, item)]
      }, [] as TableCell[])

      return {
        item,
        rowClass,
        cells
      } as TableRow
    }) || []
  )
})
</script>
