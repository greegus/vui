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

        <th v-if="$slots.tools"></th>
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
          :style="{ textAlign: cell.column.align || 'left' }"
          :class="cell.cellClass"
        >
          <slot
            :name="`column:${cell.column.name}`"
            v-bind="{ item: row.item, value: cell.value, index, column: cell.column }"
          >
            <router-link v-if="cell.column.href" class="vuiii-link" :to="cell.column.href(cell.item)">
              {{ cell.value }}
            </router-link>

            <template v-else>
              {{ cell.value }}
            </template>
          </slot>
        </td>

        <td v-if="$slots.rowOptions" class="vuiii-table__rowOptions">
          <slot name="rowOptions" v-bind="{ item: row.item, index }" />
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

<script lang="ts" generic="T extends object" setup>
import '../assets/css/table.css'
import '../assets/css/typography.css'

import { computed } from 'vue'

import type { TableColumn } from '../types'

type TableCell = {
  column: TableColumn<T>
  item: T
  value: any
  cellClass?: string
}

type TableRow = {
  item: T
  rowClass?: string
  cells: TableCell[]
}

const props = defineProps<{
  items: T[]
  columns: TableColumn<T>[]
  rowClass?: string | ((row: { item: T; index: number }) => any)
  hightlightOnHover?: boolean
  emptyMessage?: string
}>()

defineEmits<{
  'click-row': [payload: { item: T; index: number }]
  'mouseenter-row': [payload: { item: T; index: number }]
  'mouseleave-row': [payload: { item: T; index: number }]
}>()

defineSlots<
  {
    rowOptions: (props: { item: T; index: number }) => any
    emptyMessage: void
  } & {
    [K in `column:${(typeof props.columns)[number]['name']}`]: (props: {
      column: TableColumn<T>
      item: T
      value: any
      index: number
    }) => any
  }
>()

const normalizedColumns = computed<TableColumn<T>[]>(() => {
  return props.columns.reduce(
    (result, column) => [...result, typeof column === 'string' ? ({ name: column } as TableColumn<T>) : column],
    [] as TableColumn<T>[]
  )
})

const hasHeader = computed(() => {
  return normalizedColumns.value.some((column) => column.label)
})

const tableRows = computed<TableRow[]>(() => {
  const generateCell = (column: TableColumn<T>, item: any): TableCell => {
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
