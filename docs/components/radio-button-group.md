# RadioButtonGroup

Button-styled radio group for single selection with visual button appearance.
Each option is rendered as a Button within a ButtonGroup.

## Import

```typescript
import { RadioButtonGroup } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { RadioButtonGroup } from '../../src'
</script>

<ComponentDemo storybook="example-radiobuttongroup--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage
<RadioButtonGroup v-model="view" :options="['List', 'Grid', 'Table']" />
```

## More Examples

```vue
// With object options
<RadioButtonGroup
  v-model="status"
  :options="[{ id: 'active', name: 'Active' }, { id: 'inactive', name: 'Inactive' }]"
  option-value="id"
  option-label="name"
/>
```

```vue
// With icons
<RadioButtonGroup
  v-model="view"
  :options="[
    { value: 'list', label: 'List', icon: 'list' },
    { value: 'grid', label: 'Grid', icon: 'grid' }
  ]"
  option-value="value"
  option-label="label"
  option-icon="icon"
/>
```

::: tip Storybook
For interactive examples with all variants, see [RadioButtonGroup in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-radiobuttongroup--docs).
:::
