# IconButton

Icon-only button. A simplified Button wrapper for actions that only need an icon.

## Import

```typescript
import { IconButton } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { IconButton } from '../../src'
</script>

<ComponentDemo storybook="components-iconbutton--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage import { IconButton } from 'vuiii'

<IconButton icon="pencil" @click="edit()" />
<IconButton icon="trash" color="danger" @click="remove()" />
```

## More Examples

```vue
// Different colors
<IconButton icon="plus" color="primary" />
<IconButton icon="check" color="secondary" />
<IconButton icon="x-mark" color="danger" />
```

```vue
// Different sizes
<IconButton icon="cog" size="small" />
<IconButton icon="cog" size="normal" />
<IconButton icon="cog" size="large" />
```

```vue
// With title (tooltip)
<IconButton icon="trash" title="Delete item" @click="remove()" />
```

::: tip Storybook
For interactive examples with all variants, see [IconButton in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-iconbutton--docs).
:::
