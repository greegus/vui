# dialogStack

Dialog stack system for managing modal dialogs with promise-based APIs.
Supports custom dialog components, alerts, and confirmation dialogs.

## Import

```typescript
import { dialogStack } from 'vuiii'
```

## Usage

```typescript
// Setup: Add DialogStack component to your app root
import { DialogStack } from 'vuiii'

// In App.vue
<template>
  <router-view />
  <DialogStack />
</template>
```

## More Examples

```typescript
// Open a simple alert
import { useDialogStack } from 'vuiii'

const dialog = useDialogStack()
await dialog.alert('Operation completed!')
```

```typescript
// Open a confirmation dialog
const confirmed = await dialog.confirm('Are you sure you want to delete?')
if (confirmed) {
  deleteItem()
}
```

