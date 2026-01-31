# DialogStack

Container component for displaying modal dialogs. Add this component once at your app root to enable the dialog system.

## Import

```typescript
import { DialogStack } from 'vuiii'
```

## Setup

Add `DialogStack` to your app root (typically App.vue):

```vue
<template>
  <router-view />
  <DialogStack />
</template>

<script setup>
import { DialogStack } from 'vuiii'
</script>
```

## Usage with useDialogStack

Once DialogStack is mounted, use the `useDialogStack` composable to show dialogs:

```typescript
import { useDialogStack } from 'vuiii'

const dialog = useDialogStack()

// Show an alert
await dialog.alert('Operation completed!')

// Show a confirmation dialog
const confirmed = await dialog.confirm('Are you sure you want to delete this item?')
if (confirmed) {
  // User clicked confirm
}

// Show a custom dialog component
const result = await dialog.open(MyCustomDialog, {
  title: 'Edit User',
  user: userData
})
```

## Custom Dialog Components

Create custom dialogs by emitting a `close` event with the result:

```vue
<template>
  <DialogLayout title="Edit User" @close="$emit('close')">
    <form @submit.prevent="save">
      <Input v-model="name" label="Name" />
      <Button type="submit" label="Save" />
    </form>
  </DialogLayout>
</template>

<script setup>
import { DialogLayout, Input, Button } from 'vuiii'

const props = defineProps(['user'])
const emit = defineEmits(['close'])

const name = ref(props.user.name)

function save() {
  emit('close', { name: name.value })
}
</script>
```

