# Breadcrumbs

Navigation trail rendered as router links inside a labelled `<nav>`, with a chevron between the
levels.

## Import

```typescript
import { Breadcrumbs } from 'vuiii'
import type { BreadcrumbItems } from 'vuiii'
```

## Basic Usage

Every item is a link, and `link` is required on each. The last one additionally carries
`aria-current="page"`, so assistive technology knows which level is the page being viewed.

<script setup>
import { Breadcrumbs } from '../../src'

const trail = [
  { label: 'Home', link: '/' },
  { label: 'Products', link: '/products' },
  { label: 'Electronics', link: '/products/electronics' },
]

const named = [
  { label: 'Dashboard', link: { name: 'dashboard' } },
  { label: 'Users', link: { name: 'users' } },
  { label: 'John Doe', link: { name: 'user', params: { id: 123 } } },
]
</script>

<ComponentDemo storybook="components-breadcrumbs--default">
  <Breadcrumbs :breadcrumbs="trail" />
</ComponentDemo>

```vue
<script setup>
import type { BreadcrumbItems } from 'vuiii'

const breadcrumbs: BreadcrumbItems = [
  { label: 'Home', link: '/' },
  { label: 'Products', link: '/products' },
  { label: 'Electronics', link: '/products/electronics' },
]
</script>

<template>
  <Breadcrumbs :breadcrumbs="breadcrumbs" />
</template>
```

## Props

| Prop          | Type               | Default | Description                     |
| ------------- | ------------------ | ------- | ------------------------------- |
| `breadcrumbs` | `BreadcrumbItems`  | `[]`    | The trail, root first           |

```ts
type BreadcrumbItems = {
  label: string
  link: string | RouteLocationRaw
}[]
```

## Named Routes

`link` takes anything `router-link` accepts, so named routes with params work as well as paths.

<ComponentDemo>
  <Breadcrumbs :breadcrumbs="named" />
</ComponentDemo>

```vue
<script setup>
const breadcrumbs: BreadcrumbItems = [
  { label: 'Dashboard', link: { name: 'dashboard' } },
  { label: 'Users', link: { name: 'users' } },
  { label: 'John Doe', link: { name: 'user', params: { id: 123 } } },
]
</script>

<template>
  <Breadcrumbs :breadcrumbs="breadcrumbs" />
</template>
```

## A Single Level

One item renders on its own, with no chevron.

<ComponentDemo>
  <Breadcrumbs :breadcrumbs="[{ label: 'Settings', link: '/settings' }]" />
</ComponentDemo>

::: warning Requires vue-router
The links render as `router-link`, so this component needs `vue-router` registered in your app. See
[Requirements](/getting-started/).
:::

::: tip Storybook
For interactive examples with all variants, see [Breadcrumbs in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-breadcrumbs--docs).
:::
