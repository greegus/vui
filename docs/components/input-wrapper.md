# InputWrapper

The chrome shared by `Input`, `Select`, `Textarea` and `Autocomplete` — border, sizing, focus ring,
invalid state and the prefix/suffix icon slots. Reach for it when you need a control the library
does not ship but want it to sit flush with the ones it does.

::: tip Composition
The chrome shared by the built-in inputs — use it to build your own. See [Composing Forms](/getting-started/composing-forms).
:::

## Import

```typescript
import { InputWrapper } from 'vuiii'
```

## Basic Usage

Give the inner element the `vuiii-input__nested` class so it inherits the typography and padding
instead of bringing its own.

<script setup>
import { ref } from 'vue'
import { InputWrapper } from '../../src'

const date = ref('')
const amount = ref('')
</script>

<ComponentDemo storybook="components-inputwrapper--default">
  <div style="width: 100%">
    <InputWrapper prefix-icon="mail">
      <input class="vuiii-input__nested" type="email" placeholder="you@example.com" />
    </InputWrapper>
  </div>
</ComponentDemo>

```vue
<InputWrapper prefix-icon="mail">
  <input class="vuiii-input__nested" type="email" v-model="email" />
</InputWrapper>
```

## Props

| Prop              | Type                             | Default    | Description                                          |
| ----------------- | -------------------------------- | ---------- | ---------------------------------------------------- |
| `prefixIcon`      | `string`                         | -          | Icon name shown before the control                   |
| `suffixIcon`      | `string`                         | -          | Icon name shown after the control                    |
| `prefixIconLabel` | `string`                         | -          | Accessible label for a clickable prefix icon         |
| `suffixIconLabel` | `string`                         | -          | Accessible label for a clickable suffix icon         |
| `size`            | `'small' \| 'normal' \| 'large'` | `'normal'` | Control size                                         |
| `invalid`         | `boolean`                        | `false`    | Applies the invalid/error styling                    |
| `pill`            | `boolean`                        | `false`    | Rounded pill shape                                   |

## Slots

| Slot      | Description                                      |
| --------- | ------------------------------------------------ |
| `default` | The control itself                               |
| `prefix`  | Content before the control (replaces prefixIcon) |
| `suffix`  | Content after the control (replaces suffixIcon)  |

## Events

| Event               | Payload | Description                     |
| ------------------- | ------- | ------------------------------- |
| `prefix-icon-click` | -       | When the prefix icon is clicked |
| `suffix-icon-click` | -       | When the suffix icon is clicked |

## Sizes and Validation State

The same props the built-in inputs expose, because they forward them straight here.

<ComponentDemo>
  <div style="display: flex; flex-flow: column; gap: 0.75rem; width: 100%;">
    <InputWrapper size="small"><input class="vuiii-input__nested" placeholder="Small" /></InputWrapper>
    <InputWrapper size="large"><input class="vuiii-input__nested" placeholder="Large" /></InputWrapper>
    <InputWrapper invalid><input class="vuiii-input__nested" placeholder="Invalid" /></InputWrapper>
    <InputWrapper pill><input class="vuiii-input__nested" placeholder="Pill" /></InputWrapper>
  </div>
</ComponentDemo>

```vue
<InputWrapper size="small"><input class="vuiii-input__nested" v-model="value" /></InputWrapper>
<InputWrapper :invalid="hasError"><input class="vuiii-input__nested" v-model="value" /></InputWrapper>
<InputWrapper pill><input class="vuiii-input__nested" v-model="value" /></InputWrapper>
```

## Clickable Icons

An icon becomes a focusable button only when something listens for its click event — otherwise it
stays decorative and out of the tab order. Pass a label so it is announced.

<ComponentDemo>
  <div style="width: 100%">
    <InputWrapper
      prefix-icon="search"
      suffix-icon="x"
      suffix-icon-label="Clear"
      @suffix-icon-click="amount = ''"
    >
      <input class="vuiii-input__nested" v-model="amount" placeholder="Type, then clear" />
    </InputWrapper>
  </div>
</ComponentDemo>

```vue
<InputWrapper
  prefix-icon="search"
  suffix-icon="x"
  suffix-icon-label="Clear"
  @suffix-icon-click="query = ''"
>
  <input class="vuiii-input__nested" v-model="query" />
</InputWrapper>
```

## Building a Native Date Field

The library ships no date picker, but a native `<input type="date">` inside `InputWrapper` matches
the rest of a form for free.

<ComponentDemo>
  <div style="width: 100%">
    <InputWrapper>
      <input class="vuiii-input__nested" type="date" v-model="date" />
    </InputWrapper>
  </div>
</ComponentDemo>

```vue
<InputWrapper prefix-icon="calendar">
  <input class="vuiii-input__nested" type="date" v-model="date" />
</InputWrapper>
```

## Custom Prefix and Suffix Content

The `prefix` and `suffix` slots replace the icons entirely — for a currency symbol, a unit, or a
whole nested control.

<ComponentDemo>
  <div style="width: 100%">
    <InputWrapper>
      <template #prefix><span style="padding-left: 0.75rem">€</span></template>
      <input class="vuiii-input__nested" type="number" placeholder="0.00" />
      <template #suffix><span style="padding-right: 0.75rem; opacity: 0.6">per month</span></template>
    </InputWrapper>
  </div>
</ComponentDemo>

```vue
<InputWrapper>
  <template #prefix><span>€</span></template>
  <input class="vuiii-input__nested" type="number" v-model="price" />
  <template #suffix><span>per month</span></template>
</InputWrapper>
```

::: tip Storybook
For interactive examples with all variants, see [InputWrapper in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-inputwrapper--docs).
:::
