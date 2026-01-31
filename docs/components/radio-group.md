# RadioGroup

Radio button group for single selection from a list of options.
Normalizes various option formats and supports custom value parsing.

## Import

```typescript
import { RadioGroup } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { RadioGroup } from '../../src'
</script>

<ComponentDemo storybook="example-radiogroup--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage with string array
import { RadioGroup } from 'vuiii'

<RadioGroup v-model="color" :options="['Red', 'Green', 'Blue']" />
```

## More Examples

```vue
// With object options and extractors
const plans = [
  { id: 'free', name: 'Free', info: '0$/month' },
  { id: 'pro', name: 'Pro', info: '10$/month' },
  { id: 'enterprise', name: 'Enterprise', info: 'Contact us' }
]

<RadioGroup
  v-model="selectedPlan"
  :options="plans"
  option-value="id"
  option-label="name"
  option-description="info"
/>
```

```vue
// Inline layout (horizontal)
<RadioGroup
  v-model="size"
  :options="['Small', 'Medium', 'Large']"
  inline
/>
```

```vue
// With type parsing
<RadioGroup
  v-model="quantity"
  :options="[1, 2, 3, 4, 5]"
  type="number"
/>
```

::: tip Storybook
For interactive examples with all variants, see [RadioGroup in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-radiogroup--docs).
:::
