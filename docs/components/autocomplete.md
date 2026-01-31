# Autocomplete

Autocomplete input with dropdown suggestions and keyboard navigation.
Supports custom option rendering, filtering, and various data formats.

## Import

```typescript
import { Autocomplete } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Autocomplete } from '../../src'
</script>

<ComponentDemo storybook="example-autocomplete--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage with string array
import { Autocomplete } from 'vuiii'

<Autocomplete v-model="search" :options="['Apple', 'Banana', 'Cherry']" />
```

## More Examples

```vue
// With object options and extractors
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
]

<Autocomplete
  v-model="search"
  :options="users"
  option-label="name"
  option-value="id"
  option-description="email"
  @select="(option) => selectedUser = option.data"
/>
```

```vue
// With custom filter function
const customFilter = (option, query) => {
  return option.label.startsWith(query)
}

<Autocomplete
  v-model="search"
  :options="options"
  :filter="customFilter"
/>
```

```vue
// With custom option rendering
<Autocomplete v-model="search" :options="users" option-label="name">
  <template #option="{ option, isHighlighted }">
    <div :class="{ highlighted: isHighlighted }">
      <strong>{{ option.label }}</strong>
      <small>{{ option.description }}</small>
    </div>
  </template>
</Autocomplete>
```

::: tip Storybook
For interactive examples with all variants, see [Autocomplete in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-autocomplete--docs).
:::
