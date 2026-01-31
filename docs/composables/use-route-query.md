# useRouteQuery

Reactive binding for URL query parameters with Vue Router.
Supports filtering, parsing, serialization, and default values.

## Import

```typescript
import { useRouteQuery } from 'vuiii'
```

## Usage

```typescript
// Basic usage - sync filters with URL
import { useRouteQuery } from 'vuiii'

const { queryParams, setQuery, setQueryParam } = useRouteQuery<{
  search: string
  category: string
}>({
  filter: ['search', 'category'],
  defaults: { category: 'all' }
})

// Read current params
console.log(queryParams.value.search)

// Update single param
setQueryParam('search', 'hello')

// Update multiple params
setQuery({ search: 'hello', category: 'books' })
```

## More Examples

```typescript
// With onChange callback for data fetching
const { queryParams } = useRouteQuery({
  filter: ['page', 'sort'],
  parse: { page: (v) => Number(v) || 1 },
  onChange: (params) => fetchData(params),
  immediate: true
})
```

