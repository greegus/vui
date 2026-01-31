# useLoadData

Wraps a data loading function with loading state, error handling,
and optional success/error messages. Built on top of useSubmitAction.

## Import

```typescript
import { useLoadData } from 'vuiii'
```

## Usage

```typescript
// Basic data loading
import { useLoadData } from 'vuiii'

const { load, isLoading, data } = useLoadData(
  () => api.fetchUsers()
)

onMounted(load)

// In template
<div v-if="isLoading">Loading...</div>
<div v-else>{{ data }}</div>
```

## More Examples

```typescript
// With immediate loading
const { isLoading, data } = useLoadData(
  () => api.fetchUsers(),
  { immediate: true }
)
```

```typescript
// With parameters
const { load, data } = useLoadData(
  (userId: string) => api.getUser(userId)
)

await load('user-123')
console.log(data.value) // user data
```

