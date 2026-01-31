---
layout: home

hero:
  name: "VUIII"
  text: "Vue 3 Component Library"
  tagline: A comprehensive set of UI components, composables, and utilities for building modern web applications.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/
    - theme: alt
      text: View Components
      link: /components/
    - theme: alt
      text: GitHub
      link: https://github.com/greegus/vuiii
---

## Quick Start

Install the package:

```bash
npm install vuiii
```

Import components and styles:

```typescript
import { Button, Input, Select, FormFields } from "vuiii";
import "vuiii/style.css";
```

Use in your Vue app:

```vue
<template>
  <Button variant="primary" label="Click me" />
</template>
```
