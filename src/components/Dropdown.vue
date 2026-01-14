<template>
  <div class="Dropdown" :class="{ 'Dropdown--block': block }" ref="rootElement">
    <slot name="trigger" v-bind="{ open, close, toggle, isOpen }">
      <Button :label :variant :block :prefixIcon="icon" suffixIcon="chevron-down" @click="toggle()" />
    </slot>

    <FadeTransition :duration="100">
      <div v-if="isOpen" class="Dropdown__dropdown" ref="dropdownElement">
        <slot v-bind="{ close }" />
      </div>
    </FadeTransition>
  </div>
</template>

<script lang="ts" type="module">
import type { ComputedRef } from 'vue'
import type { ButtonVariant } from '@/types'

export type DropdownProps = {
  label?: string
  variant?: ButtonVariant
  block?: boolean
  icon?: string
}

export type DropdownRef = {
  open: () => void
  close: () => void
  toggle: (state?: boolean) => void
  isOpen: ComputedRef<boolean>
}
</script>

<script lang="ts" generic="Item extends any = any" setup>
import { computed, ref } from 'vue'

import Button from '@/components/Button.vue'
import FadeTransition from '@/components/transitions/FadeTransition.vue'
import { useOnClickOutside } from '@/composables/useOnClickOutside'
import { useOnKeyPress } from '@/composables/useOnKeyPress'
import { usePopper } from '@/composables/usePopper'

defineProps<DropdownProps>()

const emit = defineEmits<{
  open: []
  close: []
}>()

const isOpen = ref(false)

const rootElement = ref<HTMLDivElement>()

const dropdownElement = ref<HTMLDivElement>()

function open() {
  if (isOpen.value) {
    return
  }

  isOpen.value = true

  emit('open')
}

function close() {
  if (!isOpen.value) {
    return
  }

  isOpen.value = false

  emit('close')
}

function toggle(state?: boolean) {
  if (state ?? !isOpen.value) {
    open()
  } else {
    close()
  }
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
  trigger?: (props: { open: () => void; close: () => void; toggle: (state?: boolean) => void; isOpen: boolean }) => any
}>()

defineExpose({
  open,
  close,
  toggle,
  isOpen: computed(() => isOpen.value)
})
</script>

<style scoped>
.Dropdown {
  position: relative;
  display: inline-block;

  &.Dropdown--block {
    display: block;
    width: 100%;
    flex-grow: 1;
  }
}

.Dropdown__dropdown {
  position: absolute;
  width: max-content;
  min-width: 100%;
  z-index: 10;
}
</style>
