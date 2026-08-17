# FilePicker

File picker that opens the native dialog on click and also accepts files dropped onto it.

## Import

```typescript
import { FilePicker } from 'vuiii'
```

## Basic Usage

Without a slot it renders a button labelled by `label`. Selected or dropped files arrive through the
`files` event as a `File[]`.

<script setup>
import { ref } from 'vue'
import { FilePicker, Icon } from '../../src'

const picked = ref([])

function handleFiles(files) {
  picked.value = Array.from(files).map((file) => file.name)
}
</script>

<ComponentDemo storybook="components-filepicker--default">
  <div style="display: flex; flex-flow: column; gap: 0.75rem; align-items: flex-start;">
    <FilePicker label="Choose a file" @files="handleFiles" />
    <span v-if="picked.length" style="opacity: 0.7; font-size: 0.875rem">Picked: {{ picked.join(', ') }}</span>
  </div>
</ComponentDemo>

```vue
<script setup>
function handleFiles(files) {
  console.log(files) // File[]
}
</script>

<template>
  <FilePicker label="Choose a file" @files="handleFiles" />
</template>
```

## Props

| Prop       | Type                  | Default | Description                                       |
| ---------- | --------------------- | ------- | ------------------------------------------------- |
| `multiple` | `boolean`             | `false` | Allows selecting and dropping more than one file  |
| `accept`   | `string \| string[]`  | -       | Accepted types, as a list or a comma-separated string |
| `label`    | `string`              | -       | Label of the default button trigger               |

## Slots

| Slot      | Description                                             |
| --------- | ------------------------------------------------------- |
| `default` | Replaces the button entirely — the whole area stays clickable and droppable |

## Events

| Event   | Payload  | Description                            |
| ------- | -------- | -------------------------------------- |
| `files` | `File[]` | Files chosen in the dialog or dropped  |

## Accepted Types

`accept` follows the HTML attribute, so all three forms work: an exact MIME type, a wildcard, and a
file extension. Give it an array and it is joined for you.

<ComponentDemo>
  <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
    <FilePicker multiple accept="image/*" label="Upload images" @files="handleFiles" />
    <FilePicker :accept="['image/png', 'image/jpeg', '.pdf']" label="Upload documents" @files="handleFiles" />
  </div>
</ComponentDemo>

```vue
<FilePicker multiple accept="image/*" label="Upload images" @files="handleFiles" />
<FilePicker :accept="['image/png', 'image/jpeg', '.pdf']" label="Upload documents" @files="handleFiles" />
```

The filter applies to dropped files as well, not just to the native dialog — anything that does not
match is discarded before the event fires.

::: tip Single vs multiple
Without `multiple`, a drop of several files keeps only the first, matching what the native dialog
allows.
:::

## Custom Trigger

The default slot replaces the button with anything you like, and the whole area remains both
clickable and a drop target — which is how you build a dropzone.

<ComponentDemo>
  <FilePicker accept="image/*" @files="handleFiles">
    <div style="border: 2px dashed var(--vp-c-divider); border-radius: 8px; padding: 2rem; text-align: center; cursor: pointer;">
      <Icon name="arrow-up-tray" size="large" />
      <div style="margin-top: 0.5rem; opacity: 0.7">Drop files here, or click to browse</div>
    </div>
  </FilePicker>
</ComponentDemo>

```vue
<FilePicker accept="image/*" @files="handleFiles">
  <div class="dropzone">
    <Icon name="arrow-up-tray" size="large" />
    <span>Drop files here, or click to browse</span>
  </div>
</FilePicker>
```

## Dropping Images From Another Page

An image dragged out of another browser tab arrives as an HTML fragment rather than a file.
`FilePicker` resolves it and still hands you a `File`, so the drop works either way.

::: tip Building your own drop target
`FilePicker` is a thin layer over [useDropArea](/composables/use-drop-area), which gives you the
same drop handling plus an `isDropzoneActive` flag for styling — use it directly when you need a
drop target that is not a picker.
:::

::: tip Storybook
For interactive examples with all variants, see [FilePicker in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-filepicker--docs).
:::
