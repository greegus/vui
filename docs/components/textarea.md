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

<ComponentDemo storybook="example-textarea--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage
import { Textarea } from 'vuiii'

<Textarea v-model="description" placeholder="Enter description..." />
```

## More Examples

```vue
// With rows and placeholder
<Textarea
  v-model="content"
  placeholder="Write your message..."
  rows="5"
/>
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
For interactive examples with all variants, see [Textarea in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-textarea--docs).
:::
