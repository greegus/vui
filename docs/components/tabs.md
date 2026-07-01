# Tabs

Tabbed interface: a tab switcher plus per-tab content panels rendered via `tab:{key}` slots.
The active tab is controlled by an optional `v-model` whose value is the tab's `key`.

## Import

```typescript
import { Tabs } from 'vuiii'
import type { Tab } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Tabs } from '../../src'

const active = ref('profile')

const tabs = [
  { key: 'profile', label: 'Profile' },
  { key: 'settings', label: 'Settings', icon: 'cog' },
]
</script>

<ComponentDemo storybook="components-tabs--default">
  <Tabs :tabs="tabs" v-model="active">
    <template #tab:profile>Profile content</template>
    <template #tab:settings>Settings content</template>
  </Tabs>
</ComponentDemo>

```vue
import { Tabs } from 'vuiii'
import type { Tab } from 'vuiii'

const active = ref('profile')

const tabs: Tab[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'settings', label: 'Settings', icon: 'cog' },
]

<Tabs :tabs="tabs" v-model="active">
  <template #tab:profile>Profile content</template>
  <template #tab:settings>Settings content</template>
</Tabs>
```

## Props

| Prop        | Type       | Default | Description                                                                                     |
| ----------- | ---------- | ------- | ----------------------------------------------------------------------------------------------- |
| `tabs`      | `Tab[]`    | -       | List of tab descriptors (see the `Tab` type below)                                              |
| `keepAlive` | `boolean`  | `false` | Keep inactive panels mounted (hidden via `v-show`) instead of removing them from the DOM       |
| `v-model`   | `string`   | first tab | The active tab's `key`. Optional — defaults to the first tab when unset                       |

### The `Tab` type

```typescript
type Tab = {
  key: string       // v-model value / slot key
  label: string     // text shown in the tab button
  icon?: string     // optional icon name
  disabled?: boolean
}
```

::: tip keepAlive
By default only the active panel is present in the DOM (rendered with `v-if`). With `keepAlive`,
inactive panels stay mounted and are hidden with `v-show`, which preserves their internal state
(form values, scroll position, etc.) across tab switches.
:::

## Slots

| Slot          | Slot Props        | Description                                              |
| ------------- | ----------------- | ------------------------------------------------------- |
| `tab:{key}`   | `{ tab, active }` | Content for a tab's panel                               |
| `label:{key}` | `{ tab, active }` | Custom content for a tab button (replaces the default) |

## Events

The Tabs component has no custom events — use `v-model` to react to the active tab changing.

## More Examples

### Keep Alive

Preserve inactive panel state by keeping them mounted.

```vue
<Tabs :tabs="tabs" keep-alive>
  <template #tab:profile><ProfileForm /></template>
  <template #tab:settings><SettingsForm /></template>
</Tabs>
```

### Custom Tab Label

Override an individual tab button via the `label:{key}` slot.

```vue
<Tabs :tabs="tabs">
  <template #label:settings>Settings <Badge>3</Badge></template>
  <template #tab:settings>Settings content</template>
</Tabs>
```

## Accessibility

Tabs follows the WAI-ARIA tabs pattern: the switcher is a `role="tablist"` of `role="tab"`
buttons, each panel is a `role="tabpanel"` linked back to its tab via `aria-controls` /
`aria-labelledby`. Arrow keys (left/right/up/down) move between enabled tabs, and Home/End jump
to the first/last tab.

::: tip Storybook
For interactive examples, see [Tabs in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-tabs--docs).
:::
