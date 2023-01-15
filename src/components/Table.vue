<template>
  <table class="vuiii-table" :class="{ 'vuiii-table--hover': $props.hightlightOnHover }">
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
        v-for="(item, index) in items"
        :key="index"
        :class="resolveRowClass({ item, index })"
        @click="$emit('click-row', { item, index })"
        @mouseenter="$emit('mouseenter-row', { item, index })"
        @mouseleave="$emit('mouseleave-row', { item, index })"
      >
        <td v-for="(column, key) in normalizedColumns" :key="key" :style="{ textAlign: column.align || 'left' }">
          <slot :name="key" v-bind="{ item }">
            <router-link v-if="column.href" class="vuiii-link" :to="column.href(item)">
              {{ formatValue(item, key) }}
            </router-link>

            <template v-else>
              {{ formatValue(item, key) }}
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

const formatValue = (item: any, key: keyof NormalizedTableColumns): any => {
  const column = normalizedColumns.value[key]

  const value = typeof column.value === 'function' ? column.value(item) : item[key]

  if (column.format) {
    return column.format(value)
  }

  return value
}

const resolveRowClass = (row: { item: any; index: number }): any => {
  return typeof props.rowClass === 'function' ? props.rowClass(row) : props.rowClass
}
</script>
