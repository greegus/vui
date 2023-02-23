<template>
  <table class="vuiii-table" :class="{ 'vuiii-table--hover': $props.hightlightOnHover && items?.length }">
    <thead>
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
          v-for="(column, key) in normalizedColumns"
          :key="key"
          :class="row.cells[key].cellClass"
          :align="column.align || 'left'"
        >
          <slot :name="key" v-bind="{ item: row.item, value: row.cells[key].value, index }">
            <router-link v-if="column.href" class="vuiii-link" :to="column.href(row.cells[key].item)">
              {{ row.cells[key].value }}
            </router-link>

            <template v-else>
              {{ row.cells[key].value }}
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
import '../assets/css/table.css'
import '../assets/css/typography.css'

import { computed } from 'vue'

import { ColumnOptions, TableColumns } from '@/types'

type NormalizedTableColumns<T = any> = Record<keyof T | string, ColumnOptions<T>>

type TableRows = {
  item: any
  rowClass?: string
  cells: Record<string, { value: any; cellClass?: string }>[]
}[]

const props = defineProps<{
  items: any[]
  columns: TableColumns
  rowClass?: string | ((row: { item: any; index: number }) => any)
  hightlightOnHover?: boolean
  emptyMessage?: string
}>()

defineEmits<{
  (event: 'click-row', payload: { item: any; index: number }): void
  (event: 'mouseenter-row', payload: { item: any; index: number }): void
  (event: 'mouseleave-row', payload: { item: any; index: number }): void
}>()

const normalizedColumns = computed<NormalizedTableColumns>(() => {
  return Object.entries(props.columns).reduce(
    (result, [key, options]) => ({
      ...result,
      [key]: typeof options === 'string' ? { label: options } : options
    }),
    {}
  )
})

const tableRows = computed<TableRows>(() => {
  return (
    props.items?.map((item, index) => {
      const rowClass = typeof props.rowClass === 'function' ? props.rowClass({ item, index }) : props.rowClass
      const cells = Object.entries(normalizedColumns.value).reduce((result, [key, column]) => {
        const value = typeof column.value === 'function' ? column.value(item) : item[key]
        const formattedValue = typeof column.format === 'function' ? column.format(value) : value
        const cellClass = typeof column.cellClass === 'function' ? column.cellClass({ item, value }) : column.cellClass

        return {
          ...result,
          [key]: {
            value: formattedValue,
            cellClass
          }
        }
      }, {} as any)

      return { rowClass, cells, item }
    }) || []
  )
})
</script>
