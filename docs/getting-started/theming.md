# Theming

VUIII uses CSS custom properties (CSS variables) for theming. Override these variables to customize the appearance of components.

## Basic Theming

Create a CSS file with your custom theme:

```css
:root {
  /* Primary colors */
  --vuiii-color-primary: #3b82f6;
  --vuiii-color-primary-hover: #2563eb;
  --vuiii-color-primary-active: #1d4ed8;

  /* Text colors */
  --vuiii-color-text: #1f2937;
  --vuiii-color-text-secondary: #6b7280;
  --vuiii-color-text-muted: #9ca3af;

  /* Border radius */
  --vuiii-border-radius: 6px;
  --vuiii-border-radius-sm: 4px;
  --vuiii-border-radius-lg: 8px;
}
```

Import it after the VUIII styles:

```typescript
import 'vuiii/style.css'
import './my-theme.css'
```

## Dark Mode

VUIII supports dark mode through CSS custom properties. Define dark mode overrides:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --vuiii-color-text: #f9fafb;
    --vuiii-color-text-secondary: #d1d5db;
    --vuiii-color-background: #111827;
    --vuiii-color-background-soft: #1f2937;
  }
}
```

Or with a class-based approach:

```css
.dark {
  --vuiii-color-text: #f9fafb;
  --vuiii-color-text-secondary: #d1d5db;
  --vuiii-color-background: #111827;
  --vuiii-color-background-soft: #1f2937;
}
```

## Component-Specific Tokens

Each component has its own set of tokens. For example, buttons:

```css
:root {
  /* Button sizes */
  --vuiii-button-height-small: 28px;
  --vuiii-button-height-normal: 36px;
  --vuiii-button-height-large: 44px;

  /* Button padding */
  --vuiii-button-padding-x-small: 12px;
  --vuiii-button-padding-x-normal: 16px;
  --vuiii-button-padding-x-large: 20px;
}
```

See the [Design Tokens](/design-tokens/) section for a complete reference of all available CSS variables.
