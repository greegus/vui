# RadioButtonGroup

Button-styled radio group for single selection with visual button appearance.
Each option is rendered as a Button within a ButtonGroup.

## Import

```typescript
import { RadioButtonGroup } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { RadioButtonGroup } from '../../src'

const view = ref()
const status = ref()
const viewIcon = ref('list')
const sized = ref()
const varianted = ref()
</script>

<ComponentDemo storybook="components-radiobuttongroup--default">
  <RadioButtonGroup v-model="view" :options="['List', 'Grid', 'Table']" />
</ComponentDemo>

```vue
<RadioButtonGroup v-model="view" :options="['List', 'Grid', 'Table']" />
```

## Variants

The colors are fixed: the active button uses the `accent` color and inactive buttons use `secondary`. Use the `variant` prop to control the render style of the active button. Available variants: `filled` (default) and `outlined`.

<ComponentDemo storybook="components-radiobuttongroup--variants">
  <div style="display: flex; flex-flow: column; gap: 1rem;">
    <RadioButtonGroup v-model="varianted" :options="['List', 'Grid', 'Table']" variant="filled" />
    <RadioButtonGroup v-model="varianted" :options="['List', 'Grid', 'Table']" variant="outlined" />
  </div>
</ComponentDemo>

```vue
<RadioButtonGroup v-model="view" :options="['List', 'Grid', 'Table']" variant="filled" />
<RadioButtonGroup v-model="view" :options="['List', 'Grid', 'Table']" variant="outlined" />
```

## Sizes

Use the `size` prop to control the button size. Available sizes: `small`, `normal`, `large`.

<ComponentDemo storybook="components-radiobuttongroup--sizes">
  <div style="display: flex; flex-flow: column; gap: 1rem;">
    <RadioButtonGroup v-model="sized" :options="['List', 'Grid', 'Table']" size="small" />
    <RadioButtonGroup v-model="sized" :options="['List', 'Grid', 'Table']" size="normal" />
    <RadioButtonGroup v-model="sized" :options="['List', 'Grid', 'Table']" size="large" />
  </div>
</ComponentDemo>

```vue
<RadioButtonGroup v-model="view" :options="options" size="small" />
<RadioButtonGroup v-model="view" :options="options" size="normal" />
<RadioButtonGroup v-model="view" :options="options" size="large" />
```

## Disabled

Use the `disabled` prop to disable the entire group.

```vue
<RadioButtonGroup v-model="view" :options="options" disabled />
```

## Object Options

Use `option-value` and `option-label` props to extract values from object arrays.

<ComponentDemo storybook="components-radiobuttongroup--option-props-mapping">
  <RadioButtonGroup
    v-model="status"
    :options="[{ id: 'active', name: 'Active' }, { id: 'inactive', name: 'Inactive' }]"
    option-value="id"
    option-label="name"
  />
</ComponentDemo>

```vue
<RadioButtonGroup
  v-model="status"
  :options="[
    { id: 'active', name: 'Active' },
    { id: 'inactive', name: 'Inactive' },
  ]"
  option-value="id"
  option-label="name"
/>
```

## With Icons

Use the `option-icon` extractor to display prefix icons on each button.

<ComponentDemo storybook="components-radiobuttongroup--with-icons">
  <RadioButtonGroup
    v-model="viewIcon"
    :options="[
      { value: 'list', label: 'List', icon: 'list-bullet' },
      { value: 'grid', label: 'Grid', icon: 'squares-2x2' },
      { value: 'table', label: 'Table', icon: 'table-cells' }
    ]"
    option-value="value"
    option-label="label"
    option-icon="icon"
  />
</ComponentDemo>

```vue
<RadioButtonGroup
  v-model="view"
  :options="[
    { value: 'list', label: 'List', icon: 'list-bullet' },
    { value: 'grid', label: 'Grid', icon: 'squares-2x2' },
    { value: 'table', label: 'Table', icon: 'table-cells' },
  ]"
  option-value="value"
  option-label="label"
  option-icon="icon"
/>
```

## With Descriptions

Use the `option-description` extractor to add tooltip text (shown via the `title` attribute) to each button.

```vue
<RadioButtonGroup
  v-model="selected"
  :options="options"
  option-value="value"
  option-label="label"
  option-description="description"
/>
```

## Value Types

Options are normalized to strings internally, so by default the model receives a string. Use
`type` to have the picked value parsed back, exactly as in `Select`, `RadioGroup` and
`CheckboxGroup`. Supported types: `string` (default), `number`, `boolean` and `date`.

```vue
<RadioButtonGroup v-model="rating" :options="[1, 2, 3]" type="number" />
<!-- rating === 3, not '3' -->
```

For anything else, pass a `value-parser` with your own `stringify` / `parse` pair:

```vue
<RadioButtonGroup
  v-model="startsOn"
  :options="dates"
  :value-parser="{ stringify: (d) => d.toISOString(), parse: (v) => new Date(v) }"
/>
```

::: tip Storybook
For interactive examples with all variants, see [RadioButtonGroup in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-radiobuttongroup--docs).
:::
