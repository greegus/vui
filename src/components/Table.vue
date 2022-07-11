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

<script lang="ts">
import '../assets/css/table.css'
import '../assets/css/typography.css'

import { defineComponent, PropType } from 'vue'
import { RouteLocationRaw } from 'vue-router'

type ColumnOptions<T = any> = {
  label?: string
  align?: 'left' | 'right' | 'center'
  width?: string
  value?: (item: T) => unknown
  format?: (...params: any[]) => unknown
  href?: (item: T) => RouteLocationRaw
}

type NormalizedTableColumns<T = any> = Record<keyof T | string, ColumnOptions<T>>

export type TableColumns<T = any> = Record<keyof T | string, string | ColumnOptions<T>>

export default defineComponent({
  props: {
    items: {
      type: Array,
      default: () => []
    },

    columns: {
      type: Object as PropType<TableColumns>,
      default: null
    },

    rowClass: {
      type: [String, Function],
      default: null
    }
  },

  computed: {
    normalizedColumns(): NormalizedTableColumns {
      return Object.entries(this.columns).reduce(
        (result, [key, options]) => ({
          ...result,
          [key]: typeof options === 'string' ? { label: options } : options
        }),
        {}
      )
    }
  },

  methods: {
    formatValue(item: any, key: keyof NormalizedTableColumns): any {
      const column = this.normalizedColumns[key]

      const value = typeof column.value === 'function' ? column.value(item) : item[key]

      if (column.format) {
        return column.format(value)
      }

      return value
    },

    resolveRowClass(item: any): any {
      return typeof this.rowClass === 'function' ? this.rowClass(item) : this.rowClass
    }
  }
})
</script>
