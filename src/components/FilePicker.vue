<template>
  <button
    type="button"
    class="FilePicker"
    :class="{ 'FilePicker--disabled': $props.disabled }"
    :disabled="$props.disabled"
    :aria-invalid="$props.invalid || undefined"
    @click="openFilePicker"
    ref="pickerOpener"
    v-bind="$attrs"
  >
    <slot v-bind="{ disabled: !!disabled, invalid: !!invalid }">
      <Button
        prefix-icon="arrow-up-tray"
        :label
        :color="$props.invalid ? 'danger' : 'primary'"
        :disabled="$props.disabled"
        variant="outlined"
      />
    </slot>
  </button>

  <input
    ref="fileInput"
    type="file"
    :multiple="multiple"
    :accept="normalizedAccept"
    :disabled="$props.disabled"
    hidden
    @change="handleFileChange"
  />
</template>

<script lang="ts" setup>
/**
 * File picker with drag-and-drop support. Opens native file dialog on click
 * and accepts files dropped onto the component.
 *
 * @component FilePicker
 *
 * @example
 * // Basic usage
 * import { FilePicker } from 'vuiii'
 *
 * <FilePicker @files="handleFiles" />
 *
 * @example
 * // Multiple files with accept filter
 * <FilePicker
 *   multiple
 *   accept="image/*"
 *   label="Upload Images"
 *   @files="(files) => images = files"
 * />
 *
 * @example
 * // Multiple accept types as array
 * <FilePicker
 *   :accept="['image/png', 'image/jpeg', '.pdf']"
 *   label="Upload Documents"
 *   @files="handleFiles"
 * />
 *
 * @example
 * // Disabled and validation states
 * <FilePicker disabled @files="handleFiles" />
 * <FilePicker :invalid="!!errors.attachment" @files="handleFiles" />
 *
 * @example
 * // Custom trigger with slot
 * <FilePicker accept="image/*" @files="handleFiles">
 *   <div class="dropzone">
 *     <Icon name="cloud-upload" />
 *     <span>Drop files here or click to upload</span>
 *   </div>
 * </FilePicker>
 *
 * @example
 * // Handle files
 * function handleFiles(files: File[]) {
 *   files.forEach(file => {
 *     console.log(file.name, file.size, file.type)
 *   })
 * }
 *
 * @slot default - Custom trigger content (replaces default button). Props: { disabled, invalid }
 *
 * @emits files - When files are selected or dropped. Payload: File[]
 */
import { computed, ref } from 'vue'

import Button from '@/components/Button.vue'
import { useDropArea } from '@/composables/useDropArea'

const props = withDefaults(
  defineProps<{
    multiple?: boolean
    accept?: string | string[]
    label?: string
    disabled?: boolean
    invalid?: boolean
  }>(),
  {
    multiple: false,
  },
)

const emit = defineEmits<{
  files: [files: File[]]
}>()

defineSlots<{
  default?: (props: { disabled: boolean; invalid: boolean }) => any
}>()

const pickerOpener = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()

const normalizedAccept = computed(() => {
  return Array.isArray(props.accept) ? props.accept.join(',') : props.accept
})

function openFilePicker() {
  if (props.disabled) {
    return
  }

  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files ? Array.from(input.files) : []

  // An empty list is emitted deliberately, so consumers can react to a cleared selection.
  emit('files', files)

  input.value = ''
}

// `props` itself is the reactive source, so `accept` / `multiple` are read at drop time rather
// than snapshotted here at setup, which would ignore any later prop change.
useDropArea(
  pickerOpener,
  (files) => {
    // `disabled` blocks clicks natively, but the drop listeners are bound to the element directly,
    // so a dropped file would otherwise still come through.
    if (props.disabled) {
      return
    }

    emit('files', files)
  },
  props,
)
</script>

<style scoped>
.FilePicker {
  all: unset;
  cursor: pointer;
  display: inline-block;
}

/* `all: unset` drops the native disabled styling, so the cursor is restored by hand */
.FilePicker--disabled {
  cursor: default;
}
</style>
