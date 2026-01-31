# FilePicker

File picker with drag-and-drop support. Opens native file dialog on click
and accepts files dropped onto the component.

## Import

```typescript
import { FilePicker } from 'vuiii'
```

## Basic Usage

<script setup>
import { ref } from 'vue'
import { FilePicker } from '../../src'
</script>

<ComponentDemo storybook="example-filepicker--default">
  <!-- Add live demo here -->
</ComponentDemo>

```vue
// Basic usage
import { FilePicker } from 'vuiii'

<FilePicker @files="handleFiles" />
```

## More Examples

```vue
// Multiple files with accept filter
<FilePicker
  multiple
  accept="image/*"
  label="Upload Images"
  @files="(files) => images = files"
/>
```

```vue
// Multiple accept types as array
<FilePicker
  :accept="['image/png', 'image/jpeg', '.pdf']"
  label="Upload Documents"
  @files="handleFiles"
/>
```

```vue
// Custom trigger with slot
<FilePicker accept="image/*" @files="handleFiles">
  <div class="dropzone">
    <Icon name="cloud-upload" />
    <span>Drop files here or click to upload</span>
  </div>
</FilePicker>
```

::: tip Storybook
For interactive examples with all variants, see [FilePicker in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-filepicker--docs).
:::
