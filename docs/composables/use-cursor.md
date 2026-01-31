# useCursor

A composable that manages the "cursor" over an iterable set of data

For example it is used internally by [Autocomplete](/components/autocomplete) for keyboard navigation (arrows down and up) over the list suggestions.

## Usage

```typescript
// Basic usage
import { useCursor } from "vuiii";

const items = ref(["Apple", "Banana", "Cherry"]);

const { cursorIndex, cursorItem, moveCursorForward, moveCursorBack, resetCursor } = useCursor(items, {
  cycle: true,
});

console.log(cursorItem.value); // 'Apple'
moveCursorForward();
console.log(cursorItem.value); // 'Banana'
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `items` | `Ref<T[]> \| T[]` | Array or ref to array of items to navigate |
| `options` | `object` | Optional configuration |
| `options.cycle` | `boolean` | Wrap around when reaching start/end (default: `false`) |
| `options.onCursorMove` | `() => void` | Callback when cursor position changes |

## Returns

| Property | Type | Description |
|----------|------|-------------|
| `cursorIndex` | `Ref<number>` | Current cursor position (0-indexed) |
| `cursorItem` | `ComputedRef<T>` | Item at current cursor position |
| `moveCursorForward` | `() => void` | Move cursor to next item |
| `moveCursorBack` | `() => void` | Move cursor to previous item |
| `resetCursor` | `() => void` | Reset cursor to first item (index 0) |

## More Examples

```typescript
// With cycling
const { moveCursorForward } = useCursor(items, { cycle: true });
// At last item, moveCursorForward() goes back to first
```

```typescript
// Handle keyboard navigation
function handleKeydown(e: KeyboardEvent) {
  if (e.key === "ArrowDown") moveCursorForward();
  if (e.key === "ArrowUp") moveCursorBack();
  if (e.key === "Enter") selectItem(cursorItem.value);
}
```
