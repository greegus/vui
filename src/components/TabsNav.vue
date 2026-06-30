<template>
  <div class="TabsNav" role="tablist">
    <button
      v-for="(tab, index) in tabs"
      :key="tab.key"
      ref="tabButtons"
      type="button"
      role="tab"
      class="TabsNav__tab"
      :class="{
        'TabsNav__tab--active': tab.key === activeKey,
        'TabsNav__tab--disabled': tab.disabled,
      }"
      :id="tabId(tab.key)"
      :aria-selected="tab.key === activeKey"
      :aria-controls="panelId(tab.key)"
      :tabindex="tab.key === rovingKey ? 0 : -1"
      :disabled="tab.disabled"
      @click="select(tab)"
      @keydown="onKeydown($event, index)"
    >
      <slot :name="`label:${tab.key}`" :tab="tab" :active="tab.key === activeKey">
        <Icon v-if="tab.icon" :name="tab.icon" class="TabsNav__icon" />
        <span class="TabsNav__label">{{ tab.label }}</span>
      </slot>
    </button>
  </div>
</template>

<script lang="ts" setup generic="K extends string = string">
/**
 * Tab switcher — a standalone `role="tablist"` of buttons driven by a `tabs` array and v-model
 * (whose value is the active tab's `key`). Used internally by Tabs, but can be used on its own.
 *
 * @component TabsNav
 * @generic K - Union of tab keys
 *
 * @example
 * // Standalone usage
 * import { TabsNav } from 'vuiii'
 * import type { Tab } from 'vuiii'
 *
 * const tabs: Tab[] = [
 *   { key: 'profile', label: 'Profile' },
 *   { key: 'settings', label: 'Settings', icon: 'cog' },
 * ]
 *
 * <TabsNav v-model="active" :tabs="tabs" />
 *
 * @example
 * // Custom tab button label
 * <TabsNav v-model="active" :tabs="tabs">
 *   <template #label:settings="{ active }">
 *     <Icon name="cog" /> Settings <Badge>3</Badge>
 *   </template>
 * </TabsNav>
 *
 * @slot label:{key} - Custom content for a tab button. Props: { tab, active }
 */
import { computed, ref, useId } from 'vue'

import Icon from '@/components/Icon.vue'
import type { Tab } from '@/types'

const props = defineProps<{
  tabs: Tab<K>[]
  /** Shared id base for linking tabs to their panels. Defaults to a generated id. */
  idBase?: string
}>()

const activeKey = defineModel<K>()

defineSlots<{
  [P in `label:${K}`]?: (props: { tab: Tab<K>; active: boolean }) => any
}>()

const generatedIdBase = useId()
const idBase = computed(() => props.idBase ?? generatedIdBase)

const tabId = (key: string) => `${idBase.value}-tab-${key}`
const panelId = (key: string) => `${idBase.value}-panel-${key}`

// Keeps the tablist keyboard-reachable even before a tab is selected.
const rovingKey = computed(() => activeKey.value ?? props.tabs.find((tab) => !tab.disabled)?.key)

const tabButtons = ref<HTMLButtonElement[]>([])

function select(tab: Tab<K>) {
  if (tab.disabled) {
    return
  }

  activeKey.value = tab.key
}

function activateByIndex(index: number) {
  const tab = props.tabs[index]

  if (!tab || tab.disabled) {
    return
  }

  activeKey.value = tab.key
  tabButtons.value[index]?.focus()
}

function moveFocus(fromIndex: number, direction: 1 | -1) {
  const count = props.tabs.length

  for (let step = 1; step <= count; step++) {
    const next = (fromIndex + direction * step + count) % count

    if (!props.tabs[next]?.disabled) {
      activateByIndex(next)
      return
    }
  }
}

function moveToEdge(edge: 'first' | 'last') {
  const indexes = props.tabs.map((_, index) => index)
  const ordered = edge === 'first' ? indexes : indexes.reverse()

  const target = ordered.find((index) => !props.tabs[index]?.disabled)

  if (target !== undefined) {
    activateByIndex(target)
  }
}

function onKeydown(event: KeyboardEvent, index: number) {
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      moveFocus(index, 1)
      break

    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      moveFocus(index, -1)
      break

    case 'Home':
      event.preventDefault()
      moveToEdge('first')
      break

    case 'End':
      event.preventDefault()
      moveToEdge('last')
      break
  }
}
</script>

<style scoped>
.TabsNav {
  display: flex;
  align-items: stretch;
  gap: var(--vuiii-tabs-gap);
  border-bottom: 1px solid var(--vuiii-tabs-borderColor);
}

.TabsNav__tab {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: var(--vuiii-tabs-tab-padding);
  margin-bottom: -1px;
  border-bottom: var(--vuiii-tabs-indicator-size) solid transparent;
  color: var(--vuiii-tabs-tab-textColor);
  white-space: nowrap;
  cursor: pointer;
  transition: var(--vuiii-field-transition);
}

.TabsNav__tab:hover:not(.TabsNav__tab--disabled) {
  color: var(--vuiii-tabs-tab-textColor--hover);
}

.TabsNav__tab--active {
  color: var(--vuiii-tabs-tab-textColor--active);
  border-bottom-color: var(--vuiii-tabs-indicator-color);
}

.TabsNav__tab--disabled {
  opacity: var(--vuiii-field-opacity--disabled, 0.6);
  cursor: default;
}

.TabsNav__tab:focus-visible {
  outline: none;
  border-radius: var(--vuiii-field-borderRadius);
  box-shadow: 0 0 0 var(--vuiii-field-ringSize) var(--vuiii-field-ringColor);
}

.TabsNav__icon {
  flex: none;
}
</style>
