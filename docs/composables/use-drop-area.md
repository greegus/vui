# useDropArea

Enables drag-and-drop file handling on an element.
Provides dropzone active state for visual feedback.

## Import

```typescript
import { useDropArea } from 'vuiii'
```

## Usage

```typescript
// Basic usage
import { useDropArea } from 'vuiii'

const dropElement = ref<HTMLElement>()

const { isDropzoneActive } = useDropArea(
  dropElement,
  (files) => console.log('Dropped files:', files)
)

// In template
<div
  ref="dropElement"
  :class="{ 'dropzone-active': isDropzoneActive }"
>
  Drop files here
</div>
```

## More Examples

```typescript
// With file type filter
useDropArea(
  dropElement,
  handleFiles,
  { accept: 'image/*' }
)
```

```typescript
// Multiple files with specific types
useDropArea(
  dropElement,
  handleFiles,
  {
    accept: ['image/png', 'image/jpeg', 'application/pdf'],
    multiple: true
  }
)
```

