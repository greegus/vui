# Checkbox

Checkbox input with toggle/switch variant and indeterminate state support.
Can be used standalone or within CheckboxGroup.

## Import

```typescript
import { Checkbox } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Checkbox } from '../../src'
</script>

<ComponentDemo storybook="example-checkbox--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage
import { Checkbox } from 'vuiii'

<Checkbox v-model="accepted" label="I accept the terms" />
```

## More Examples

```vue
// Switch variant (toggle)
<Checkbox v-model="enabled" switch label="Enable notifications" />
```

```vue
// With description
<Checkbox
  v-model="newsletter"
  label="Subscribe to newsletter"
  description="Get weekly updates about new features"
/>
```

```vue
// Required checkbox
<Checkbox v-model="terms" required label="I agree to the terms" />
```

::: tip Storybook
For interactive examples with all variants, see [Checkbox in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-checkbox--docs).
:::
