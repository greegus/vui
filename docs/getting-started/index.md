# Installation

## Requirements

- Vue 3.5+
- Node.js 24+

## Package Installation

Install VUIII using npm:

```bash
npm install vuiii
```

Or using yarn:

```bash
yarn add vuiii
```

Or using pnpm:

```bash
pnpm add vuiii
```

## Import Styles

Import the CSS file in your main entry file:

```typescript
// main.ts
import 'vuiii/style.css'
```

Or in your root component:

```vue
<style>
@import 'vuiii/style.css';
</style>
```

## Using Components

Import components individually for tree-shaking:

```typescript
import { Button, Input, Select } from 'vuiii'
```

Use them in your templates:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input } from 'vuiii'

const name = ref('')
</script>

<template>
  <Input v-model="name" placeholder="Enter your name" />
  <Button color="primary" label="Submit" />
</template>
```

## Next Steps

- [Configuration](/getting-started/configuration) - Configure global options
- [Theming](/getting-started/theming) - Customize the look and feel
- [Composing Forms](/getting-started/composing-forms) - Build forms from the atomic components, or generate them
- [Option Extractors](/getting-started/option-extractors) - The shared data API behind every option component
- [Components](/components/) - Explore all available components
