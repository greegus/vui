<template>
  <table class="vuiii-table vuiii-table--hover">
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
      <tr v-for="(item, index) in items" :key="index" :class="resolveRowClass(item)">
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
  rowClass?: string | ((item: any) => string)
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

const resolveRowClass = (item: any): any => {
  return typeof props.rowClass === 'function' ? props.rowClass(item) : props.rowClass
}
</script>
