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

VUIII ships with a **built-in dark theme**. It is **opt-in** — you enable it with a mode class on the
document root (`<html>`). With no class the library stays in **light mode**.

- **Auto-detect:** add `vuiii-mode-auto` to follow the operating system via `prefers-color-scheme`.
- **Force a theme:** add `vuiii-mode-dark` or `vuiii-mode-light`.

```html
<!-- Light (default — no class needed) -->
<html>

<!-- Follow the OS -->
<html class="vuiii-mode-auto">

<!-- Always dark -->
<html class="vuiii-mode-dark">

<!-- Always light (even on a dark OS) -->
<html class="vuiii-mode-light">
```

Toggle it at runtime by setting the class on `document.documentElement`:

```ts
document.documentElement.classList.toggle('vuiii-mode-dark', isDark)
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

Override the neutral tokens inside a `.vuiii-mode-dark` selector (and, if you also support forced light,
`.vuiii-mode-light`):

```css
.vuiii-mode-dark {
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
