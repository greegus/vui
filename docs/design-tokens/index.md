# Design Tokens

VUIII uses CSS custom properties (design tokens) for consistent styling across all components. Override these tokens to customize the appearance.

## Token Categories

| Category | Description |
|----------|-------------|
| [Colors](/design-tokens/colors) | Brand colors, text colors, backgrounds, shadows |
| [Typography](/design-tokens/typography) | Font families, sizes, weights, text styles |
| [Buttons](/design-tokens/buttons) | Button variants, sizes, states |
| [Fields](/design-tokens/fields) | Form field styling, inputs, validation states |

## How to Use

Override tokens in your CSS:

```css
:root {
  --vuiii-color-primary: #your-brand-color;
  --vuiii-border-radius: 8px;
}
```

## Token Naming Convention

Tokens follow a consistent naming pattern:

```
--vuiii-{category}-{property}-{variant?}-{state?}
```

Examples:
- `--vuiii-color-primary` - Primary brand color
- `--vuiii-color-primary-hover` - Primary color on hover
- `--vuiii-button-height-small` - Small button height
- `--vuiii-field-border-color-focus` - Field border color when focused
