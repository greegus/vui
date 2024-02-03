<template>
  <table class="vuiii-table" :class="{ 'vuiii-table--hover': $props.highlightOnHover && items?.length }">
    <thead v-if="hasHeader">
      <tr>
        <th
          v-for="(column, key) in normalizedColumns"
          :key="key"
          :style="{ textAlign: column.align || 'left' }"
          :width="column.width"
          class="vuiii-table__label"
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
        @click="handleRowClick($event, { index, item: row.item })"
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
              {{ cell.formattedValue }}
            </router-link>

            <template v-else>
              {{ cell.formattedValue }}
            </template>
          </slot>
        </td>

        <td v-if="$slots.rowOptions" class="vuiii-table__rowOptions" @click="$event.preventDefault()">
          <slot name="rowOptions" v-bind="{ item: row.item, index }" />
        </td>
      </tr>

      <tr v-if="!items?.length && ($props.noDataMessage || $slots.noDataMessage)">
        <td :colspan="Object.keys(columns).length">
          <slot name="noDataMessage">
            <div class="vuiii-table__noDataMessage">
              {{ $props.noDataMessage }}
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
  formattedValue: string
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
  highlightOnHover?: boolean
  noDataMessage?: string
}>()

const emit = defineEmits<{
  'click-row': [payload: { item: T; index: number }]
  'mouseenter-row': [payload: { item: T; index: number }]
  'mouseleave-row': [payload: { item: T; index: number }]
}>()

defineSlots<
  {
    rowOptions: (props: { item: T; index: number }) => any
    noDataMessage: void
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
    const formattedValue = typeof column.formatter === 'function' ? column.formatter(value) : value
    const cellClass = typeof column.cellClass === 'function' ? column.cellClass({ item, value }) : column.cellClass

    return {
      column,
      value,
      formattedValue,
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

function handleRowClick(event: MouseEvent, { index, item }: { index: number; item: T }) {
  if (!event.defaultPrevented) {
    emit('click-row', { index, item })
  }
}
</script>
