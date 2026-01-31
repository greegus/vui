# useLoadPaginatedData

Extends useLoadData with pagination support for loading data in pages.
Provides methods for loading specific pages, next/previous navigation,
and optional append mode for infinite scroll.

## Import

```typescript
import { useLoadPaginatedData } from 'vuiii'
```

## Usage

```typescript
// Basic paginated data loading
import { useLoadPaginatedData } from 'vuiii'
import type { PaginatedData } from 'vuiii'

const { items, pagination, loadPage, isLoading } = useLoadPaginatedData(
  ({ page, itemsPerPage }) => api.getUsers({ page, itemsPerPage })
)

onMounted(() => loadPage(1))
```

## More Examples

```typescript
// With immediate loading
const { items, pagination } = useLoadPaginatedData(
  ({ page, itemsPerPage }) => api.getItems({ page, itemsPerPage }),
  { immediate: true }
)
```

```typescript
// Navigation between pages
const { loadPage, loadNextPage, loadPreviousPage, pagination } = useLoadPaginatedData(source)

await loadPage(1)  // Load first page
await loadNextPage()  // Go to page 2
await loadPreviousPage()  // Back to page 1
await loadPage(5)  // Jump to page 5
```

