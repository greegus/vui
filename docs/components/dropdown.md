# Dropdown

Popover dropdown component with customizable trigger and content.
Closes on click outside or Escape key. Supports programmatic control.

## Import

```typescript
import { Dropdown } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Dropdown } from '../../src'
</script>

<ComponentDemo storybook="example-dropdown--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic dropdown with default button trigger
import { Dropdown, DropdownMenu } from 'vuiii'

<Dropdown label="Options" variant="primary">
  <DropdownMenu :items="menuItems" @itemClick="handleClick" />
</Dropdown>
```

## More Examples

```vue
// With custom trigger slot
<Dropdown>
  <template #trigger="{ open, close, toggle, isOpen }">
    <IconButton icon="ellipsis-vertical" @click="toggle()" />
  </template>

  <template #default="{ close }">
    <div class="custom-dropdown-content">
      <button @click="doSomething(); close()">Action</button>
    </div>
  </template>
</Dropdown>
```

```vue
// Programmatic control via ref
const dropdownRef = ref<DropdownRef>()

// Open/close programmatically
dropdownRef.value?.open()
dropdownRef.value?.close()
dropdownRef.value?.toggle()

// Check state
if (dropdownRef.value?.isOpen.value) { ... }
```

```vue
// With dropdown placement control
<Dropdown label="Menu" dropdown-placement="right">
  <DropdownMenu :items="items" />
</Dropdown>
```

::: tip Storybook
For interactive examples with all variants, see [Dropdown in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-dropdown--docs).
:::
