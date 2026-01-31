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
  <Button variant="primary" label="Submit" />
</template>
```

## Next Steps

- [Configuration](/getting-started/configuration) - Configure global options
- [Theming](/getting-started/theming) - Customize the look and feel
- [Components](/components/) - Explore all available components
