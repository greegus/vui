# usePageFromRouteQuery

Simplified composable for pagination via URL query parameter.
Built on top of useRouteQuery, specifically for managing a 'page' parameter.

## Import

```typescript
import { usePageFromRouteQuery } from 'vuiii'
```

## Usage

```typescript
// Basic pagination
import { usePageFromRouteQuery } from 'vuiii'

const { page, setPage } = usePageFromRouteQuery({
  onChange: (page) => loadPage(page),
  immediate: true
})

// In template
<Pagination :current="page" @change="setPage" />
```

