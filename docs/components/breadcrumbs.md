# Breadcrumbs

Navigation breadcrumbs with router-link support.

## Import

```typescript
import { Breadcrumbs } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Breadcrumbs } from '../../src'
</script>

<ComponentDemo storybook="example-breadcrumbs--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage
import { Breadcrumbs } from 'vuiii'
import type { BreadcrumbItems } from 'vuiii'

const breadcrumbs: BreadcrumbItems = [
  { label: 'Home', link: '/' },
  { label: 'Products', link: '/products' },
  { label: 'Electronics', link: '/products/electronics' }
]

<Breadcrumbs :breadcrumbs="breadcrumbs" />
```

## More Examples

```vue
// With named routes
const breadcrumbs: BreadcrumbItems = [
  { label: 'Dashboard', link: { name: 'dashboard' } },
  { label: 'Users', link: { name: 'users' } },
  { label: 'John Doe', link: { name: 'user', params: { id: 123 } } }
]
```

::: tip Storybook
For interactive examples with all variants, see [Breadcrumbs in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-breadcrumbs--docs).
:::
