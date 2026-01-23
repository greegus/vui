<template>
  <nav aria-label="Breadcrumb">
    <ol class="Breadcrumbs">
      <li v-for="(item, index) in breadcrumbs" :key="index" class="Breadcrumbs__breadcrumb">
        <router-link
          :to="item.link"
          class="Breadcrumbs__link"
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
        >
          {{ item.label }}
        </router-link>

        <Icon
          v-if="index < breadcrumbs.length - 1"
          name="chevron-right"
          class="Breadcrumbs__arrow"
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>

<script lang="ts" setup>
import Icon from "@/components/Icon.vue";
import type { BreadcrumbItems } from "@/types";

withDefaults(
  defineProps<{
    breadcrumbs: BreadcrumbItems;
  }>(),
  {
    breadcrumbs: () => [],
  },
);
</script>

<style scoped>
.Breadcrumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  opacity: 0.5;
  list-style: none;
  margin: 0;
  padding: 0;
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
