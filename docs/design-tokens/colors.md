# Colors

Color tokens define the visual palette for VUIII components.

## Base Colors

| Token                 | Value                      | Description            |
| --------------------- | -------------------------- | ---------------------- |
| `--vuiii-color-white` | `white`                    | Pure white             |
| `--vuiii-color-black` | `black`                    | Pure black             |
| `--vuiii-color-light` | `var(--vuiii-color-white)` | Light theme background |
| `--vuiii-color-dark`  | `var(--vuiii-color-black)` | Dark theme background  |

## Gray Scale

| Token                          | Value                         | Description        |
| ------------------------------ | ----------------------------- | ------------------ |
| `--vuiii-color-gray--lightest` | `oklch(98.51% 0 0)`           | Subtle backgrounds |
| `--vuiii-color-gray--lighter`  | `oklch(97.02% 0 0)`           | Light backgrounds  |
| `--vuiii-color-gray--light`    | `oklch(92.19% 0 0)`           | Dividers, borders  |
| `--vuiii-color-gray`           | `oklch(87.11% 0.0055 286.29)` | Default borders    |
| `--vuiii-color-gray--dark`     | `oklch(71.55% 0 0)`           | Placeholder text   |
| `--vuiii-color-gray--darker`   | `oklch(55.55% 0 0)`           | Secondary text     |
| `--vuiii-color-gray--darkest`  | `oklch(43.86% 0 0)`           | Dark text          |

## Semantic Colors

### Primary

| Token                            | Value                                                       | Description                  |
| -------------------------------- | ----------------------------------------------------------- | ---------------------------- |
| `--vuiii-color-primary`          | `oklch(51.06% 0.2301 276.97)`                               | Primary brand color (indigo) |
| `--vuiii-color-primary--darker`  | `oklch(from var(--vuiii-color-primary) calc(l * 0.95) c h)` | Hover state                  |
| `--vuiii-color-primary--darkest` | `oklch(from var(--vuiii-color-primary) calc(l * 0.85) c h)` | Active state                 |

### Accent

The accent color drives **form-selection controls** (checked checkbox, selected radio, active `RadioButtonGroup` button) and the `accent` [Button](/design-tokens/buttons) color. It defaults to the primary color, but can be overridden independently so selection UI can differ from the primary brand color.

<DesignToken cssVar="--vuiii-color-accent" type="color" />

| Token                           | Value                                                      | Description                              |
| ------------------------------- | ---------------------------------------------------------- | ---------------------------------------- |
| `--vuiii-color-accent`          | `var(--vuiii-color-primary)`                               | Accent color (defaults to primary)       |
| `--vuiii-color-accent--darker`  | `oklch(from var(--vuiii-color-accent) calc(l * 0.95) c h)` | Hover state                              |

Override it to give selection controls a distinct color:

```css
:root {
  --vuiii-color-accent: #16a34a;
}
```

### Danger

| Token                          | Value                                                      | Description                       |
| ------------------------------ | ---------------------------------------------------------- | --------------------------------- |
| `--vuiii-color-danger`         | `oklch(58.58% 0.2220 17.58)`                               | Error, destructive actions (rose) |
| `--vuiii-color-danger--darker` | `oklch(from var(--vuiii-color-danger) calc(l * 0.95) c h)` | Hover state                       |

### Success

| Token                           | Value                                                       | Description           |
| ------------------------------- | ----------------------------------------------------------- | --------------------- |
| `--vuiii-color-success`         | `oklch(53.22% 0.1405 131.59)`                               | Success states (lime) |
| `--vuiii-color-success--darker` | `oklch(from var(--vuiii-color-success) calc(l * 0.95) c h)` | Hover state           |

### Warning

| Token                           | Value                                                       | Description            |
| ------------------------------- | ----------------------------------------------------------- | ---------------------- |
| `--vuiii-color-warning`         | `oklch(79.52% 0.1617 86.05)`                                | Warning states (amber) |
| `--vuiii-color-warning--darker` | `oklch(from var(--vuiii-color-warning) calc(l * 0.95) c h)` | Hover state            |

## Shadows

| Token                   | Value                                                                  | Description       |
| ----------------------- | ---------------------------------------------------------------------- | ----------------- |
| `--vuiii-shadow`        | `0 1px 3px 0 oklch(0% 0 0 / 0.1), 0 1px 2px -1px oklch(0% 0 0 / 0.1)`  | Default shadow    |
| `--vuiii-shadow--large` | `0 2px 15px 0 oklch(0% 0 0 / 0.2), 0 1px 2px -1px oklch(0% 0 0 / 0.1)` | Elevated elements |

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
