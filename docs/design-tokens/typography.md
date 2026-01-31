# Typography

Typography tokens control font families, sizes, and text styles across VUIII components.

## Typefaces

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-typeface-body` | `"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif` | Body text font stack |
| `--vuiii-typeface-display` | `var(--vuiii-typeface-body)` | Display/heading font stack |

## Font Size Scale

| Token | Value | Size | Description |
|-------|-------|------|-------------|
| `--vuiii-fontSize--tiny` | `calc(var(--vuiii-fontSize) * 0.75)` | 0.75rem | Captions, fine print |
| `--vuiii-fontSize--small` | `calc(var(--vuiii-fontSize) * 0.85)` | 0.85rem | Labels, secondary text |
| `--vuiii-fontSize` | `1rem` | 1rem | Base font size |
| `--vuiii-fontSize--large` | `calc(var(--vuiii-fontSize) * 1.25)` | 1.25rem | Subheadings |
| `--vuiii-fontSize--x-large` | `calc(var(--vuiii-fontSize) * 1.5)` | 1.5rem | Section headers |
| `--vuiii-fontSize--2x-large` | `calc(var(--vuiii-fontSize) * 2)` | 2rem | Page titles |
| `--vuiii-fontSize--3x-large` | `calc(var(--vuiii-fontSize) * 3)` | 3rem | Large displays |
| `--vuiii-fontSize--4x-large` | `calc(var(--vuiii-fontSize) * 4)` | 4rem | Hero text |

## Typography Variants

Each variant includes tokens for: `fontSize`, `fontWeight`, `lineHeight`, `textTransform`, `color`, `opacity`.

### Display

| Token | Value |
|-------|-------|
| `--vuiii-typography-display-fontSize` | `var(--vuiii-fontSize--4x-large)` |
| `--vuiii-typography-display-fontWeight` | `600` |
| `--vuiii-typography-display-lineHeight` | `1.2` |
| `--vuiii-typography-display-textTransform` | `none` |
| `--vuiii-typography-display-color` | `inherit` |
| `--vuiii-typography-display-opacity` | `1` |

### Headings

| Variant | Font Size Token | Font Weight |
|---------|-----------------|-------------|
| heading1 | `--vuiii-fontSize--2x-large` | 600 |
| heading2 | `--vuiii-fontSize--large` | 600 |
| heading3 | `--vuiii-fontSize` | 600 |
| heading4 | `--vuiii-fontSize--small` | 600 |
| heading5 | `--vuiii-fontSize--tiny` | 600 |
| heading6 | `--vuiii-fontSize--tiny` | 600 |

All headings use `lineHeight: 1.2`.

### Body Text

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-typography-body1-fontSize` | `var(--vuiii-fontSize)` | Primary body text |
| `--vuiii-typography-body1-fontWeight` | `400` | |
| `--vuiii-typography-body1-lineHeight` | `1.2` | |
| `--vuiii-typography-body2-fontSize` | `var(--vuiii-fontSize)` | Secondary body text |
| `--vuiii-typography-body2-fontWeight` | `400` | |
| `--vuiii-typography-body2-opacity` | `0.65` | Dimmed appearance |

### Label

| Token | Value |
|-------|-------|
| `--vuiii-typography-label-fontSize` | `var(--vuiii-fontSize--small)` |
| `--vuiii-typography-label-fontWeight` | `600` |
| `--vuiii-typography-label-lineHeight` | `1.2` |

### Caption

| Token | Value |
|-------|-------|
| `--vuiii-typography-caption-fontSize` | `var(--vuiii-fontSize--tiny)` |
| `--vuiii-typography-caption-fontWeight` | `400` |
| `--vuiii-typography-caption-lineHeight` | `1.2` |
| `--vuiii-typography-caption-textTransform` | `uppercase` |
| `--vuiii-typography-caption-opacity` | `0.65` |

### Description

| Token | Value |
|-------|-------|
| `--vuiii-typography-description-fontSize` | `var(--vuiii-fontSize--tiny)` |
| `--vuiii-typography-description-fontWeight` | `400` |
| `--vuiii-typography-description-lineHeight` | `1.2` |
| `--vuiii-typography-description-opacity` | `0.65` |

## Customization

Change the base font size to scale all typography:

```css
:root {
  --vuiii-fontSize: 0.875rem; /* Smaller base */
}
```

Use a custom font family:

```css
:root {
  --vuiii-typeface-body: "Roboto", sans-serif;
  --vuiii-typeface-display: "Roboto Slab", serif;
}
```
