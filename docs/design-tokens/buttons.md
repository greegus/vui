# Buttons

Button tokens control the appearance of the Button and IconButton components.

## Color × Variant System

A button's look is decided by two independent axes:

- **Color** — selects a _palette_ (surface, on-surface, accent, ring). Applied via the `vuiii-button--color-{color}` class. Colors: `primary`, `secondary`, `success`, `danger`, `accent`.
- **Variant** — decides how that palette is _rendered_. Applied via the `vuiii-button--variant-{variant}` class. Variants: `filled`, `outlined`, `text`.

Each color exposes a palette of tokens; each variant maps those palette tokens onto the drawing tokens (`--bgColor`, `--textColor`, `--borderColor`, and their `--hover` counterparts).

| Variant    | Background      | Text / Border        |
| ---------- | --------------- | -------------------- |
| `filled`   | `surface`       | `onSurface` text     |
| `outlined` | transparent     | `accent` text + border |
| `text`     | transparent     | `accent` text, no border |

The palette meaning:

- **surface** — fill background for the `filled` variant (`surface--hover` on hover).
- **onSurface** — text color drawn on top of the surface.
- **accent** — text and border color for the `outlined` and `text` variants (`accent--hover` on hover).
- **ringColor** — focus ring color.

## Base Tokens

| Token                              | Value                                  | Description        |
| ---------------------------------- | -------------------------------------- | ------------------ |
| `--vuiii-button-fontSize`          | `var(--vuiii-field-fontSize)`          | Text size          |
| `--vuiii-button-fontFamily`        | `var(--vuiii-typeface-body)`           | Font family        |
| `--vuiii-button-fontWeight`        | `500`                                  | Text weight        |
| `--vuiii-button-height`            | `var(--vuiii-field-height)`            | Button height      |
| `--vuiii-button-padding`           | `var(--vuiii-field-padding)`           | Horizontal padding |
| `--vuiii-button-borderRadius`      | `var(--vuiii-field-borderRadius)`      | Corner radius      |
| `--vuiii-button-ringSize`          | `var(--vuiii-field-ringSize)`          | Focus ring width   |
| `--vuiii-button-borderWidth`       | `var(--vuiii-field-borderWidth)`       | Border thickness   |
| `--vuiii-button-transition`        | `var(--vuiii-field-transition)`        | Animation timing   |
| `--vuiii-button-opacity--disabled` | `var(--vuiii-field-opacity--disabled)` | Disabled state     |

## Color Palettes

### Primary

| Token                                    | Value                                              | Description               |
| ---------------------------------------- | -------------------------------------------------- | ------------------------- |
| `--vuiii-button-surface--primary`        | `var(--vuiii-color-primary)`                       | Filled background         |
| `--vuiii-button-surface--primary--hover` | `var(--vuiii-color-primary--darker)`               | Filled background (hover) |
| `--vuiii-button-onSurface--primary`      | `white`                                            | Text on surface           |
| `--vuiii-button-accent--primary`         | `var(--vuiii-color-primary)`                       | Outlined/text color       |
| `--vuiii-button-accent--primary--hover`  | `var(--vuiii-color-primary--darker)`               | Outlined/text color (hover) |
| `--vuiii-button-ringColor--primary`      | `oklch(from var(--vuiii-color-primary) l c h / 0.1)` | Focus ring              |

### Secondary

| Token                                      | Value                                                    | Description               |
| ------------------------------------------ | -------------------------------------------------------- | ------------------------- |
| `--vuiii-button-surface--secondary`        | `var(--vuiii-color-gray--light)`                         | Filled background         |
| `--vuiii-button-surface--secondary--hover` | `var(--vuiii-color-gray)`                                | Filled background (hover) |
| `--vuiii-button-onSurface--secondary`      | `var(--vuiii-color-gray--darkest)`                       | Text on surface           |
| `--vuiii-button-accent--secondary`         | `var(--vuiii-color-gray--darker)`                        | Outlined/text color       |
| `--vuiii-button-accent--secondary--hover`  | `var(--vuiii-color-gray--darkest)`                       | Outlined/text color (hover) |
| `--vuiii-button-ringColor--secondary`      | `oklch(from var(--vuiii-color-gray--darker) l c h / 0.1)` | Focus ring              |

### Success

| Token                                    | Value                                              | Description               |
| ---------------------------------------- | -------------------------------------------------- | ------------------------- |
| `--vuiii-button-surface--success`        | `var(--vuiii-color-success)`                       | Filled background         |
| `--vuiii-button-surface--success--hover` | `var(--vuiii-color-success--darker)`               | Filled background (hover) |
| `--vuiii-button-onSurface--success`      | `white`                                            | Text on surface           |
| `--vuiii-button-accent--success`         | `var(--vuiii-color-success)`                       | Outlined/text color       |
| `--vuiii-button-accent--success--hover`  | `var(--vuiii-color-success--darker)`               | Outlined/text color (hover) |
| `--vuiii-button-ringColor--success`      | `oklch(from var(--vuiii-color-success) l c h / 0.1)` | Focus ring              |

### Danger

| Token                                   | Value                                             | Description               |
| --------------------------------------- | ------------------------------------------------- | ------------------------- |
| `--vuiii-button-surface--danger`        | `var(--vuiii-color-danger)`                       | Filled background         |
| `--vuiii-button-surface--danger--hover` | `var(--vuiii-color-danger--darker)`               | Filled background (hover) |
| `--vuiii-button-onSurface--danger`      | `white`                                           | Text on surface           |
| `--vuiii-button-accent--danger`         | `var(--vuiii-color-danger)`                       | Outlined/text color       |
| `--vuiii-button-accent--danger--hover`  | `var(--vuiii-color-danger--darker)`               | Outlined/text color (hover) |
| `--vuiii-button-ringColor--danger`      | `oklch(from var(--vuiii-color-danger) l c h / 0.1)` | Focus ring              |

### Accent

The `accent` color has no dedicated `--vuiii-button-*` palette tokens. The `vuiii-button--color-accent` class maps its palette directly onto the global [`--vuiii-color-accent`](/design-tokens/colors#accent) token, so it always follows the accent color used by form-selection controls.

| Palette slot   | Resolves to                                          |
| -------------- | ---------------------------------------------------- |
| surface        | `var(--vuiii-color-accent)`                          |
| surface (hover)| `var(--vuiii-color-accent--darker)`                  |
| onSurface      | `var(--vuiii-color-white)`                           |
| accent         | `var(--vuiii-color-accent)`                          |
| accent (hover) | `var(--vuiii-color-accent--darker)`                  |
| ringColor      | `oklch(from var(--vuiii-color-accent) l c h / 0.1)`  |

To restyle the accent button, override the global accent color — see [Colors → Accent](/design-tokens/colors#accent).

## Size Variants

### Small

| Token                                | Value                                    |
| ------------------------------------ | ---------------------------------------- |
| `--vuiii-button-fontSize--small`     | `var(--vuiii-field-fontSize--small)`     |
| `--vuiii-button-height--small`       | `var(--vuiii-field-height--small)`       |
| `--vuiii-button-padding--small`      | `var(--vuiii-field-padding--small)`      |
| `--vuiii-button-borderRadius--small` | `var(--vuiii-field-borderRadius--small)` |
| `--vuiii-button-ringSize--small`     | `var(--vuiii-field-ringSize--small)`     |

### Large

| Token                                | Value                                    |
| ------------------------------------ | ---------------------------------------- |
| `--vuiii-button-fontSize--large`     | `var(--vuiii-field-fontSize--large)`     |
| `--vuiii-button-height--large`       | `var(--vuiii-field-height--large)`       |
| `--vuiii-button-padding--large`      | `var(--vuiii-field-padding--large)`      |
| `--vuiii-button-borderRadius--large` | `var(--vuiii-field-borderRadius--large)` |
| `--vuiii-button-ringSize--large`     | `var(--vuiii-field-ringSize--large)`     |

## Customization

Restyle a color palette — the change applies across every variant of that color:

```css
:root {
  /* Recolor the primary button */
  --vuiii-button-surface--primary: #0066cc;
  --vuiii-button-surface--primary--hover: #0052a3;
  --vuiii-button-accent--primary: #0066cc;
  --vuiii-button-accent--primary--hover: #0052a3;
}
```

Adjust base geometry shared by all buttons:

```css
:root {
  /* Rounded buttons */
  --vuiii-button-borderRadius: 9999px;
}
```
