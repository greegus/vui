# TabsNav

Standalone tab switcher — the `role="tablist"` row of buttons driven by a `tabs` array and
`v-model` (whose value is the active tab's `key`). Used internally by [Tabs](/components/tabs),
but can be used on its own to control tab state without the panels.

## Import

```typescript
import { TabsNav } from 'vuiii'
import type { Tab } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { TabsNav } from '../../src'

const active = ref('profile')

const tabs = [
  { key: 'profile', label: 'Profile' },
  { key: 'messages', label: 'Messages' },
  { key: 'settings', label: 'Settings', icon: 'cog' },
]
</script>

<ComponentDemo storybook="components-tabs--standalone-nav">
  <TabsNav v-model="active" :tabs="tabs" />
</ComponentDemo>

```vue
import { TabsNav } from 'vuiii'
import type { Tab } from 'vuiii'

const active = ref('profile')

const tabs: Tab[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'messages', label: 'Messages' },
  { key: 'settings', label: 'Settings', icon: 'cog' },
]

<TabsNav v-model="active" :tabs="tabs" />
```

## Props

| Prop      | Type      | Default        | Description                                                             |
| --------- | --------- | -------------- | ---------------------------------------------------------------------- |
| `tabs`    | `Tab[]`   | -              | List of tab descriptors (see the `Tab` type below)                    |
| `idBase`  | `string`  | generated id   | Shared id base for linking tabs to their panels. Defaults to a generated id |
| `v-model` | `string`  | first enabled tab | The active tab's `key`                                              |

### The `Tab` type

```typescript
type Tab = {
  key: string       // v-model value / slot key
  label: string     // text shown in the tab button
  icon?: string     // optional icon name
  disabled?: boolean
}
```

## Slots

| Slot          | Slot Props        | Description                                              |
| ------------- | ----------------- | ------------------------------------------------------- |
| `label:{key}` | `{ tab, active }` | Custom content for a tab button (replaces the default) |

## Events

The TabsNav component has no custom events — use `v-model` to react to the active tab changing.

## More Examples

### Custom Tab Label

```vue
<TabsNav v-model="active" :tabs="tabs">
  <template #label:settings="{ active }">
    <Icon name="cog" /> Settings <Badge>3</Badge>
  </template>
</TabsNav>
```

## Keyboard

Selection follows focus within the tablist:

| Key                        | Action                          |
| -------------------------- | ------------------------------- |
| `ArrowRight` / `ArrowDown` | Move to the next enabled tab    |
| `ArrowLeft` / `ArrowUp`    | Move to the previous enabled tab |
| `Home`                     | Jump to the first enabled tab   |
| `End`                      | Jump to the last enabled tab    |

Disabled tabs are skipped during keyboard navigation.

::: tip Storybook
For interactive examples, see [TabsNav in Storybook](https://greegus.github.io/vuiii/storybook/?path=/story/components-tabs--standalone-nav).
:::
