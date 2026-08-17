# FormGroup

Field wrapper adding a label, description, hint, required marker and error message around any
control. `FormFields` uses it internally; on its own it is how you build a hand-laid-out form.

::: tip Composition
Labels a single control. For how it relates to `FormFields` and `InputWrapper`, see [Composing Forms](/getting-started/composing-forms).
:::

## Import

```typescript
import { FormGroup } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { FormGroup, Input, Textarea, Tooltip, Icon } from '../../src'

const email = ref('')
const password = ref('')
const username = ref('')
const bio = ref('')
</script>

<ComponentDemo storybook="components-formgroup--default">
  <div style="width: 100%">
    <FormGroup label="Email">
      <template #default="{ id }">
        <Input :id="id" v-model="email" type="email" />
      </template>
    </FormGroup>
  </div>
</ComponentDemo>

```vue
<FormGroup label="Email">
  <template #default="{ id }">
    <Input :id="id" v-model="email" type="email" />
  </template>
</FormGroup>
```

::: warning Pass the slot id through
`FormGroup` generates an id and points its `<label for>` at it, then hands it to the default slot.
Forward it to your control to keep the label clickable and the field properly announced. Skipping it
still renders, but the label is no longer tied to anything.
:::

## Props

| Prop          | Type                 | Default | Description                                                    |
| ------------- | -------------------- | ------- | -------------------------------------------------------------- |
| `label`       | `string`             | -       | Label text                                                     |
| `for`         | `string`             | -       | Explicit id to label, instead of the generated one              |
| `required`    | `boolean`            | `false` | Shows the required marker next to the label                     |
| `description` | `string`             | -       | Explanatory text between the label and the control              |
| `hint`        | `string`             | -       | Secondary text below the control                                |
| `error`       | `string \| boolean`  | -       | Error message; `true` marks the field invalid with no message   |

## Slots

| Slot          | Description                                        |
| ------------- | -------------------------------------------------- |
| `default`     | The control. Props: `{ id }`                       |
| `label`       | Replaces the label text                            |
| `description` | Replaces the description text                      |
| `hint`        | Replaces the hint text                             |

## Description and Hint

`description` explains the field before it is filled in; `hint` sits below the control for a
constraint or format note.

<ComponentDemo>
  <div style="width: 100%">
    <FormGroup
      label="Password"
      description="Choose a strong password for your account"
      hint="Must be at least 8 characters"
    >
      <template #default="{ id }">
        <Input :id="id" v-model="password" type="password" />
      </template>
    </FormGroup>
  </div>
</ComponentDemo>

```vue
<FormGroup
  label="Password"
  description="Choose a strong password for your account"
  hint="Must be at least 8 characters"
>
  <template #default="{ id }">
    <Input :id="id" v-model="password" type="password" />
  </template>
</FormGroup>
```

## Required and Errors

`error` renders the message and marks the group invalid. Set `invalid` on the control too, so the
input itself picks up the error styling.

<ComponentDemo>
  <div style="width: 100%">
    <FormGroup label="Username" required error="This username is already taken">
      <template #default="{ id }">
        <Input :id="id" v-model="username" invalid />
      </template>
    </FormGroup>
  </div>
</ComponentDemo>

```vue
<FormGroup label="Username" required :error="errors.username">
  <template #default="{ id }">
    <Input :id="id" v-model="username" :invalid="!!errors.username" />
  </template>
</FormGroup>
```

With `useValidation` the per-field result feeds both directly:

```vue
<FormGroup label="Username" :error="validatedFields.username?.errorMessage">
  <template #default="{ id }">
    <Input :id="id" v-model="form.username" :invalid="validatedFields.username?.isInvalid" />
  </template>
</FormGroup>
```

## Custom Label

The `label` slot takes over the label content — useful for a help tooltip or a badge next to the
text.

<ComponentDemo>
  <div style="width: 100%">
    <FormGroup>
      <template #label>
        Email
        <Tooltip title="We will never share your email">
          <Icon name="exclamation" size="small" />
        </Tooltip>
      </template>
      <template #default="{ id }">
        <Input :id="id" v-model="email" />
      </template>
    </FormGroup>
  </div>
</ComponentDemo>

```vue
<FormGroup>
  <template #label>
    Email
    <Tooltip title="We will never share your email">
      <Icon name="exclamation" size="small" />
    </Tooltip>
  </template>
  <template #default="{ id }">
    <Input :id="id" v-model="email" />
  </template>
</FormGroup>
```

## Any Control

`FormGroup` makes no assumptions about what it wraps — VUIII inputs, native elements, or your own
components all work.

<ComponentDemo>
  <div style="width: 100%">
    <FormGroup label="Bio" hint="Markdown is supported">
      <template #default="{ id }">
        <Textarea :id="id" v-model="bio" rows="3" />
      </template>
    </FormGroup>
  </div>
</ComponentDemo>

```vue
<FormGroup label="Bio" hint="Markdown is supported">
  <template #default="{ id }">
    <Textarea :id="id" v-model="bio" rows="3" />
  </template>
</FormGroup>
```

::: tip Storybook
For interactive examples with all variants, see [FormGroup in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-formgroup--docs).
:::
