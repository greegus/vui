# Buttons

Button tokens control the appearance of the Button and IconButton components.

## Base Tokens

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-button-fontSize` | `var(--vuiii-field-fontSize)` | Text size |
| `--vuiii-button-fontFamily` | `var(--vuiii-typeface-body)` | Font family |
| `--vuiii-button-fontWeight` | `normal` | Text weight |
| `--vuiii-button-height` | `var(--vuiii-field-height)` | Button height |
| `--vuiii-button-padding` | `var(--vuiii-field-padding)` | Horizontal padding |
| `--vuiii-button-borderRadius` | `var(--vuiii-field-borderRadius)` | Corner radius |
| `--vuiii-button-borderWidth` | `var(--vuiii-field-borderWidth)` | Border thickness |
| `--vuiii-button-ringSize` | `var(--vuiii-field-ringSize)` | Focus ring width |
| `--vuiii-button-transition` | `var(--vuiii-field-transition)` | Animation timing |
| `--vuiii-button-opacity--disabled` | `var(--vuiii-field-opacity--disabled)` | Disabled state |

## Button Variants

### Default

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-button-bgColor` | `transparent` | Background |
| `--vuiii-button-borderColor` | `var(--vuiii-button-bgColor)` | Border |
| `--vuiii-button-textColor` | `var(--vuiii-color-primary)` | Text color |
| `--vuiii-button-ringColor` | `color-mix(in srgb, var(--vuiii-color-primary) 10%, transparent)` | Focus ring |
| `--vuiii-button-bgColor--hover` | `transparent` | Hover background |
| `--vuiii-button-textColor--hover` | `var(--vuiii-color-primary--darker)` | Hover text |

### Primary

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-button-bgColor--primary` | `var(--vuiii-color-primary)` | Background |
| `--vuiii-button-borderColor--primary` | `var(--vuiii-button-bgColor--primary)` | Border |
| `--vuiii-button-textColor--primary` | `white` | Text color |
| `--vuiii-button-ringColor--primary` | `color-mix(in srgb, var(--vuiii-color-primary) 10%, transparent)` | Focus ring |
| `--vuiii-button-bgColor--primary--hover` | `var(--vuiii-color-primary--darker)` | Hover background |

### Secondary

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-button-bgColor--secondary` | `var(--vuiii-color-gray--light)` | Background |
| `--vuiii-button-borderColor--secondary` | `var(--vuiii-button-bgColor--secondary)` | Border |
| `--vuiii-button-textColor--secondary` | `var(--vuiii-color-gray--darkest)` | Text color |
| `--vuiii-button-ringColor--secondary` | `color-mix(in srgb, var(--vuiii-color-gray--darker) 10%, transparent)` | Focus ring |
| `--vuiii-button-bgColor--secondary--hover` | `var(--vuiii-color-gray)` | Hover background |
| `--vuiii-button-textColor--secondary--hover` | `var(--vuiii-color-black)` | Hover text |

### Danger

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-button-bgColor--danger` | `var(--vuiii-color-danger)` | Background |
| `--vuiii-button-borderColor--danger` | `var(--vuiii-color-danger)` | Border |
| `--vuiii-button-textColor--danger` | `white` | Text color |
| `--vuiii-button-ringColor--danger` | `color-mix(in srgb, var(--vuiii-color-danger) 10%, transparent)` | Focus ring |
| `--vuiii-button-bgColor--danger--hover` | `var(--vuiii-color-danger--darker)` | Hover background |

### Success

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-button-bgColor--success` | `var(--vuiii-color-success)` | Background |
| `--vuiii-button-borderColor--success` | `var(--vuiii-color-success)` | Border |
| `--vuiii-button-textColor--success` | `white` | Text color |
| `--vuiii-button-ringColor--success` | `color-mix(in srgb, var(--vuiii-color-success) 10%, transparent)` | Focus ring |
| `--vuiii-button-bgColor--success--hover` | `var(--vuiii-color-success--darker)` | Hover background |

## Size Variants

### Small

| Token | Value |
|-------|-------|
| `--vuiii-button-fontSize--small` | `var(--vuiii-field-fontSize)` |
| `--vuiii-button-height--small` | `var(--vuiii-field-height--small)` |
| `--vuiii-button-padding--small` | `var(--vuiii-field-padding--small)` |
| `--vuiii-button-borderRadius--small` | `var(--vuiii-field-borderRadius--small)` |

### Large

| Token | Value |
|-------|-------|
| `--vuiii-button-fontSize--large` | `var(--vuiii-field-fontSize--large)` |
| `--vuiii-button-height--large` | `var(--vuiii-field-height--large)` |
| `--vuiii-button-padding--large` | `var(--vuiii-field-padding--large)` |
| `--vuiii-button-borderRadius--large` | `var(--vuiii-field-borderRadius--large)` |

## Customization

Create a custom button style:

```css
:root {
  /* Rounded buttons */
  --vuiii-button-borderRadius: 9999px;

  /* Custom primary color */
  --vuiii-button-bgColor--primary: #0066cc;
  --vuiii-button-bgColor--primary--hover: #0052a3;
}
```
