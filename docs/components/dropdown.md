# Dropdown

Popover with a trigger and arbitrary content. Closes on outside click and on Escape, and can be
driven programmatically.

## Import

```typescript
import { Dropdown, DropdownMenu } from 'vuiii'
```

## Basic Usage

With no `trigger` slot it renders a `Button` labelled by `label`. The content is whatever you put in
the default slot — [DropdownMenu](/components/dropdown-menu) is the usual choice.

<script setup>
import { ref } from 'vue'
import { Dropdown, DropdownMenu, IconButton } from '../../src'

const menuItems = ['Edit', 'Duplicate', 'Delete']
const lastAction = ref('')
const dropdownRef = ref()
</script>

<ComponentDemo storybook="components-dropdown--default">
  <Dropdown label="Options" color="primary">
    <template #default="{ close }">
      <DropdownMenu :items="menuItems" @item-click="({ item }) => { lastAction = item; close() }" />
    </template>
  </Dropdown>
  <span v-if="lastAction" style="opacity: 0.7; font-size: 0.875rem; margin-left: 0.75rem">Picked: {{ lastAction }}</span>
</ComponentDemo>

```vue
<Dropdown label="Options" color="primary">
  <template #default="{ close }">
    <DropdownMenu :items="menuItems" @item-click="({ item }) => { run(item); close() }" />
  </template>
</Dropdown>
```

::: tip Close it yourself
The default slot receives `close`, because the dropdown cannot know which of your clicks should
dismiss it. Picking a menu item usually should.
:::

## Props

| Prop                | Type                                | Default | Description                                          |
| ------------------- | ----------------------------------- | ------- | ---------------------------------------------------- |
| `label`             | `string`                            | -       | Label of the default button trigger                  |
| `icon`              | `string`                            | -       | Prefix icon of the default button trigger            |
| `color`             | `ButtonColor`                       | -       | Color of the default button trigger                  |
| `block`             | `boolean`                           | `false` | Makes the trigger full width                         |
| `dropdownPlacement` | `'left' \| 'right' \| 'center'`     | -       | Alignment of the popover against the trigger         |
| `fullDropdownWidth` | `boolean`                           | `false` | Stretches the popover to the trigger's width         |

## Slots

| Slot      | Description                                                             |
| --------- | ----------------------------------------------------------------------- |
| `default` | Popover content. Props: `{ close }`                                     |
| `trigger` | Replaces the button trigger. Props: `{ open, close, toggle, isOpen }`   |

## Events

| Event   | Description               |
| ------- | ------------------------- |
| `open`  | When the popover opens    |
| `close` | When the popover closes   |

## Custom Trigger

The `trigger` slot hands you the controls, so any element can open the popover.

<ComponentDemo>
  <Dropdown>
    <template #trigger="{ toggle }">
      <IconButton icon="pencil" title="Actions" @click="toggle()" />
    </template>

    <template #default="{ close }">
      <div style="padding: 1rem">
        <div style="margin-bottom: 0.5rem">Anything can go in here.</div>
        <button @click="close()">Close</button>
      </div>
    </template>
  </Dropdown>
</ComponentDemo>

```vue
<Dropdown>
  <template #trigger="{ toggle, isOpen }">
    <IconButton icon="pencil" title="Actions" @click="toggle()" />
  </template>

  <template #default="{ close }">
    <div class="custom-content">
      <button @click="doSomething(); close()">Action</button>
    </div>
  </template>
</Dropdown>
```

## Placement

<ComponentDemo>
  <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
    <Dropdown label="Left" dropdown-placement="left"><div style="padding: 1rem">Aligned left</div></Dropdown>
    <Dropdown label="Center" dropdown-placement="center"><div style="padding: 1rem">Centered</div></Dropdown>
    <Dropdown label="Right" dropdown-placement="right"><div style="padding: 1rem">Aligned right</div></Dropdown>
  </div>
</ComponentDemo>

```vue
<Dropdown label="Menu" dropdown-placement="right">
  <DropdownMenu :items="items" />
</Dropdown>
```

## Programmatic Control

A template ref exposes `open`, `close`, `toggle` and `isOpen`. `isOpen` arrives already unwrapped —
read it as a plain boolean, not `.value`.

<ComponentDemo>
  <div style="display: flex; gap: 0.75rem; align-items: center;">
    <Dropdown ref="dropdownRef" label="Controlled">
      <div style="padding: 1rem">Opened from outside</div>
    </Dropdown>
    <button @click="dropdownRef?.open()">Open it</button>
    <button @click="dropdownRef?.close()">Close it</button>
  </div>
</ComponentDemo>

```vue
<script setup>
import { ref } from 'vue'
import type { DropdownRef } from 'vuiii'

const dropdownRef = ref<DropdownRef>()

dropdownRef.value?.open()
dropdownRef.value?.toggle()

if (dropdownRef.value?.isOpen) {
  // …
}
</script>

<template>
  <Dropdown ref="dropdownRef" label="Menu">
    <DropdownMenu :items="items" />
  </Dropdown>
</template>
```

## Dismissal

Every open dropdown closes on an outside mousedown or on Escape, and the click still reaches the page
underneath — so clicking straight into an input both closes the popover and focuses the field.

::: tip Storybook
For interactive examples with all variants, see [Dropdown in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-dropdown--docs).
:::
