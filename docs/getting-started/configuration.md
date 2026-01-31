# Configuration

## Icon Resolver

VUIII's `Icon` component uses a resolver pattern to load icons. Register your icon library during app initialization:

```typescript
// main.ts
import { registerCustomIconResolver } from 'vuiii'
import { defineAsyncComponent } from 'vue'

// Example: Load icons from a local directory
registerCustomIconResolver((name) => {
  return defineAsyncComponent(() => import(`./icons/${name}.vue`))
})
```

### Using Heroicons

```typescript
import { registerCustomIconResolver } from 'vuiii'
import { defineAsyncComponent } from 'vue'

registerCustomIconResolver((name) => {
  return defineAsyncComponent(
    () => import(`@heroicons/vue/24/outline/${pascalCase(name)}Icon.vue`)
  )
})

function pascalCase(str: string) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}
```

## Dialog Stack

To use dialogs, add the `DialogStack` component to your app root:

```vue
<!-- App.vue -->
<template>
  <router-view />
  <DialogStack />
</template>

<script setup>
import { DialogStack } from 'vuiii'
</script>
```

Then use the `useDialogStack` composable anywhere:

```typescript
import { useDialogStack } from 'vuiii'

const dialog = useDialogStack()

// Show an alert
await dialog.alert('Operation completed!')

// Show a confirmation
const confirmed = await dialog.confirm('Are you sure?')
```

## Snackbar Stack

To use snackbar notifications, add the `SnackbarStack` component to your app root:

```vue
<!-- App.vue -->
<template>
  <router-view />
  <SnackbarStack />
</template>

<script setup>
import { SnackbarStack } from 'vuiii'
</script>
```

Then use the `useSnackbar` composable:

```typescript
import { useSnackbar } from 'vuiii'

const snackbar = useSnackbar()

snackbar.success('Item saved!')
snackbar.error('Something went wrong')
snackbar.info('Processing...')
```
