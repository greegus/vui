# Fields

Field tokens provide shared styling for form inputs (Input, Select, Textarea, Autocomplete). Component-specific tokens (like `--vuiii-input-*`) inherit from these base tokens.

## Base Tokens

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-field-height` | `2.5em` | Default field height |
| `--vuiii-field-padding` | `1.35em` | Horizontal padding |
| `--vuiii-field-borderRadius` | `0.25em` | Corner radius |
| `--vuiii-field-fontSize` | `var(--vuiii-fontSize)` | Text size |
| `--vuiii-field-borderWidth` | `1px` | Border thickness |
| `--vuiii-field-bgColor` | `var(--vuiii-color-white)` | Background color |
| `--vuiii-field-borderColor` | `var(--vuiii-color-gray)` | Border color |
| `--vuiii-field-ringColor` | `color-mix(in srgb, var(--vuiii-color-gray--dark) 10%, transparent)` | Focus ring color |
| `--vuiii-field-ringSize` | `0.25em` | Focus ring width |
| `--vuiii-field-transition` | `all 0.05s ease-in-out` | Animation timing |
| `--vuiii-field-opacity--disabled` | `0.6` | Disabled state opacity |

## State Tokens

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-field-borderColor--active` | `var(--vuiii-color-gray--dark)` | Active state border |
| `--vuiii-field-borderColor--focus` | `var(--vuiii-color-gray--dark)` | Focus state border |
| `--vuiii-field-borderColor--invalid` | `var(--vuiii-color-danger)` | Invalid state border |

## Size Variants

### Small

| Token | Value |
|-------|-------|
| `--vuiii-field-height--small` | `var(--vuiii-field-height)` |
| `--vuiii-field-padding--small` | `var(--vuiii-field-padding)` |
| `--vuiii-field-fontSize--small` | `var(--vuiii-fontSize--small)` |
| `--vuiii-field-borderRadius--small` | `var(--vuiii-field-borderRadius)` |
| `--vuiii-field-ringSize--small` | `var(--vuiii-field-ringSize)` |

### Large

| Token | Value |
|-------|-------|
| `--vuiii-field-height--large` | `var(--vuiii-field-height)` |
| `--vuiii-field-padding--large` | `var(--vuiii-field-padding)` |
| `--vuiii-field-fontSize--large` | `var(--vuiii-fontSize--large)` |
| `--vuiii-field-borderRadius--large` | `var(--vuiii-field-borderRadius)` |
| `--vuiii-field-ringSize--large` | `var(--vuiii-field-ringSize)` |

## Input-Specific Tokens

Input, Textarea, and other text inputs inherit from field tokens but add additional styling:

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-input-textColor` | `inherit` | Text color |
| `--vuiii-input-bgColor` | `var(--vuiii-color-white)` | Background |
| `--vuiii-input-bgColor--focus` | `var(--vuiii-input-bgColor)` | Focus background |
| `--vuiii-input-placeholderColor` | `color-mix(in srgb, currentColor 50%, transparent)` | Placeholder text |
| `--vuiii-input-iconColor` | `color-mix(in srgb, currentColor 50%, transparent)` | Icon color |
| `--vuiii-input-shadow` | `0 0` | Box shadow |
| `--vuiii-input-shadow--focus` | `var(--vuiii-input-shadow)` | Focus shadow |

### Validity States

| Token | Value | Description |
|-------|-------|-------------|
| `--vuiii-input-textColor--valid` | `var(--vuiii-color-success)` | Valid text color |
| `--vuiii-input-borderColor--valid` | `var(--vuiii-color-success)` | Valid border |
| `--vuiii-input-ringColor--valid` | `color-mix(in srgb, var(--vuiii-color-success) 10%, transparent)` | Valid focus ring |
| `--vuiii-input-textColor--invalid` | `var(--vuiii-color-danger)` | Invalid text color |
| `--vuiii-input-borderColor--invalid` | `var(--vuiii-color-danger)` | Invalid border |
| `--vuiii-input-ringColor--invalid` | `color-mix(in srgb, var(--vuiii-color-danger) 10%, transparent)` | Invalid focus ring |

## Customization

Make fields more rounded:

```css
:root {
  --vuiii-field-borderRadius: 0.5em;
}
```

Add a subtle shadow to focused inputs:

```css
:root {
  --vuiii-input-shadow--focus: 0 0 0 3px var(--vuiii-field-ringColor);
}
```

Change the invalid state color:

```css
:root {
  --vuiii-field-borderColor--invalid: #ef4444;
  --vuiii-input-borderColor--invalid: #ef4444;
}
```
