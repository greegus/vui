# usePreventHandlingDrop

Prevents the browser's default drag-and-drop file handling on an element.
Useful when you want to disable file drops on the page or specific areas.
By default, applies to document.body to prevent accidental file navigation.

## Import

```typescript
import { usePreventHandlingDrop } from 'vuiii'
```

## Usage

```typescript
// Prevent file drops on the entire page
import { usePreventHandlingDrop } from 'vuiii'

usePreventHandlingDrop()
```

## More Examples

```typescript
// Prevent drops on a specific element
const containerRef = ref<HTMLElement>()

onMounted(() => {
  usePreventHandlingDrop(containerRef.value)
})
```

