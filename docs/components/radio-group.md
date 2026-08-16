# RadioGroup

Radio button group for single selection from a list of options.
Normalizes various option formats and supports custom value parsing.

::: tip Shared option API
Accepts the shared option formats — primitive arrays, object arrays with extractors and key-value objects. See [Option Extractors](/getting-started/option-extractors).
:::

## Import

```typescript
import { RadioGroup } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { RadioGroup } from '../../src'
</script>

<ComponentDemo storybook="components-radiogroup--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage with string array import { RadioGroup } from 'vuiii'

<RadioGroup v-model="color" :options="['Red', 'Green', 'Blue']" />
```

## Props

| Prop                | Type                                            | Default    | Description                                    |
| ------------------- | ----------------------------------------------- | ---------- | ---------------------------------------------- |
| `modelValue`        | `any`                                            | -          | Selected value (`v-model`)                     |
| `options`           | `any[] \| Record<string, any>`                  | -          | Options to render as radio buttons             |
| `optionLabel`       | `string \| ((item) => any)`                     | -          | Key or function to extract the display label   |
| `optionValue`       | `string \| ((item) => any)`                     | -          | Key or function to extract the option value    |
| `optionDisabled`    | `string \| ((item) => any)`                     | -          | Key or function to mark an option as disabled  |
| `optionDescription` | `string \| ((item) => any)`                     | -          | Key or function to extract description text     |
| `valueParser`       | `ValueParser<string>`                           | -          | Custom parser for option values                |
| `disabled`          | `boolean`                                        | `false`    | Disables all radio options                     |
| `readonly`          | `boolean`                                        | `false`    | Renders the group as read-only                 |
| `inline`            | `boolean`                                        | `false`    | Renders radio options horizontally             |
| `type`              | `'string' \| 'number' \| 'boolean' \| 'date'`   | `'string'` | Type used to parse option values               |

## Slots

| Slot      | Description                                        |
| --------- | ------------------------------------------------- |
| `default` | Custom option content. Props: `{ option }`        |
| `symbol`  | Custom radio symbol. Props: `{ checked, disabled }` |

## Events

The RadioGroup exposes the selected value through `v-model` (`update:modelValue`). It emits no other
custom events.

## More Examples

```vue
// With object options and extractors const plans = [ { id: 'free', name: 'Free', info: '0$/month' }, { id: 'pro', name:
'Pro', info: '10$/month' }, { id: 'enterprise', name: 'Enterprise', info: 'Contact us' } ]

<RadioGroup v-model="selectedPlan" :options="plans" option-value="id" option-label="name" option-description="info" />
```

```vue
// Inline layout (horizontal)
<RadioGroup v-model="size" :options="['Small', 'Medium', 'Large']" inline />
```

```vue
// With type parsing
<RadioGroup v-model="quantity" :options="[1, 2, 3, 4, 5]" type="number" />
```

::: tip Storybook
For interactive examples with all variants, see [RadioGroup in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-radiogroup--docs).
:::
