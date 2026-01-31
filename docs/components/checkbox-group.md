# CheckboxGroup

Group of checkboxes for multi-select from a list of options.
Normalizes various option formats and supports custom value parsing.

## Import

```typescript
import { CheckboxGroup } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { CheckboxGroup } from '../../src'
</script>

<ComponentDemo storybook="example-checkboxgroup--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage with string array
import { CheckboxGroup } from 'vuiii'

<CheckboxGroup v-model="selectedFruits" :options="['Apple', 'Banana', 'Cherry']" />
```

## More Examples

```vue
// With object options and extractors
const permissions = [
  { id: 'read', name: 'Read', info: 'View content' },
  { id: 'write', name: 'Write', info: 'Edit content' },
  { id: 'delete', name: 'Delete', info: 'Remove content' }
]

<CheckboxGroup
  v-model="selectedPermissions"
  :options="permissions"
  option-value="id"
  option-label="name"
  option-description="info"
/>
```

```vue
// Inline layout (horizontal)
<CheckboxGroup
  v-model="selected"
  :options="['Option A', 'Option B', 'Option C']"
  inline
/>
```

```vue
// With type parsing (values will be numbers)
<CheckboxGroup
  v-model="selectedIds"
  :options="[{ id: 1, name: 'One' }, { id: 2, name: 'Two' }]"
  option-value="id"
  option-label="name"
  type="number"
/>
```

::: tip Storybook
For interactive examples with all variants, see [CheckboxGroup in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-checkboxgroup--docs).
:::
