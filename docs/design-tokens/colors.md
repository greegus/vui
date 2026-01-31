# Colors

Color tokens define the visual palette for VUIII components.

## Base Colors

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-color-white` | `white` | Pure white |
| `--vuiii-color-black` | `black` | Pure black |
| `--vuiii-color-light` | `var(--vuiii-color-white)` | Light theme background |
| `--vuiii-color-dark` | `var(--vuiii-color-black)` | Dark theme background |

## Gray Scale

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-color-gray--lightest` | `rgb(250 250 250)` | Subtle backgrounds |
| `--vuiii-color-gray--lighter` | `rgb(245 245 245)` | Light backgrounds |
| `--vuiii-color-gray--light` | `rgb(229 229 229)` | Dividers, borders |
| `--vuiii-color-gray` | `rgb(212 212 216)` | Default borders |
| `--vuiii-color-gray--dark` | `rgb(163 163 163)` | Placeholder text |
| `--vuiii-color-gray--darker` | `rgb(115 115 115)` | Secondary text |
| `--vuiii-color-gray--darkest` | `rgb(82 82 82)` | Dark text |

## Semantic Colors

### Primary

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-color-primary` | `rgb(79 70 229)` | Primary brand color (indigo) |
| `--vuiii-color-primary--darker` | `color-mix(in srgb, var(--vuiii-color-primary) 95%, black)` | Hover state |
| `--vuiii-color-primary--darkest` | `color-mix(in srgb, var(--vuiii-color-primary) 85%, black)` | Active state |

### Danger

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-color-danger` | `rgb(225 29 72)` | Error, destructive actions (rose) |
| `--vuiii-color-danger--darker` | `color-mix(in srgb, var(--vuiii-color-danger) 95%, black)` | Hover state |

### Success

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-color-success` | `rgb(77 124 15)` | Success states (lime) |
| `--vuiii-color-success--darker` | `color-mix(in srgb, var(--vuiii-color-success) 95%, black)` | Hover state |

### Warning

| Token | Value | Description |
|-------|-------|-------------|
| `--ui-color-warning` | `rgb(234 179 8)` | Warning states (amber) |
| `--ui-color-warning--darker` | `color-mix(in srgb, var(--ui-color-warning) 95%, black)` | Hover state |

::: warning Note
The warning color uses `--ui-color-warning` prefix instead of `--vuiii-color-warning` for historical reasons.
:::

## Shadows

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-shadow` | `0 1px 3px 0 rgb(0 0 0/0.1), 0 1px 2px -1px rgb(0 0 0/0.1)` | Default shadow |
| `--vuiii-shadow--large` | `0 2px 15px 0 rgb(0 0 0/0.2), 0 1px 2px -1px rgb(0 0 0/0.1)` | Elevated elements |

## Customization

Override colors globally:

```css
:root {
  --vuiii-color-primary: #0066cc;
  --vuiii-color-danger: #dc2626;
}
```

Or scope to a theme:

```css
.dark-theme {
  --vuiii-color-light: #1a1a1a;
  --vuiii-color-dark: #ffffff;
  --vuiii-color-gray--light: #333333;
}
```
