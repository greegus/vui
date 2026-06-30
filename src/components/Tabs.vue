<template>
  <div class="Tabs">
    <TabsNav v-model="activeKey" :tabs="tabs" :idBase="idBase" class="Tabs__nav">
      <!-- Forward custom tab-button labels to the switcher -->
      <template v-for="tab in tabs" #[`label:${tab.key}`]="slotProps">
        <slot :name="`label:${tab.key}`" v-bind="slotProps" />
      </template>
    </TabsNav>

    <div class="Tabs__panels">
      <template v-for="tab in tabs" :key="tab.key">
        <div
          v-if="keepAlive || tab.key === activeKey"
          v-show="tab.key === activeKey"
          :id="`${idBase}-panel-${tab.key}`"
          role="tabpanel"
          class="Tabs__panel"
          :aria-labelledby="`${idBase}-tab-${tab.key}`"
          :tabindex="tab.key === activeKey ? 0 : undefined"
        >
          <slot :name="`tab:${tab.key}`" :tab="tab" :active="tab.key === activeKey" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup generic="K extends string = string">
/**
 * Tabbed interface: a tab switcher plus per-tab content panels rendered via `tab:{key}` slots.
 * The active tab is controlled by an optional v-model whose value is the tab's `key`.
 *
 * @component Tabs
 * @generic K - Union of tab keys
 *
 * @example
 * // Basic usage
 * import { Tabs } from 'vuiii'
 * import type { Tab } from 'vuiii'
 *
 * const tabs: Tab[] = [
 *   { key: 'profile', label: 'Profile' },
 *   { key: 'settings', label: 'Settings', icon: 'cog' },
 * ]
 *
 * <Tabs :tabs="tabs" v-model="active">
 *   <template #tab:profile>Profile content</template>
 *   <template #tab:settings>Settings content</template>
 * </Tabs>
 *
 * @example
 * // Keep inactive panels mounted (preserve their state)
 * <Tabs :tabs="tabs" keep-alive>
 *   <template #tab:profile><ProfileForm /></template>
 *   <template #tab:settings><SettingsForm /></template>
 * </Tabs>
 *
 * @example
 * // Custom tab button label
 * <Tabs :tabs="tabs">
 *   <template #label:settings>Settings <Badge>3</Badge></template>
 *   <template #tab:settings>...</template>
 * </Tabs>
 *
 * @slot tab:{key} - Content for a tab's panel. Props: { tab, active }
 * @slot label:{key} - Custom content for a tab button. Props: { tab, active }
 */
import { computed, useId } from 'vue'

import TabsNav from '@/components/TabsNav.vue'
import type { Tab } from '@/types'

const props = defineProps<{
  tabs: Tab<K>[]
  /** Keep inactive panels mounted (hidden via v-show) instead of removing them from the DOM. */
  keepAlive?: boolean
}>()

const model = defineModel<K>()

defineSlots<
  { [P in `tab:${K}`]?: (props: { tab: Tab<K>; active: boolean }) => any } & {
    [P in `label:${K}`]?: (props: { tab: Tab<K>; active: boolean }) => any
  }
>()

const idBase = useId()

// Falls back to the first tab when uncontrolled / unset; writes flow back through the model.
const activeKey = computed<K | undefined>({
  get: () => model.value ?? props.tabs[0]?.key,
  set: (value) => (model.value = value),
})
</script>

<style scoped>
.Tabs__panels {
  padding-top: var(--vuiii-tabs-panel-paddingTop);
}
</style>
