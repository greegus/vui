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

const name = ref('')
const email = ref('')
const password = ref('')
const count = ref()
const search = ref('')
const clearable = ref('Clear me')
</script>

<ComponentDemo storybook="components-input--default">
  <Input v-model="name" placeholder="Enter your name" />
</ComponentDemo>

```vue
<Input v-model="name" placeholder="Enter your name" />
```

## Props

| Prop            | Type                             | Default   | Description                                       |
| --------------- | -------------------------------- | --------- | ------------------------------------------------- |
| `modelValue`    | `string \| number \| Date \| null` | -         | Bound value (use with `v-model`)                  |
| `prefixIcon`    | `string`                         | -         | Icon name to show before the input                |
| `suffixIcon`    | `string`                         | -         | Icon name to show after the input                 |
| `prefixIconLabel` | `string`                       | -         | Accessible label for a clickable prefix icon      |
| `suffixIconLabel` | `string`                       | -         | Accessible label for a clickable suffix icon      |
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

## Input Types

`type` and the other native attributes pass straight through to the underlying `<input>`.

<ComponentDemo>
  <div style="display: flex; flex-flow: column; gap: 0.75rem; width: 100%;">
    <Input v-model="email" type="email" placeholder="Email" />
    <Input v-model="password" type="password" placeholder="Password" />
    <Input v-model="count" type="number" placeholder="Count" />
  </div>
</ComponentDemo>

```vue
<Input v-model="email" type="email" placeholder="Email" />
<Input v-model="password" type="password" placeholder="Password" />
<Input v-model="count" type="number" placeholder="Count" />
```

### Typed values

A native input always reports a string. `valueAsNumber` and `valueAsDate` make the model receive the
parsed value instead, so you do not convert on every change.

```vue
<!-- count is a number -->
<Input v-model="count" type="number" value-as-number />

<!-- startsOn is a Date -->
<Input v-model="startsOn" type="date" value-as-date />
```

## With Icons

<ComponentDemo>
  <div style="display: flex; flex-flow: column; gap: 0.75rem; width: 100%;">
    <Input v-model="search" prefix-icon="search" placeholder="Search..." />
    <Input v-model="email" suffix-icon="mail" placeholder="Email" />
  </div>
</ComponentDemo>

```vue
<Input v-model="search" prefix-icon="search" placeholder="Search..." />
<Input v-model="email" suffix-icon="mail" placeholder="Email" />
```

## Clickable Icons

Attach a listener to `prefix-icon-click` or `suffix-icon-click` and the icon becomes a real,
focusable button — a decorative icon stays inert. Give it a label so it is announced.

<ComponentDemo>
  <Input v-model="clearable" suffix-icon="x" suffix-icon-label="Clear" @suffix-icon-click="clearable = ''" />
</ComponentDemo>

```vue
<Input
  v-model="query"
  suffix-icon="x"
  suffix-icon-label="Clear"
  @suffix-icon-click="query = ''"
/>
```

## Sizes and Validation State

<ComponentDemo>
  <div style="display: flex; flex-flow: column; gap: 0.75rem; width: 100%;">
    <Input size="small" placeholder="Small" />
    <Input size="normal" placeholder="Normal" />
    <Input size="large" placeholder="Large" />
    <Input invalid placeholder="Invalid" />
    <Input pill placeholder="Pill" />
    <Input disabled placeholder="Disabled" />
  </div>
</ComponentDemo>

```vue
<Input v-model="value" size="small" placeholder="Small" />
<Input v-model="value" :invalid="!!errors.value" placeholder="Invalid" />
<Input v-model="value" pill placeholder="Pill" />
<Input v-model="value" disabled placeholder="Disabled" />
```

To pair the invalid state with a label and an error message, wrap it in
[FormGroup](/components/form-group) — see [Composing Forms](/getting-started/composing-forms).

::: tip Storybook
For interactive examples with all variants, see [Input in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-input--docs).
:::
