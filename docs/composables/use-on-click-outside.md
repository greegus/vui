# useOnClickOutside

Detects clicks outside an element and triggers a callback.
Useful for closing dropdowns, modals, or popovers when clicking outside.
Automatically cleans up the event listener when the component unmounts.

## Import

```typescript
import { useOnClickOutside } from 'vuiii'
```

## Usage

```typescript
// Basic usage - close dropdown on outside click
import { useOnClickOutside } from 'vuiii'

const dropdownRef = ref<HTMLElement>()
const isOpen = ref(false)

useOnClickOutside(dropdownRef, () => {
  isOpen.value = false
})

// In template
<div ref="dropdownRef" v-if="isOpen">
  Dropdown content
</div>
```

## More Examples

```typescript
// With modal dialog
const modalRef = ref<HTMLElement>()

useOnClickOutside(modalRef, (event) => {
  // Access the click event if needed
  console.log('Clicked outside at:', event.clientX, event.clientY)
  closeModal()
})
```

