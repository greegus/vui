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
 * // macOS: [⇧] [⌘] [S]  |  Windows: [Shift] [Ctrl] [S]
 *
 * @example
 * // Alt/Option modifier
 * <ShortcutIcon :shortcut="{ key: 'p', alt: true }" />
 * // macOS: [⌥] [P]  |  Windows: [Alt] [P]
 *
 * @example
 * // Server-side rendering: pass the platform explicitly, since the server has no navigator
 * <ShortcutIcon :shortcut="{ key: 'k', mod: true }" :platform="isMacRequest ? 'mac' : 'other'" />
 */
import { computed } from 'vue'

import type { Shortcut } from '@/types'

type KeyPart = {
  label: string
  icon?: string
}

const props = defineProps<{
  shortcut: Shortcut
  /**
   * Which key labels to use. Detected from the user agent when omitted, which is fine in the
   * browser but cannot work while server-side rendering — there the server has no `navigator`,
   * falls back to the Windows labels, and the client then hydrates macOS labels over them.
   * Pass it explicitly to keep both renders in agreement.
   */
  platform?: 'mac' | 'other'
}>()

const isMac = computed(() => {
  if (props.platform) {
    return props.platform === 'mac'
  }

  return typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
})

const keys = computed<KeyPart[]>(() => {
  const parts: KeyPart[] = []
  const { key, shift, alt, mod, ctrl } = props.shortcut

  if (ctrl) {
    parts.push(isMac.value ? { label: '⌃' } : { label: 'Ctrl' })
  }

  if (alt) {
    parts.push(isMac.value ? { label: '⌥', icon: 'option' } : { label: 'Alt' })
  }

  if (shift) {
    parts.push(isMac.value ? { label: '⇧', icon: 'shift' } : { label: 'Shift' })
  }

  if (mod) {
    parts.push(isMac.value ? { label: '⌘', icon: 'command' } : { label: 'Ctrl' })
  }

  const displayKey = key.length === 1 ? key.toUpperCase() : key
  parts.push({ label: displayKey })

  return parts
})
</script>

<style>
.ShortcutIcon {
  display: inline-flex;
  align-items: center;
  gap: 0.15em;
}

.ShortcutIcon__key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75em;
  font-weight: 500;
  font-family: inherit;
  line-height: 1;
  color: inherit;
  white-space: nowrap;
  opacity: 0.45;
}
</style>
