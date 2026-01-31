# InputWrapper

Base wrapper component for input styling. Used internally by Input, Select, Autocomplete.
Provides consistent styling, icon slots, and size variants across all input components.

## Import

```typescript
import { InputWrapper } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { InputWrapper } from '../../src'
</script>

<ComponentDemo storybook="example-inputwrapper--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Typically used internally, but can be used for custom inputs
import { InputWrapper } from 'vuiii'

<InputWrapper size="normal" prefix-icon="user">
  <input class="vuiii-input__nested" v-model="value" />
</InputWrapper>
```

## More Examples

```vue
// With validation state
<InputWrapper :invalid="hasError" size="normal">
  <input class="vuiii-input__nested" v-model="value" />
</InputWrapper>
```

```vue
// With clickable icons
<InputWrapper
  suffix-icon="x-mark"
  @suffix-icon-click="clearValue"
>
  <input class="vuiii-input__nested" v-model="value" />
</InputWrapper>
```

::: tip Storybook
For interactive examples with all variants, see [InputWrapper in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-inputwrapper--docs).
:::
