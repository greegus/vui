# Divider

Visual separator line for content sections.
Can be horizontal (default) or vertical.

## Import

```typescript
import { Divider } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { Divider } from '../../src'
</script>

<ComponentDemo storybook="example-divider--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Horizontal divider (default)
import { Divider } from 'vuiii'

<div>Section 1</div>
<Divider />
<div>Section 2</div>
```

## More Examples

```vue
// Vertical divider (for inline content)
<div style="display: flex; align-items: center;">
  <span>Item 1</span>
  <Divider orientation="vertical" />
  <span>Item 2</span>
</div>
```

```vue
// In FormFields (using FORM_DIVIDER constant)
import { FORM_DIVIDER } from 'vuiii'

const fields = [
  { name: 'name', component: Input, label: 'Name' },
  FORM_DIVIDER,
  { name: 'email', component: Input, label: 'Email' }
]
```

::: tip Storybook
For interactive examples with all variants, see [Divider in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-divider--docs).
:::
