# useOnKeyPress

Listens for a specific keyboard key press and triggers a callback.
Automatically sets up the listener on mount and cleans up on unmount.

## Import

```typescript
import { useOnKeyPress } from 'vuiii'
```

## Usage

```typescript
// Basic usage - close modal on Escape
import { useOnKeyPress } from 'vuiii'

useOnKeyPress('Escape', () => {
  closeModal()
})
```

## More Examples

```typescript
// Save on Ctrl+S with event handling
useOnKeyPress('s', (event) => {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault()
    saveDocument()
  }
})
```

```typescript
// With event listener options
useOnKeyPress('Enter', handleSubmit, { capture: true })
```

