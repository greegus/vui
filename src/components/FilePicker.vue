<template>
  <button type="button" class="FilePicker" @click="openFilePicker" ref="pickerOpener" v-bind="$attrs">
    <slot>
      <Button prefix-icon="arrow-up-tray" :label variant="primary" outlined />
    </slot>
  </button>

  <input
    ref="fileInput"
    type="file"
    :multiple="multiple"
    :accept="normalizedAccept"
    hidden
    @change="handleFileChange"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import Button from "@/components/Button.vue";
import { useDropArea } from "@/composables/useDropArea";

const props = withDefaults(
  defineProps<{
    multiple?: boolean;
    accept?: string | string[];
    label?: string;
  }>(),
  {
    multiple: false,
  },
);

const emit = defineEmits<{
  files: [files: File[]];
}>();

defineSlots<{
  default?: void;
}>();

const pickerOpener = ref<HTMLElement>();
const fileInput = ref<HTMLInputElement>();

const normalizedAccept = computed(() => {
  return Array.isArray(props.accept) ? props.accept.join(",") : props.accept;
});

function openFilePicker() {
  fileInput.value?.click();
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = input.files ? Array.from(input.files) : [];
  emit("files", files);
  input.value = "";
}

useDropArea(pickerOpener, (files) => emit('files', files), {
  accept: props.accept,
  multiple: props.multiple,
})
</script>

<style scoped>
.FilePicker {
  all: unset;
  cursor: pointer;
  display: inline-block;
}
</style>
