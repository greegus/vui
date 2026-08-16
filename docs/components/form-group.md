# FormGroup

Form field wrapper with label, description, hint, and error message support.
Used by FormFields internally, but can be used standalone for custom form layouts.

::: tip Composition
Labels a single control. For how it relates to `FormFields` and `InputWrapper`, see [Composing Forms](/getting-started/composing-forms).
:::

## Import

```typescript
import { FormGroup } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { FormGroup } from '../../src'
</script>

<ComponentDemo storybook="components-formgroup--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage with label import { FormGroup, Input } from 'vuiii'

<FormGroup label="Email">
  <Input v-model="email" type="email" />
</FormGroup>
```

## More Examples

```vue
// With description and hint
<FormGroup
  label="Password"
  description="Choose a strong password for your account"
  hint="Must be at least 8 characters"
>
  <Input v-model="password" type="password" />
</FormGroup>
```

```vue
// With required indicator and validation error
<FormGroup label="Username" required :error="errors.username">
  <Input v-model="username" :invalid="!!errors.username" />
</FormGroup>
```

```vue
// With custom label slot
<FormGroup>
  <template #label>
    <span>Email</span>
    <Icon name="info" v-tooltip="'We will never share your email'" />
  </template>
  <Input v-model="email" />
</FormGroup>
```

::: tip Storybook
For interactive examples with all variants, see [FormGroup in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-formgroup--docs).
:::
