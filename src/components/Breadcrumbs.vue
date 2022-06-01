<template>
  <div class="Breadcrumbs">
    <div v-for="(location, label, index) in breadcrumbs" :key="index" class="Breadcrumbs__breadcrumb">
      <router-link :to="location" class="Breadcrumbs__link">
        {{ label }}
      </router-link>

      <Icon name="chevron-right" class="Breadcrumbs__arrow" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { RouteLocationRaw } from 'vue-router'

import Icon from './Icon.vue'

export type BreadcrumbItems = Record<string, RouteLocationRaw>

export default defineComponent({
  components: {
    Icon
  },

  props: {
    breadcrumbs: {
      type: Object as PropType<BreadcrumbItems>,
      default: () => ({})
    }
  }
})
</script>

<style lang="postcss" scoped>
.Breadcrumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  opacity: 0.5;
}

.Breadcrumbs__breadcrumb {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  gap: 0.5rem;
}

.Breadcrumbs__link {
  &:hover {
    text-decoration: underline;
  }
}

.Breadcrumbs__arrow {
  width: 1rem;
}
</style>
