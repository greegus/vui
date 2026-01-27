<template>
  <component :is="component" class="Icon" :class="{ [`Icon--${$props.size}`]: $props.size }" />
</template>

<script lang="ts" setup>
/**
 * Icon component that resolves icons through a customizable resolver.
 * Register your icon library using registerCustomIconResolver.
 *
 * @component Icon
 *
 * @example
 * // Basic usage
 * import { Icon } from 'vuiii'
 *
 * <Icon name="check" />
 * <Icon name="user" size="large" />
 *
 * @example
 * // Different sizes
 * <Icon name="star" size="small" />
 * <Icon name="star" size="normal" />
 * <Icon name="star" size="large" />
 *
 * @example
 * // Register custom icon resolver (typically in app setup)
 * import { registerCustomIconResolver } from 'vuiii'
 * import { defineAsyncComponent } from 'vue'
 *
 * registerCustomIconResolver((name) => {
 *   return defineAsyncComponent(() => import(`./icons/${name}.vue`))
 * })
 *
 * @example
 * // With Heroicons
 * import * as HeroIcons from '@heroicons/vue/24/outline'
 *
 * registerCustomIconResolver((name) => {
 *   const pascalName = name.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('') + 'Icon'
 *   return HeroIcons[pascalName]
 * })
 *
 * // Then use in templates
 * <Icon name="user" />      // resolves to UserIcon
 * <Icon name="check" />     // resolves to CheckIcon
 */
import { shallowRef, watch } from "vue";

import type { IconSize } from "@/types";
import { type IconComponent, resolveIconComponent } from "@/utils/iconsResolver";

const props = defineProps<{
  name: string;
  size?: IconSize;
}>();

const component = shallowRef<IconComponent>(undefined);

watch(
  () => props.name,
  () => (component.value = resolveIconComponent(props.name)),
  { immediate: true },
);
</script>

<style scoped>
.Icon {
  display: inline-block;
  vertical-align: middle;
  width: var(--vuiii-icon-size);
  aspect-ratio: 1 / 1;
  flex: none;
}

.Icon--small {
  width: var(--vuiii-icon-size--small);
}

.Icon--large {
  width: var(--vuiii-icon-size--large);
}

.Icon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
