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

const description = ref('')
const content = ref('')
const notes = ref('')
const bio = ref('')
</script>

<ComponentDemo storybook="components-textarea--default">
  <Textarea v-model="description" placeholder="Enter description..." />
</ComponentDemo>

```vue
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

## Rows

`rows` passes straight through to the native element, so it sets the initial height.

<ComponentDemo>
  <Textarea v-model="content" placeholder="Write your message..." rows="5" />
</ComponentDemo>

```vue
<Textarea v-model="content" placeholder="Write your message..." rows="5" />
```

## With a Prefix Icon

<ComponentDemo>
  <Textarea v-model="notes" prefix-icon="pencil" placeholder="Notes..." />
</ComponentDemo>

```vue
<Textarea v-model="notes" prefix-icon="pencil" placeholder="Notes..." />
```

## Validation State

`invalid` draws the error styling. Pair it with [FormGroup](/components/form-group) to show the
message alongside it — see [Composing Forms](/getting-started/composing-forms).

<ComponentDemo>
  <Textarea v-model="bio" invalid placeholder="Bio" />
</ComponentDemo>

```vue
<Textarea v-model="bio" :invalid="!!errors.bio" placeholder="Bio" />
```

## Sizes

<ComponentDemo>
  <div style="display: flex; flex-flow: column; gap: 0.75rem; width: 100%;">
    <Textarea size="small" placeholder="Small" rows="2" />
    <Textarea size="normal" placeholder="Normal" rows="2" />
    <Textarea size="large" placeholder="Large" rows="2" />
  </div>
</ComponentDemo>

```vue
<Textarea v-model="value" size="small" placeholder="Small" />
<Textarea v-model="value" size="normal" placeholder="Normal" />
<Textarea v-model="value" size="large" placeholder="Large" />
```

## Programmatic Focus

A template ref exposes `focus()` and `select()`.

```vue
<script setup>
import { ref } from 'vue'
import type { TextareaRef } from 'vuiii'

const textareaRef = ref<TextareaRef>()

function focusIt() {
  textareaRef.value?.focus()
}
</script>

<template>
  <Textarea ref="textareaRef" v-model="notes" />
</template>
```

::: tip Storybook
For interactive examples with all variants, see [Textarea in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-textarea--docs).
:::
