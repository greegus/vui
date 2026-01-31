# useSubmitAction

Wraps an async action with submission state tracking, error handling,
success/error messages, and optional redirect on success.

## Import

```typescript
import { useSubmitAction } from 'vuiii'
```

## Usage

```typescript
// Basic form submission
import { useSubmitAction } from 'vuiii'

const { submit, isSubmitting } = useSubmitAction(
  (data) => api.createUser(data),
  {
    successMessage: 'User created!',
    errorMessage: 'Failed to create user',
    redirectOnSuccess: { name: 'users' }
  }
)

// In template
<Button :loading="isSubmitting" @click="submit(formData)">Save</Button>
```

## More Examples

```typescript
// With confirmation before submit
const { submit, isSubmitting } = useSubmitAction(
  (id) => api.deleteUser(id),
  {
    onBeforeSubmit: async ({ dialog }) => {
      return await dialog.confirm('Are you sure?')
    },
    successMessage: 'User deleted'
  }
)
```

```typescript
// With dynamic messages
const { submit, result } = useSubmitAction(
  (data) => api.saveItem(data),
  {
    successMessage: ({ result }) => `Saved item ${result.id}`,
    errorMessage: ({ error }) => `Error: ${error.message}`
  }
)
```

