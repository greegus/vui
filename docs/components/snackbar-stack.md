# SnackbarStack

Container component for displaying toast notifications. Add this component once at your app root to enable the snackbar system.

## Import

```typescript
import { SnackbarStack } from 'vuiii'
```

## Setup

Add `SnackbarStack` to your app root (typically App.vue):

```vue
<template>
  <router-view />
  <SnackbarStack />
</template>

<script setup>
import { SnackbarStack } from 'vuiii'
</script>
```

## Usage with useSnackbar

Once SnackbarStack is mounted, use the `useSnackbar` composable to show notifications:

```typescript
import { useSnackbar } from 'vuiii'

const snackbar = useSnackbar()

// Show different message types
snackbar.success('Item saved successfully!')
snackbar.error('Failed to save item')
snackbar.info('Processing your request...')
snackbar.warning('This action cannot be undone')
```

## Auto-dismiss

Messages automatically dismiss after 7 seconds by default. Users can also manually dismiss messages by clicking the close button.

## Message Types

| Method | Description |
|--------|-------------|
| `success(message)` | Green success notification |
| `error(message)` | Red error notification |
| `info(message)` | Blue informational notification |
| `warning(message)` | Yellow warning notification |

