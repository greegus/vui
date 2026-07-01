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

<ComponentDemo storybook="components-input--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage import { Input } from 'vuiii'

<Input v-model="name" placeholder="Enter your name" />
```

## Props

| Prop            | Type                             | Default   | Description                                       |
| --------------- | -------------------------------- | --------- | ------------------------------------------------- |
| `modelValue`    | `string \| number \| Date \| null` | -         | Bound value (use with `v-model`)                  |
| `prefixIcon`    | `string`                         | -         | Icon name to show before the input                |
| `suffixIcon`    | `string`                         | -         | Icon name to show after the input                 |
| `size`          | `'small' \| 'normal' \| 'large'` | `'normal'` | Input size                                        |
| `invalid`       | `boolean`                        | `false`   | Applies the invalid/error styling                 |
| `pill`          | `boolean`                        | `false`   | Rounded pill shape                                |
| `disabled`      | `boolean`                        | `false`   | Disables the input (native attribute)             |
| `placeholder`   | `string`                         | -         | Placeholder text (native attribute)               |
| `type`          | `string`                         | `'text'`  | Native input type (native attribute)              |
| `valueAsNumber` | `boolean`                        | `false`   | Emits the value as a number (for `type="number"`) |
| `valueAsDate`   | `boolean`                        | `false`   | Emits the value as a Date (for `type="date"`)     |
| `inputClass`    | `any`                            | -         | Class applied to the nested `<input>` element     |

## Slots

| Slot     | Description                                  |
| -------- | -------------------------------------------- |
| `prefix` | Content before the input (replaces prefixIcon) |
| `suffix` | Content after the input (replaces suffixIcon)  |

## Events

| Event               | Payload | Description                |
| ------------------- | ------- | ------------------------- |
| `prefix-icon-click` | -       | When the prefix icon is clicked |
| `suffix-icon-click` | -       | When the suffix icon is clicked |

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
For interactive examples with all variants, see [Input in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-input--docs).
:::
