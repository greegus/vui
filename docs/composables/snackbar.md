# snackbar

Snackbar/toast notification system for displaying brief messages.
Messages auto-dismiss after a configurable duration (default 7 seconds).

## Import

```typescript
import { snackbar } from 'vuiii'
```

## Usage

```typescript
// Setup: Add SnackbarStack component to your app root
import { SnackbarStack } from 'vuiii'

// In App.vue
<template>
  <router-view />
  <SnackbarStack />
</template>
```

## More Examples

```typescript
// Show success message
import { useSnackbar } from 'vuiii'

const snackbar = useSnackbar()
snackbar.success('Item saved!')
```

```typescript
// Show error message
snackbar.error('Failed to save item')
```

