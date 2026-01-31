# ButtonGroup

Groups related buttons together with connected styling. Adjacent buttons share borders and have rounded corners only on the outer edges.

## Import

```typescript
import { ButtonGroup, Button } from 'vuiii'
```

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
    <Button variant="primary" label="Save" />
    <Button variant="primary" label="Save & Close" />
  </ButtonGroup>
</ComponentDemo>

```vue
<ButtonGroup>
  <Button variant="primary" label="Save" />
  <Button variant="primary" label="Save & Close" />
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

