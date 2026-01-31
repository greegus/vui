# useOnFocusOutside

Detects when focus moves outside an element and triggers a callback.
Useful for closing dropdowns or popovers when the user tabs away.
Automatically cleans up the event listener when the component unmounts.

## Import

```typescript
import { useOnFocusOutside } from 'vuiii'
```

## Usage

```typescript
// Basic usage - close dropdown when focus leaves
import { useOnFocusOutside } from 'vuiii'

const dropdownRef = ref<HTMLElement>()
const isOpen = ref(false)

useOnFocusOutside(dropdownRef, () => {
  isOpen.value = false
})
```

## More Examples

```typescript
// With form validation on blur
const formRef = ref<HTMLElement>()

useOnFocusOutside(formRef, (event) => {
  validateForm()
})
```

