# Typography

Typography component for consistent text styling.
Automatically selects appropriate HTML tag based on variant.

## Import

```typescript
import { Typography } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Typography } from '../../src'
</script>

<ComponentDemo storybook="example-typography--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Different variants
import { Typography } from 'vuiii'

<Typography variant="display">Display Text</Typography>
<Typography variant="heading1">Heading 1</Typography>
<Typography variant="heading2">Heading 2</Typography>
<Typography variant="body1">Body text paragraph</Typography>
<Typography variant="caption">Small caption text</Typography>
<Typography variant="label">Form label</Typography>
```

## More Examples

```vue
// Automatic tag selection
<Typography variant="heading1">Renders as h1</Typography>
<Typography variant="body1">Renders as p</Typography>
<Typography variant="label">Renders as span</Typography>
```

```vue
// Override the HTML tag
<Typography variant="heading1" tag="h2">
  Styled as heading1, but renders as h2
</Typography>
```

```vue
// Available variants and their default tags:
// display -> h1
// heading1 -> h1
// heading2 -> h2
// heading3 -> h3
// heading4 -> h4
// heading5 -> h5
// heading6 -> h6
// body1 -> p
// body2 -> p
// label -> span
// caption -> span
```

::: tip Storybook
For interactive examples with all variants, see [Typography in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-typography--docs).
:::
