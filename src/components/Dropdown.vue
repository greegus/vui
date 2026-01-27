<template>
  <div class="Dropdown" :class="{ 'Dropdown--block': block }" ref="rootElement">
    <div :style="{ 'anchor-name': anchorName }">
      <slot name="trigger" v-bind="{ open, close, toggle, isOpen }">
        <Button :label :variant :block :prefixIcon="icon" suffixIcon="chevron-down" @click="toggle()" />
      </slot>
    </div>

    <FadeTransition :duration="100">
      <div v-if="isOpen" class="Dropdown__dropdown" :style="{
        'position-anchor': anchorName,
        'position-area': positionArea
      }">
        <slot v-bind="{ close }" />
      </div>
    </FadeTransition>
  </div>
</template>

<script lang="ts" type="module">
/**
 * Popover dropdown component with customizable trigger and content.
 * Closes on click outside or Escape key. Supports programmatic control.
 *
 * @component Dropdown
 *
 * @example
 * // Basic dropdown with default button trigger
 * import { Dropdown, DropdownMenu } from 'vuiii'
 *
 * <Dropdown label="Options" variant="primary">
 *   <DropdownMenu :items="menuItems" @itemClick="handleClick" />
 * </Dropdown>
 *
 * @example
 * // With custom trigger slot
 * <Dropdown>
 *   <template #trigger="{ open, close, toggle, isOpen }">
 *     <IconButton icon="ellipsis-vertical" @click="toggle()" />
 *   </template>
 *
 *   <template #default="{ close }">
 *     <div class="custom-dropdown-content">
 *       <button @click="doSomething(); close()">Action</button>
 *     </div>
 *   </template>
 * </Dropdown>
 *
 * @example
 * // Programmatic control via ref
 * const dropdownRef = ref<DropdownRef>()
 *
 * // Open/close programmatically
 * dropdownRef.value?.open()
 * dropdownRef.value?.close()
 * dropdownRef.value?.toggle()
 *
 * // Check state
 * if (dropdownRef.value?.isOpen.value) { ... }
 *
 * @example
 * // With dropdown placement control
 * <Dropdown label="Menu" dropdown-placement="right">
 *   <DropdownMenu :items="items" />
 * </Dropdown>
 *
 * @example
 * // Full-width block dropdown
 * <Dropdown label="Select Action" block>
 *   <DropdownMenu :items="actions" />
 * </Dropdown>
 *
 * @slot trigger - Custom trigger element. Props: { open, close, toggle, isOpen }
 * @slot default - Dropdown content. Props: { close }
 *
 * @emits open - When dropdown opens
 * @emits close - When dropdown closes
 */
import type { ComputedRef } from "vue";
import type { ButtonVariant } from "@/types";

export type DropdownProps = {
  label?: string;
  variant?: ButtonVariant;
  block?: boolean;
  icon?: string;
  dropdownPlacement?: 'left' | 'right' | 'center'
};

export type DropdownRef = {
  open: () => void;
  close: () => void;
  toggle: (state?: boolean) => void;
  isOpen: ComputedRef<boolean>;
};
</script>

<script lang="ts" generic="Item extends any = any" setup>
import { computed, ref, useId } from "vue";

import Button from "@/components/Button.vue";
import FadeTransition from "@/components/transitions/FadeTransition.vue";
import { useOnClickOutside } from "@/composables/useOnClickOutside";
import { useOnKeyPress } from "@/composables/useOnKeyPress";

const props = defineProps<DropdownProps>();

const emit = defineEmits<{
  open: [];
  close: [];
}>();

const isOpen = ref(false);

const rootElement = ref<HTMLDivElement>();

const anchorName = `--anchor-${useId()}`;

const positionArea = computed(() => {
  if (props.dropdownPlacement === "center") return "bottom";
  if (props.dropdownPlacement === "right") return "bottom span-left";
  return "bottom span-right";
});

function open() {
  if (isOpen.value) {
    return;
  }

  isOpen.value = true;

  emit("open");
}

function close() {
  if (!isOpen.value) {
    return;
  }

  isOpen.value = false;

  emit("close");
}

function toggle(state?: boolean) {
  if (state ?? !isOpen.value) {
    open();
  } else {
    close();
  }
}

// Close by click outside
useOnClickOutside(rootElement, (event: MouseEvent) => {
  if (isOpen.value && !event.defaultPrevented) {
    event.preventDefault();
    close();
  }
});

// Close by Escape key
useOnKeyPress("Escape", (event: KeyboardEvent) => {
  if (isOpen.value && !event.defaultPrevented) {
    event.preventDefault();
    close();
  }
});

defineSlots<{
  default?: (props: { close: () => void }) => any;
  trigger?: (props: { open: () => void; close: () => void; toggle: (state?: boolean) => void; isOpen: boolean }) => any;
}>();

defineExpose({
  open,
  close,
  toggle,
  isOpen: computed(() => isOpen.value),
});
</script>

<style>
.Dropdown {
  position: relative;
  display: inline-block;

  &.Dropdown--block {
    display: block;
    width: 100%;
  }
}

.Dropdown__dropdown {
  margin-top: 1px;
  position: absolute;
  width: max-content;
  min-width: 100%;
  z-index: 10;

  position-try-fallbacks: flip-block, flip-inline;
  position-visibility: anchors-visible;
}
</style>
