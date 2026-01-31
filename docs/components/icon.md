# Icon

Icon component that resolves icons through a customizable resolver.
Register your icon library using registerCustomIconResolver.

## Import

```typescript
import { Icon } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Icon } from '../../src'
</script>

<ComponentDemo storybook="example-icon--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage
import { Icon } from 'vuiii'

<Icon name="check" />
<Icon name="user" size="large" />
```

## More Examples

```vue
// Different sizes
<Icon name="star" size="small" />
<Icon name="star" size="normal" />
<Icon name="star" size="large" />
```

```vue
// Register custom icon resolver (typically in app setup)
import { registerCustomIconResolver } from 'vuiii'
import { defineAsyncComponent } from 'vue'

registerCustomIconResolver((name) => {
  return defineAsyncComponent(() => import(`./icons/${name}.vue`))
})
```

```vue
// With Heroicons
import * as HeroIcons from '@heroicons/vue/24/outline'

registerCustomIconResolver((name) => {
  const pascalName = name.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('') + 'Icon'
  return HeroIcons[pascalName]
})

// Then use in templates
<Icon name="user" />      // resolves to UserIcon
<Icon name="check" />     // resolves to CheckIcon
```

::: tip Storybook
For interactive examples with all variants, see [Icon in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-icon--docs).
:::
