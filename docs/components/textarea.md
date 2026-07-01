# Textarea

Multi-line text input with InputWrapper styling.
Supports prefix icon and programmatic control.

## Import

```typescript
import { Textarea } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Textarea } from '../../src'
</script>

<ComponentDemo storybook="components-textarea--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage import { Textarea } from 'vuiii'

<Textarea v-model="description" placeholder="Enter description..." />
```

## Props

| Prop         | Type                             | Default    | Description                            |
| ------------ | -------------------------------- | ---------- | -------------------------------------- |
| `modelValue` | `string`                         | -          | Bound value (use with `v-model`)       |
| `prefixIcon` | `string`                         | -          | Icon name to show before the textarea  |
| `size`       | `'small' \| 'normal' \| 'large'` | `'normal'` | Textarea size                          |
| `invalid`    | `boolean`                        | `false`    | Applies the invalid/error styling      |
| `pill`       | `boolean`                        | `false`    | Rounded pill shape                     |
| `disabled`   | `boolean`                        | `false`    | Disables the textarea                  |
| `readonly`   | `boolean`                        | `false`    | Makes the textarea read-only           |
| `rows`       | `number \| string`               | -          | Number of visible rows (native attribute) |

## Slots

| Slot     | Description                                     |
| -------- | ---------------------------------------------- |
| `prefix` | Content before the textarea (replaces prefixIcon) |

## Events

| Event               | Payload | Description                     |
| ------------------- | ------- | ------------------------------- |
| `prefix-icon-click` | -       | When the prefix icon is clicked |

## More Examples

```vue
// With rows and placeholder
<Textarea v-model="content" placeholder="Write your message..." rows="5" />
```

```vue
// With prefix icon
<Textarea v-model="notes" prefix-icon="document-text" placeholder="Notes..." />
```

```vue
// Validation state
<Textarea v-model="bio" :invalid="errors.bio" placeholder="Bio" />
```

::: tip Storybook
For interactive examples with all variants, see [Textarea in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-textarea--docs).
:::
