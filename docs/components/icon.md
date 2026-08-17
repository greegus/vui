# Icon

Icon component that resolves names through a customizable resolver, so the library never ties you
to a particular icon set.

## Import

```typescript
import { Icon } from 'vuiii'
```

## Basic Usage

<script setup>
import { Icon } from '../../src'
</script>

<ComponentDemo storybook="components-icon--default">
  <Icon name="check" />
  <Icon name="search" />
  <Icon name="trash" />
</ComponentDemo>

```vue
<Icon name="check" />
<Icon name="search" />
<Icon name="trash" />
```

## Props

| Prop   | Type                              | Default    | Description                            |
| ------ | --------------------------------- | ---------- | -------------------------------------- |
| `name` | `string`                          | -          | Icon name passed to the resolver       |
| `size` | `'small' \| 'normal' \| 'large'`  | `'normal'` | Icon size, matching the input sizes    |

## Sizes

<ComponentDemo>
  <Icon name="mail" size="small" />
  <Icon name="mail" size="normal" />
  <Icon name="mail" size="large" />
</ComponentDemo>

```vue
<Icon name="mail" size="small" />
<Icon name="mail" size="normal" />
<Icon name="mail" size="large" />
```

## Bundled Icons

A small set ships with the library, used by the components themselves — `Table`'s sort caret,
`Button`'s spinner, `Autocomplete`'s chevron. They are available to you as well:

<ComponentDemo>
  <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
    <Icon name="arrow-narrow-up" />
    <Icon name="arrow-narrow-down" />
    <Icon name="arrow-narrow-left" />
    <Icon name="arrow-narrow-right" />
    <Icon name="arrow-top-right-on-square" />
    <Icon name="arrow-up-tray" />
    <Icon name="caret-sort" />
    <Icon name="check" />
    <Icon name="chevron-up" />
    <Icon name="chevron-down" />
    <Icon name="chevron-left" />
    <Icon name="chevron-right" />
    <Icon name="exclamation" />
    <Icon name="mail" />
    <Icon name="minus" />
    <Icon name="pencil" />
    <Icon name="plus" />
    <Icon name="search" />
    <Icon name="spinner" />
    <Icon name="trash" />
    <Icon name="triangle-up" />
    <Icon name="triangle-down" />
    <Icon name="triangle-left" />
    <Icon name="triangle-right" />
    <Icon name="x" />
  </div>
</ComponentDemo>

This set is deliberately minimal — it covers what the components need, not what an application
needs. Register your own resolver for the rest.

## Using Your Own Icon Set

`registerCustomIconResolver` takes a function from name to component. It is consulted first, and the
bundled set is the fallback, so you can override individual names or replace everything.

Call it once during app setup:

```typescript
import { registerCustomIconResolver } from 'vuiii'
import { defineAsyncComponent } from 'vue'

registerCustomIconResolver((name) => defineAsyncComponent(() => import(`./icons/${name}.vue`)))
```

### With Heroicons

```typescript
import { registerCustomIconResolver } from 'vuiii'
import * as HeroIcons from '@heroicons/vue/24/outline'

registerCustomIconResolver((name) => {
  const pascalName =
    name
      .split('-')
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join('') + 'Icon'

  return HeroIcons[pascalName]
})
```

`<Icon name="user" />` then resolves to `UserIcon`, and every icon prop across the library —
`Button`'s `prefixIcon`, `Table`'s column icons, `option-icon` — starts accepting Heroicon names.

### With FontAwesome

```typescript
import { registerCustomIconResolver } from 'vuiii'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { h } from 'vue'

registerCustomIconResolver((name) => h(FontAwesomeIcon, { icon: ['fas', name] }))
```

::: warning Register before first render
Resolved components are cached, and registering a resolver clears that cache — but a component
already on screen only picks up the change on its next render. Register during app setup, before
mounting, rather than lazily.
:::

::: tip Storybook
For interactive examples with all variants, see [Icon in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-icon--docs).
:::
