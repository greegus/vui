<template>
  <div class="Breadcrumbs">
    <div v-for="(item, index) in breadcrumbs" :key="index" class="Breadcrumbs__breadcrumb">
      <router-link :to="item.link" class="Breadcrumbs__link">
        {{ item.label }}
      </router-link>

      <Icon name="chevron-right" class="Breadcrumbs__arrow" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Icon from '@/components/Icon.vue'
import type { BreadcrumbItems } from '@/types'

withDefaults(
  defineProps<{
    breadcrumbs: BreadcrumbItems
  }>(),
  {
    breadcrumbs: () => []
  }
)
</script>

<style scoped>
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
  gap: 0.25rem;
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
