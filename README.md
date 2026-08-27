# VUIII

'Yet another' simple and customizable Vue 3 component library for rapid UI development.

Key features:

- Full TypeScript support
- Dynamic form generation with validation
- Dialog and snackbar notification systems
- Composables for async actions, pagination, and data loading
- Customizable icon resolver for any icon library
- Flexible option parsing for selects, autocompletes, and radio groups
- ARIA accessibility support
- CSS variables for easy theming

[Documentation and examples](https://greegus.github.io/vuiii/)

## Requirements

- **Vue 3.5+** and **`vue-router`** (`^4.2.5 || ^5.0.0`) — both are required peer dependencies. The package
  entry point imports `vue-router` unconditionally (for `useRouteQuery`, `useSubmitAction` and `Button`'s `to`
  prop), so it has to be installed even in apps that do not use routing.
- **ESM-only** package — use a modern bundler (Vite, webpack 5, Rollup, Nuxt). There is no CommonJS build.

## Installation

```sh
npm install vuiii@latest
```

No global setup is required. Import the stylesheet once in your app entry point and use components directly.

```typescript
import 'vuiii/style.css'
```

```typescript
import { Button, Input, Select, FormFields } from 'vuiii'
```

### Custom Icons

Register a custom icon resolver to integrate your icon library (Heroicons, FontAwesome, etc.):

```typescript
import { registerCustomIconResolver } from 'vuiii'
import { defineAsyncComponent } from 'vue'

registerCustomIconResolver((name) => {
  return defineAsyncComponent(() => import(`./icons/${name}.vue`))
})
```

## Documentation and examples

Storybook serves as the primary documentation for VUIII. It contains interactive examples, component API references, and usage patterns for all components.

https://greegus.github.io/vuiii/
