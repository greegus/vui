# VUIII - Vue Component Library

> AI Agent Context File - Auto-generated from source code JSDoc comments.
> Run `npm run docs` to regenerate.

## Overview

VUIII is a Vue 3 component library with TypeScript support, providing a comprehensive set of UI components, composables, and utilities for building modern web applications.

## Installation

```bash
npm install vuiii
```

```typescript
import { Button, Input, Select, FormFields } from 'vuiii'
import 'vuiii/style.css'
```

## Components

### Autocomplete

**File:** `src/components/Autocomplete.vue`

Autocomplete input with dropdown suggestions and keyboard navigation.
Supports custom option rendering, filtering, and various data formats.

**Examples:**

```typescript
// Basic usage with string array
import { Autocomplete } from 'vuiii'

<Autocomplete v-model="search" :options="['Apple', 'Banana', 'Cherry']" />
```

```typescript
// With object options and extractors
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
]

<Autocomplete
  v-model="search"
  :options="users"
  option-label="name"
  option-value="id"
  option-description="email"
  @select="(option) => selectedUser = option.data"
/>
```

```typescript
// With custom filter function
const customFilter = (option, query) => {
  return option.label.startsWith(query)
}

<Autocomplete
  v-model="search"
  :options="options"
  :filter="customFilter"
/>
```

### Breadcrumbs

**File:** `src/components/Breadcrumbs.vue`

Navigation breadcrumbs with router-link support.

**Examples:**

```typescript
// Basic usage
import { Breadcrumbs } from 'vuiii'
import type { BreadcrumbItems } from 'vuiii'

const breadcrumbs: BreadcrumbItems = [
  { label: 'Home', link: '/' },
  { label: 'Products', link: '/products' },
  { label: 'Electronics', link: '/products/electronics' }
]

<Breadcrumbs :breadcrumbs="breadcrumbs" />
```

```typescript
// With named routes
const breadcrumbs: BreadcrumbItems = [
  { label: 'Dashboard', link: { name: 'dashboard' } },
  { label: 'Users', link: { name: 'users' } },
  { label: 'John Doe', link: { name: 'user', params: { id: 123 } } }
]
```

### Button

**File:** `src/components/Button.vue`

Polymorphic button component that renders as <button>, <a>, or <router-link>.
Supports multiple variants, sizes, icons, and loading states.

**Examples:**

```typescript
// Basic button
import { Button } from 'vuiii'

<Button label="Click me" />
<Button variant="primary" label="Submit" />
<Button variant="danger" label="Delete" />
```

```typescript
// With icons
<Button prefixIcon="plus" label="Add Item" />
<Button label="Download" suffixIcon="arrow-down" />
<Button prefixIcon="save" suffixIcon="chevron-down" label="Save" />
```

```typescript
// Different sizes
<Button size="small" label="Small" />
<Button size="normal" label="Normal" />
<Button size="large" label="Large" />
```

### Checkbox

**File:** `src/components/Checkbox.vue`

Checkbox input with toggle/switch variant and indeterminate state support.
Can be used standalone or within CheckboxGroup.

**Examples:**

```typescript
// Basic usage
import { Checkbox } from 'vuiii'

<Checkbox v-model="accepted" label="I accept the terms" />
```

```typescript
// Switch variant (toggle)
<Checkbox v-model="enabled" switch label="Enable notifications" />
```

```typescript
// With description
<Checkbox
  v-model="newsletter"
  label="Subscribe to newsletter"
  description="Get weekly updates about new features"
/>
```

### CheckboxGroup

**File:** `src/components/CheckboxGroup.vue`

Group of checkboxes for multi-select from a list of options.
Normalizes various option formats and supports custom value parsing.

**Examples:**

```typescript
// Basic usage with string array
import { CheckboxGroup } from 'vuiii'

<CheckboxGroup v-model="selectedFruits" :options="['Apple', 'Banana', 'Cherry']" />
```

```typescript
// With object options and extractors
const permissions = [
  { id: 'read', name: 'Read', info: 'View content' },
  { id: 'write', name: 'Write', info: 'Edit content' },
  { id: 'delete', name: 'Delete', info: 'Remove content' }
]

<CheckboxGroup
  v-model="selectedPermissions"
  :options="permissions"
  option-value="id"
  option-label="name"
  option-description="info"
/>
```

```typescript
// Inline layout (horizontal)
<CheckboxGroup
  v-model="selected"
  :options="['Option A', 'Option B', 'Option C']"
  inline
/>
```

### Divider

**File:** `src/components/Divider.vue`

Visual separator line for content sections.
Can be horizontal (default) or vertical.

**Examples:**

```typescript
// Horizontal divider (default)
import { Divider } from 'vuiii'

<div>Section 1</div>
<Divider />
<div>Section 2</div>
```

```typescript
// Vertical divider (for inline content)
<div style="display: flex; align-items: center;">
  <span>Item 1</span>
  <Divider orientation="vertical" />
  <span>Item 2</span>
</div>
```

```typescript
// In FormFields (using FORM_DIVIDER constant)
import { FORM_DIVIDER } from 'vuiii'

const fields = [
  { name: 'name', component: Input, label: 'Name' },
  FORM_DIVIDER,
  { name: 'email', component: Input, label: 'Email' }
]
```

### Dropdown

**File:** `src/components/Dropdown.vue`

Popover dropdown component with customizable trigger and content.
Closes on click outside or Escape key. Supports programmatic control.

**Examples:**

```typescript
// Basic dropdown with default button trigger
import { Dropdown, DropdownMenu } from 'vuiii'

<Dropdown label="Options" variant="primary">
  <DropdownMenu :items="menuItems" @itemClick="handleClick" />
</Dropdown>
```

```typescript
// With custom trigger slot
<Dropdown>
  <template #trigger="{ open, close, toggle, isOpen }">
    <IconButton icon="ellipsis-vertical" @click="toggle()" />
  </template>

  <template #default="{ close }">
    <div class="custom-dropdown-content">
      <button @click="doSomething(); close()">Action</button>
    </div>
  </template>
</Dropdown>
```

```typescript
// Programmatic control via ref
const dropdownRef = ref<DropdownRef>()

// Open/close programmatically
dropdownRef.value?.open()
dropdownRef.value?.close()
dropdownRef.value?.toggle()

// Check state
if (dropdownRef.value?.isOpen.value) { ... }
```

### FilePicker

**File:** `src/components/FilePicker.vue`

File picker with drag-and-drop support. Opens native file dialog on click
and accepts files dropped onto the component.

**Examples:**

```typescript
// Basic usage
import { FilePicker } from 'vuiii'

<FilePicker @files="handleFiles" />
```

```typescript
// Multiple files with accept filter
<FilePicker
  multiple
  accept="image/*"
  label="Upload Images"
  @files="(files) => images = files"
/>
```

```typescript
// Multiple accept types as array
<FilePicker
  :accept="['image/png', 'image/jpeg', '.pdf']"
  label="Upload Documents"
  @files="handleFiles"
/>
```

### FormFields

**File:** `src/components/FormFields.vue`

Dynamic form generator that renders fields from a configuration array.
Supports vertical/horizontal layouts, nested rows, dividers, and validation integration.


  @example <template #field:email="{ name, label, index }">Custom email input</template>

**Examples:**

```typescript
// Basic vertical form
import { FormFields, Input, Select } from 'vuiii'

const fields: FormField<UserData>[] = [
  { name: 'email', component: Input, label: 'Email', props: { type: 'email' } },
  { name: 'name', component: Input, label: 'Name' },
  { name: 'role', component: Select, label: 'Role', props: { options: ['admin', 'user'] } }
]

<FormFields :fields="fields" v-model="formData" />
```

```typescript
// Horizontal row (fields side-by-side) - nest arrays for horizontal grouping
const fields: FormFieldOrRow<UserData>[] = [
  [
    { name: 'firstName', component: Input, label: 'First Name' },
    { name: 'lastName', component: Input, label: 'Last Name' }
  ],
  { name: 'email', component: Input, label: 'Email' }
]
```

```typescript
// With dividers between sections
import { FORM_DIVIDER } from 'vuiii'

const fields: FormFieldOrRow<UserData>[] = [
  { name: 'name', component: Input, label: 'Name' },
  FORM_DIVIDER,
  { name: 'email', component: Input, label: 'Email' }
]
```

### FormGroup

**File:** `src/components/FormGroup.vue`

Form field wrapper with label, description, hint, and error message support.
Used by FormFields internally, but can be used standalone for custom form layouts.

**Examples:**

```typescript
// Basic usage with label
import { FormGroup, Input } from 'vuiii'

<FormGroup label="Email">
  <Input v-model="email" type="email" />
</FormGroup>
```

```typescript
// With description and hint
<FormGroup
  label="Password"
  description="Choose a strong password for your account"
  hint="Must be at least 8 characters"
>
  <Input v-model="password" type="password" />
</FormGroup>
```

```typescript
// With required indicator and validation error
<FormGroup
  label="Username"
  required
  :error="errors.username"
>
  <Input v-model="username" :invalid="!!errors.username" />
</FormGroup>
```

### Icon

**File:** `src/components/Icon.vue`

Icon component that resolves icons through a customizable resolver.
Register your icon library using registerCustomIconResolver.

**Examples:**

```typescript
// Basic usage
import { Icon } from 'vuiii'

<Icon name="check" />
<Icon name="user" size="large" />
```

```typescript
// Different sizes
<Icon name="star" size="small" />
<Icon name="star" size="normal" />
<Icon name="star" size="large" />
```

```typescript
// Register custom icon resolver (typically in app setup)
import { registerCustomIconResolver } from 'vuiii'
import { defineAsyncComponent } from 'vue'

registerCustomIconResolver((name) => {
  return defineAsyncComponent(() => import(`./icons/${name}.vue`))
})
```

### IconButton

**File:** `src/components/IconButton.vue`

Icon-only button. A simplified Button wrapper for actions that only need an icon.

**Examples:**

```typescript
// Basic usage
import { IconButton } from 'vuiii'

<IconButton icon="pencil" @click="edit()" />
<IconButton icon="trash" variant="danger" @click="remove()" />
```

```typescript
// Different variants
<IconButton icon="plus" variant="primary" />
<IconButton icon="check" variant="secondary" />
<IconButton icon="x-mark" variant="danger" />
```

```typescript
// Different sizes
<IconButton icon="cog" size="small" />
<IconButton icon="cog" size="normal" />
<IconButton icon="cog" size="large" />
```

### Input

**File:** `src/components/Input.vue`

Text input component with icon support, size variants, and validation states.
Wraps native input with InputWrapper for consistent styling.

**Examples:**

```typescript
// Basic usage
import { Input } from 'vuiii'

<Input v-model="name" placeholder="Enter your name" />
```

```typescript
// Different input types (passed via attrs)
<Input v-model="email" type="email" placeholder="Email" />
<Input v-model="password" type="password" placeholder="Password" />
<Input v-model="count" type="number" placeholder="Count" />
```

```typescript
// With icons
<Input v-model="search" prefixIcon="magnifying-glass" placeholder="Search..." />
<Input v-model="email" suffixIcon="envelope" placeholder="Email" />
```

### InputWrapper

**File:** `src/components/InputWrapper.vue`

Base wrapper component for input styling. Used internally by Input, Select, Autocomplete.
Provides consistent styling, icon slots, and size variants across all input components.

**Examples:**

```typescript
// Typically used internally, but can be used for custom inputs
import { InputWrapper } from 'vuiii'

<InputWrapper size="normal" prefix-icon="user">
  <input class="vuiii-input__nested" v-model="value" />
</InputWrapper>
```

```typescript
// With validation state
<InputWrapper :invalid="hasError" size="normal">
  <input class="vuiii-input__nested" v-model="value" />
</InputWrapper>
```

```typescript
// With clickable icons
<InputWrapper
  suffix-icon="x-mark"
  @suffix-icon-click="clearValue"
>
  <input class="vuiii-input__nested" v-model="value" />
</InputWrapper>
```

### RadioGroup

**File:** `src/components/RadioGroup.vue`

Radio button group for single selection from a list of options.
Normalizes various option formats and supports custom value parsing.

**Examples:**

```typescript
// Basic usage with string array
import { RadioGroup } from 'vuiii'

<RadioGroup v-model="color" :options="['Red', 'Green', 'Blue']" />
```

```typescript
// With object options and extractors
const plans = [
  { id: 'free', name: 'Free', info: '0$/month' },
  { id: 'pro', name: 'Pro', info: '10$/month' },
  { id: 'enterprise', name: 'Enterprise', info: 'Contact us' }
]

<RadioGroup
  v-model="selectedPlan"
  :options="plans"
  option-value="id"
  option-label="name"
  option-description="info"
/>
```

```typescript
// Inline layout (horizontal)
<RadioGroup
  v-model="size"
  :options="['Small', 'Medium', 'Large']"
  inline
/>
```

### Select

**File:** `src/components/Select.vue`

Native select dropdown with support for various option formats and type parsing.
Normalizes arrays, objects, and grouped options into a consistent format.

**Examples:**

```typescript
// Basic usage with string array
import { Select } from 'vuiii'

<Select v-model="color" :options="['Red', 'Green', 'Blue']" />
```

```typescript
// With object array and extractors
const countries = [
  { code: 'us', name: 'United States' },
  { code: 'uk', name: 'United Kingdom' }
]

<Select
  v-model="country"
  :options="countries"
  option-value="code"
  option-label="name"
  placeholder="Select a country"
/>
```

```typescript
// With key-value object options
const statuses = { draft: 'Draft', published: 'Published', archived: 'Archived' }

<Select v-model="status" :options="statuses" />
```

### Table

**File:** `src/components/Table.vue`

Data table component with sorting, custom columns, cell formatting, and row customization.
Supports dynamic slot-based cell rendering and sortable columns.

**Examples:**

```typescript
// Basic table with typed columns
import { Table } from 'vuiii'
import type { TableColumn } from 'vuiii'

type User = { id: number; name: string; email: string }

const columns: TableColumn<User>[] = [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' }
]

<Table :items="users" :columns="columns" />
```

```typescript
// With custom cell rendering via slots
<Table :items="users" :columns="columns">
  <template #column:name="{ item, value }">
    <strong>{{ value }}</strong>
  </template>
  <template #column:status="{ item }">
    <Badge :variant="item.active ? 'success' : 'danger'">
      {{ item.active ? 'Active' : 'Inactive' }}
    </Badge>
  </template>
</Table>
```

```typescript
// With row actions (rowOptions slot)
<Table :items="users" :columns="columns">
  <template #rowOptions="{ item, index }">
    <IconButton icon="pencil" @click="edit(item)" />
    <IconButton icon="trash" @click="remove(item)" />
  </template>
</Table>
```

### Textarea

**File:** `src/components/Textarea.vue`

Multi-line text input with InputWrapper styling.
Supports prefix icon and programmatic control.

**Examples:**

```typescript
// Basic usage
import { Textarea } from 'vuiii'

<Textarea v-model="description" placeholder="Enter description..." />
```

```typescript
// With rows and placeholder
<Textarea
  v-model="content"
  placeholder="Write your message..."
  rows="5"
/>
```

```typescript
// With prefix icon
<Textarea v-model="notes" prefix-icon="document-text" placeholder="Notes..." />
```

### Typography

**File:** `src/components/Typography.vue`

Typography component for consistent text styling.
Automatically selects appropriate HTML tag based on variant.

**Examples:**

```typescript
// Different variants
import { Typography } from 'vuiii'

<Typography variant="display">Display Text</Typography>
<Typography variant="heading1">Heading 1</Typography>
<Typography variant="heading2">Heading 2</Typography>
<Typography variant="body1">Body text paragraph</Typography>
<Typography variant="caption">Small caption text</Typography>
<Typography variant="label">Form label</Typography>
```

```typescript
// Automatic tag selection
<Typography variant="heading1">Renders as h1</Typography>
<Typography variant="body1">Renders as p</Typography>
<Typography variant="label">Renders as span</Typography>
```

```typescript
// Override the HTML tag
<Typography variant="heading1" tag="h2">
  Styled as heading1, but renders as h2
</Typography>
```

## Composables

### dialogStack

**File:** `src/dialogStack.ts`

Dialog stack system for managing modal dialogs with promise-based APIs.
Supports custom dialog components, alerts, and confirmation dialogs.

**Examples:**

```typescript
// Setup: Add DialogStack component to your app root
import { DialogStack } from 'vuiii'

// In App.vue
<template>
  <router-view />
  <DialogStack />
</template>
```

```typescript
// Open a simple alert
import { useDialogStack } from 'vuiii'

const dialog = useDialogStack()
await dialog.alert('Operation completed!')
```

### snackbar

**File:** `src/snackbar.ts`

Snackbar/toast notification system for displaying brief messages.
Messages auto-dismiss after a configurable duration (default 7 seconds).

**Examples:**

```typescript
// Setup: Add SnackbarStack component to your app root
import { SnackbarStack } from 'vuiii'

// In App.vue
<template>
  <router-view />
  <SnackbarStack />
</template>
```

```typescript
// Show success message
import { useSnackbar } from 'vuiii'

const snackbar = useSnackbar()
snackbar.success('Item saved!')
```

### useCursor

**File:** `src/composables/useCursor.ts`

Manages cursor position for navigating through arrays.
Used internally by Autocomplete for keyboard navigation.

**Examples:**

```typescript
// Basic usage
import { useCursor } from 'vuiii'

const items = ref(['Apple', 'Banana', 'Cherry'])

const {
  cursorIndex,
  cursorItem,
  moveCursorForward,
  moveCursorBack,
  resetCursor
} = useCursor(items)

console.log(cursorItem.value) // 'Apple'
moveCursorForward()
console.log(cursorItem.value) // 'Banana'
```

```typescript
// With cycling
const { moveCursorForward } = useCursor(items, { cycle: true })
// At last item, moveCursorForward() goes back to first
```

### useDropArea

**File:** `src/composables/useDropArea.ts`

Enables drag-and-drop file handling on an element.
Provides dropzone active state for visual feedback.

**Examples:**

```typescript
// Basic usage
import { useDropArea } from 'vuiii'

const dropElement = ref<HTMLElement>()

const { isDropzoneActive } = useDropArea(
  dropElement,
  (files) => console.log('Dropped files:', files)
)

// In template
<div
  ref="dropElement"
  :class="{ 'dropzone-active': isDropzoneActive }"
>
  Drop files here
</div>
```

```typescript
// With file type filter
useDropArea(
  dropElement,
  handleFiles,
  { accept: 'image/*' }
)
```

### useLoadData

**File:** `src/composables/useLoadData.ts`

Wraps a data loading function with loading state, error handling,
and optional success/error messages. Built on top of useSubmitAction.

**Examples:**

```typescript
// Basic data loading
import { useLoadData } from 'vuiii'

const { load, isLoading, data } = useLoadData(
  () => api.fetchUsers()
)

onMounted(load)

// In template
<div v-if="isLoading">Loading...</div>
<div v-else>{{ data }}</div>
```

```typescript
// With immediate loading
const { isLoading, data } = useLoadData(
  () => api.fetchUsers(),
  { immediate: true }
)
```

### useLoadPaginatedData

**File:** `src/composables/useLoadPaginatedData.ts`

Extends useLoadData with pagination support for loading data in pages.
Provides methods for loading specific pages, next/previous navigation,
and optional append mode for infinite scroll.

**Examples:**

```typescript
// Basic paginated data loading
import { useLoadPaginatedData } from 'vuiii'
import type { PaginatedData } from 'vuiii'

const { items, pagination, loadPage, isLoading } = useLoadPaginatedData(
  ({ page, itemsPerPage }) => api.getUsers({ page, itemsPerPage })
)

onMounted(() => loadPage(1))
```

```typescript
// With immediate loading
const { items, pagination } = useLoadPaginatedData(
  ({ page, itemsPerPage }) => api.getItems({ page, itemsPerPage }),
  { immediate: true }
)
```

### useSubmitAction

**File:** `src/composables/useSubmitAction.ts`

Wraps an async action with submission state tracking, error handling,
success/error messages, and optional redirect on success.

**Examples:**

```typescript
// Basic form submission
import { useSubmitAction } from 'vuiii'

const { submit, isSubmitting } = useSubmitAction(
  (data) => api.createUser(data),
  {
    successMessage: 'User created!',
    errorMessage: 'Failed to create user',
    redirectOnSuccess: { name: 'users' }
  }
)

// In template
<Button :loading="isSubmitting" @click="submit(formData)">Save</Button>
```

```typescript
// With confirmation before submit
const { submit, isSubmitting } = useSubmitAction(
  (id) => api.deleteUser(id),
  {
    onBeforeSubmit: async ({ dialog }) => {
      return await dialog.confirm('Are you sure?')
    },
    successMessage: 'User deleted'
  }
)
```

### useValidation

**File:** `src/composables/useValidation.ts`

Manages form validation state with async validation support.
Integrates with FormFields via the validatedFields computed property.

**Examples:**

```typescript
// Basic validation
import { useValidation } from 'vuiii'
import type { ValidationResults } from 'vuiii'

type FormData = { email: string; password: string }

function validateForm(data: FormData): ValidationResults<FormData> {
  const errors: Record<string, string> = {}

  if (!data.email) errors.email = 'Email is required'
  if (!data.password) errors.password = 'Password is required'

  return {
    isValid: Object.keys(errors).length === 0,
    isInvalid: Object.keys(errors).length > 0,
    errorMessages: errors,
    validatedFields: {
      email: { isInvalid: !!errors.email, errorMessage: errors.email },
      password: { isInvalid: !!errors.password, errorMessage: errors.password }
    }
  }
}

const { validate, isValid, validatedFields } = useValidation(validateForm)
```

```typescript
// With FormFields integration
<FormFields
  :fields="fields"
  v-model="formData"
  :validation-results="validatedFields"
/>

async function submit() {
  if (await validate(formData)) {
    // form is valid, proceed with submission
  }
}
```

## Utilities

### iconsResolver

**File:** `src/utils/iconsResolver.ts`

Icon resolution system for the Icon component.
Allows registering custom icon libraries (Heroicons, FontAwesome, etc.)

### normalizeOptions

**File:** `src/utils/normalizeOptions.ts`

Utilities for normalizing various option formats into a consistent Option[] structure.
Used by Select, Autocomplete, RadioGroup, and CheckboxGroup components.

## Types

### types

**File:** `src/types.ts`

Core type definitions for vuiii components.
Import these types for TypeScript support in your application.

