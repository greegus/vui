# Input

Text input component with icon support, size variants, and validation states.
Wraps native input with InputWrapper for consistent styling.

## Import

```typescript
import { Input } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Input } from '../../src'
</script>

<ComponentDemo storybook="example-input--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage
import { Input } from 'vuiii'

<Input v-model="name" placeholder="Enter your name" />
```

## More Examples

```vue
// Different input types (passed via attrs)
<Input v-model="email" type="email" placeholder="Email" />
<Input v-model="password" type="password" placeholder="Password" />
<Input v-model="count" type="number" placeholder="Count" />
```

```vue
// With icons
<Input v-model="search" prefixIcon="magnifying-glass" placeholder="Search..." />
<Input v-model="email" suffixIcon="envelope" placeholder="Email" />
```

```vue
// With clickable icons (emits events)
<Input
  v-model="password"
  :suffix-icon="showPassword ? 'eye-slash' : 'eye'"
  :type="showPassword ? 'text' : 'password'"
  @suffix-icon-click="showPassword = !showPassword"
/>
```

::: tip Storybook
For interactive examples with all variants, see [Input in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-input--docs).
:::
