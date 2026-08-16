# Composing Forms

VUIII deliberately keeps form building in layers. Each layer is usable on its own, and each one is
built out of the layer below it — so you can start at whichever level fits the screen you are
building and drop down a level wherever you need control.

| Layer | Use it when |
| ----- | ----------- |
| **Bare inputs** — `Input`, `Select`, `Textarea`, `Checkbox`, `RadioGroup`, … | The control stands alone, or you supply your own labelling |
| **`FormGroup` + input** | You want a labelled field with description, hint and error, laid out yourself |
| **`FormFields`** | The whole form is data-driven and should be described as a config array |
| **`InputWrapper`** | You are building an input VUIII does not ship |

## Bare inputs

Every input is a plain `v-model` component. Nothing about it assumes a form.

```vue
<Input v-model="search" prefix-icon="search" placeholder="Search…" />
```

## FormGroup: labelling one field

`FormGroup` adds the label, description, hint, required marker and error message around any control.
It does not care what it wraps, so it works with VUIII inputs and native elements alike.

The important part is the default slot's `id`: `FormGroup` generates one and binds its `<label for>`
to it, so pass it through to the control to keep the label clickable and the field announced.

```vue
<FormGroup label="Email" description="We only use it for receipts" required :error="errors.email">
  <template #default="{ id }">
    <Input :id="id" v-model="form.email" type="email" :invalid="!!errors.email" />
  </template>
</FormGroup>
```

Because it is just a wrapper, laying out fields is ordinary CSS — no grid system to learn:

```vue
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem">
  <FormGroup label="First name"><template #default="{ id }"><Input :id="id" v-model="form.firstName" /></template></FormGroup>
  <FormGroup label="Last name"><template #default="{ id }"><Input :id="id" v-model="form.lastName" /></template></FormGroup>
</div>
```

## FormFields: describing the whole form as data

`FormFields` renders a `FormGroup` per entry and wires each one to a key of your model. It is the
same building blocks, assembled for you.

Any component works as a field — VUIII's, your own, or an async one — because `component` takes a
component, not a name from a fixed list. Everything in `props` is forwarded to it.

```vue
<script setup>
import { FormFields, Input, Select, Textarea } from 'vuiii'

const form = ref({ name: '', role: 'user', bio: '' })

const fields = [
  { name: 'name', component: Input, label: 'Name', required: true },
  { name: 'role', component: Select, label: 'Role', props: { options: ['admin', 'user'] } },
  { name: 'bio', component: Textarea, label: 'Bio', hint: 'Markdown is supported', props: { rows: 4 } },
]
</script>

<template>
  <FormFields v-model="form" :fields="fields" />
</template>
```

### Rows and dividers

Nest an array to put fields side by side; `FORM_DIVIDER` separates sections.

```ts
import { FORM_DIVIDER } from 'vuiii'

const fields = [
  [
    { name: 'firstName', component: Input, label: 'First name' },
    { name: 'lastName', component: Input, label: 'Last name' },
  ],
  FORM_DIVIDER,
  { name: 'email', component: Input, label: 'Email' },
]
```

### Conditional required and disabled

`required` and `disabled` accept a function of the current model, so a field can react to the rest
of the form without you rebuilding the config.

```ts
const fields = [
  { name: 'hasCompany', component: Checkbox, label: 'Buying for a company' },
  {
    name: 'vatId',
    component: Input,
    label: 'VAT ID',
    required: (form) => form.hasCompany,
    disabled: (form) => !form.hasCompany,
  },
]
```

### Overriding a single field

A generated form does not have to be all-or-nothing: `field:{name}` replaces the control for one
entry while keeping its label, layout and error handling.

```vue
<FormFields v-model="form" :fields="fields">
  <template #field:avatar="{ name }">
    <FilePicker accept="image/*" @files="([file]) => (form.avatar = file)" />
  </template>
</FormFields>
```

## Wiring in validation

`useValidation` produces `validatedFields`, which is exactly the shape `FormFields` expects for
`validation-results` — so the two snap together without adapter code.

```vue
<script setup>
import { FormFields, useValidation, useSubmitAction } from 'vuiii'

const form = ref({ email: '', password: '' })

const { validate, validatedFields } = useValidation((data) => {
  const errors = {}
  if (!data.email) errors.email = 'Email is required'
  if (data.password.length < 8) errors.password = 'At least 8 characters'

  return {
    isValid: !Object.keys(errors).length,
    isInvalid: !!Object.keys(errors).length,
    errorMessages: errors,
    validatedFields: Object.fromEntries(
      Object.keys(form.value).map((key) => [key, { isInvalid: !!errors[key], errorMessage: errors[key] }]),
    ),
  }
})

const { submit, isSubmitting } = useSubmitAction((data) => api.signUp(data), {
  successMessage: 'Welcome aboard!',
  onBeforeSubmit: () => validate(form.value),
})
</script>

<template>
  <FormFields v-model="form" :fields="fields" :validation-results="validatedFields" />
  <Button label="Sign up" color="primary" :loading="isSubmitting" @click="submit(form)" />
</template>
```

Doing the same by hand is the same objects, one level down — pass the per-field result into
`FormGroup`'s `error` and the input's `invalid`:

```vue
<FormGroup label="Email" :error="validatedFields.email?.errorMessage">
  <template #default="{ id }">
    <Input :id="id" v-model="form.email" :invalid="validatedFields.email?.isInvalid" />
  </template>
</FormGroup>
```

## InputWrapper: building your own control

`InputWrapper` is the chrome shared by `Input`, `Select` and `Autocomplete` — border, sizing,
focus ring, invalid state, prefix and suffix icons. Reach for it when you need a control VUIII does
not ship but want it to sit flush with the ones it does.

Give your inner element the `vuiii-input__nested` class so it inherits the typography and padding.

```vue
<InputWrapper size="normal" prefix-icon="calendar" :invalid="!!error" suffix-icon="x-mark" @suffix-icon-click="clear">
  <input class="vuiii-input__nested" type="date" v-model="value" />
</InputWrapper>
```

That is the whole ladder: `InputWrapper` builds an input, `FormGroup` labels it, `FormFields`
assembles many of them, and `useValidation` feeds all three.

## Next Steps

- [Option Extractors](/getting-started/option-extractors) — the shared data API behind `Select`,
  `Autocomplete`, `RadioGroup`, `RadioButtonGroup` and `CheckboxGroup`
- [FormFields](/components/form-fields) and [FormGroup](/components/form-group) reference
- [useValidation](/composables/use-validation) and [useSubmitAction](/composables/use-submit-action)
