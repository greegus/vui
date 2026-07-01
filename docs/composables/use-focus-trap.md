# useFocusTrap

A composable that traps keyboard focus within an element and restores it when the trap is torn down.

It is used internally by `DialogLayout` to keep `Tab` / `Shift+Tab` focus cycling inside an open
modal dialog. On mount it moves focus into the container (the first focusable descendant, the
container itself as a fallback, or the element returned by `options.initialFocus`), and on unmount
it restores focus to the element that was focused before the trap was set up.

## Import

```typescript
import { useFocusTrap } from 'vuiii'
```

## Usage

```typescript
import { ref } from 'vue'
import { useFocusTrap } from 'vuiii'

const root = ref<HTMLElement>()

useFocusTrap(root)

// In template
<div ref="root">
  <input />
  <button>Save</button>
</div>
```

## Parameters

| Parameter              | Type                                    | Description                                                                                     |
| ---------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `element`              | `Ref<HTMLElement \| undefined>`         | Ref to the container element that should trap focus                                             |
| `options`              | `object`                                | Optional configuration                                                                          |
| `options.initialFocus` | `() => HTMLElement \| null \| undefined` | Resolver for the element to focus on mount. Defaults to the first focusable descendant, falling back to the container itself |

## Returns

`void` — the trap installs and cleans up its own event listeners via the component lifecycle.

## More Examples

```typescript
// Focus a specific element on mount
const root = ref<HTMLElement>()
const confirmButton = ref<HTMLButtonElement>()

useFocusTrap(root, {
  initialFocus: () => confirmButton.value,
})
```
