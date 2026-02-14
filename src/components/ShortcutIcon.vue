<template>
  <span class="ShortcutIcon">
    <kbd v-for="part in keys" :key="part.label" class="ShortcutIcon__key">
      {{ part.label }}
    </kbd>
  </span>
</template>

<script lang="ts" setup>
/**
 * Renders a keyboard shortcut as styled keycap badges.
 * Handles cross-platform differences between macOS and Windows/Linux.
 *
 * @component ShortcutIcon
 *
 * @example
 * // Basic modifier + key
 * import { ShortcutIcon } from 'vuiii'
 *
 * <ShortcutIcon :shortcut="{ key: 'k', mod: true }" />
 * // macOS: [⌘] [K]  |  Windows: [Ctrl] [K]
 *
 * @example
 * // Multiple modifiers
 * <ShortcutIcon :shortcut="{ key: 's', mod: true, shift: true }" />
 * // macOS: [⇧] [⌘] [S]  |  Windows: [Ctrl] [Shift] [S]
 *
 * @example
 * // Alt/Option modifier
 * <ShortcutIcon :shortcut="{ key: 'p', alt: true }" />
 * // macOS: [⌥] [P]  |  Windows: [Alt] [P]
 */
import { computed } from "vue";

import "@/assets/css/shortcut-icon.css";

import Icon from "@/components/Icon.vue";
import type { Shortcut } from "@/types";

type KeyPart = {
  label: string;
  icon?: string;
};

const props = defineProps<{
  shortcut: Shortcut;
}>();

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

const keys = computed<KeyPart[]>(() => {
  const parts: KeyPart[] = [];
  const { key, shift, alt, mod, ctrl } = props.shortcut;

  if (ctrl) {
    parts.push(isMac ? { label: "⌃" } : { label: "Ctrl" });
  }

  if (alt) {
    parts.push(isMac ? { label: "⌥", icon: "option" } : { label: "Alt" });
  }

  if (shift) {
    parts.push(isMac ? { label: "⇧", icon: "shift" } : { label: "Shift" });
  }

  if (mod) {
    parts.push(isMac ? { label: "⌘", icon: "command" } : { label: "Ctrl" });
  }

  const displayKey = key.length === 1 ? key.toUpperCase() : key;
  parts.push({ label: displayKey });

  return parts;
});
</script>
