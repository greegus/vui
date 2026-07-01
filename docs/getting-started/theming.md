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

VUIII ships with a **built-in dark theme** — no setup required.

- **Auto-detect:** the theme follows the operating system via `prefers-color-scheme`.
- **Force a theme:** add `vuiii-dark` or `vuiii-light` to the document root (`<html>`).

```html
<!-- Follow the OS (default) -->
<html>

<!-- Always dark -->
<html class="vuiii-dark">

<!-- Always light (even on a dark OS) -->
<html class="vuiii-light">
```

Toggle it at runtime by setting the class on `document.documentElement`:

```ts
document.documentElement.classList.toggle('vuiii-dark', isDark)
```

### How it works

Only the **neutral ramp** flips between themes — surfaces, text and borders
(`--vuiii-color-light`, `--vuiii-color-dark`, the `--vuiii-color-gray*` scale, and the two surface
tokens `--vuiii-color-background` (page) and `--vuiii-color-paper` (cards, dropdowns, panels, inputs —
slightly raised in dark mode)). **Brand colors**
(`primary`, `danger`, `success`, `warning`, `accent`) stay the same in both themes, and text on filled
brand surfaces stays white. Because every component token derives from these neutrals, the whole library
re-themes automatically.

### Customizing the dark palette

Override the neutral tokens inside a `.vuiii-dark` selector (and, if you also support forced light,
`.vuiii-light`):

```css
.vuiii-dark {
  --vuiii-color-light: oklch(18% 0 0); /* page / surface background */
  --vuiii-color-dark: oklch(97% 0 0); /* primary text */
  /* …and the --vuiii-color-gray* ramp */
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
