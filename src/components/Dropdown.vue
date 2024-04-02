<template>
  <div class="Dropdown" :class="{ 'Dropdown--block': block }" ref="rootElement">
    <slot name="trigger" v-bind="{ open, close, toggle }">
      <Button :label :variant :block :prefixIcon="icon" suffixIcon="chevron-down" @click="toggle()" />
    </slot>

    <div v-if="isOpen" class="Dropdown__dropdown" ref="dropdownElement">
      <slot v-bind="{ close }" />
    </div>
  </div>
</template>

<script lang="ts" generic="Item extends any = any" setup>
import { ref } from 'vue'

import Button from '@/components/Button.vue'
import { useOnClickOutside } from '@/composables/useOnClickOutside'
import { useOnKeyPress } from '@/composables/useOnKeyPress'
import { usePopper } from '@/composables/usePopper'
import { ButtonVariant } from '@/types'

interface DropdownProps {
  label?: string
  variant?: ButtonVariant
  block?: boolean
  icon?: string
}

defineProps<DropdownProps>()

const isOpen = ref(false)

const rootElement = ref<HTMLDivElement>()

const dropdownElement = ref<HTMLDivElement>()

function open() {
  if (isOpen.value) {
    return
  }

  isOpen.value = true
}

function close() {
  if (!isOpen.value) {
    return
  }

  isOpen.value = false
}

function toggle(state?: boolean) {
  state ?? !isOpen.value ? open() : close()
}

usePopper(rootElement, dropdownElement)

// Close by click outside
useOnClickOutside(rootElement, (event: MouseEvent) => {
  if (isOpen.value && !event.defaultPrevented) {
    event.preventDefault()
    close()
  }
})

// Close by Escape key
useOnKeyPress('Escape', (event: KeyboardEvent) => {
  if (isOpen.value && !event.defaultPrevented) {
    event.preventDefault()
    close()
  }
})

defineSlots<{
  default?: (props: { close: () => void }) => any
  trigger?: (props: { open: () => void; close: () => void; toggle: (state?: boolean) => void }) => any
}>()

defineExpose({
  open,
  close,
  toggle
})
</script>

<style scoped>
.Dropdown {
  position: relative;
  display: inline-block;
}

.Dropdown--block {
  display: block;
  width: 100%;
  flex-grow: 1;
}
</style>
