# ButtonGroup

Groups related buttons together with connected styling. Adjacent buttons share borders and have rounded corners only on the outer edges.

## Import

```typescript
import { ButtonGroup, Button } from 'vuiii'
```

## Props

`ButtonGroup` takes no props — it is a layout wrapper that joins the buttons you put in it.

## Slots

| Slot      | Description                       |
| --------- | --------------------------------- |
| `default` | The buttons to group together     |

## Basic Usage

<script setup>
import { ButtonGroup, Button } from '../../src'
</script>

<ComponentDemo>
  <ButtonGroup>
    <Button label="Left" />
    <Button label="Center" />
    <Button label="Right" />
  </ButtonGroup>
</ComponentDemo>

```vue
<ButtonGroup>
  <Button label="Left" />
  <Button label="Center" />
  <Button label="Right" />
</ButtonGroup>
```

## With Variants

<ComponentDemo>
  <ButtonGroup>
    <Button color="primary" label="Save" />
    <Button color="primary" label="Save & Close" />
  </ButtonGroup>
</ComponentDemo>

```vue
<ButtonGroup>
  <Button color="primary" label="Save" />
  <Button color="primary" label="Save & Close" />
</ButtonGroup>
```

## With Icons

<ComponentDemo>
  <ButtonGroup>
    <Button prefixIcon="chevron-left" label="Previous" />
    <Button label="Next" suffixIcon="chevron-right" />
  </ButtonGroup>
</ComponentDemo>

```vue
<ButtonGroup>
  <Button prefixIcon="chevron-left" label="Previous" />
  <Button label="Next" suffixIcon="chevron-right" />
</ButtonGroup>
```
