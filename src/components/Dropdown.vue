<template>
  <div class="Dropdown" :class="{ 'Dropdown--block': block }" ref="rootElement">
    <slot name="trigger" v-bind="{ open, close, toggle }">
      <Button :label :variant :block :prefixIcon="icon" suffixIcon="chevron-down" @click="toggle()" />
    </slot>

    <div v-if="isOpen" class="Dropdown__dropdown" ref="dropdownElement">
      <slot v-bind="{ close }">
        <ul class="Dropdown__items" :style="{ maxHeight: height + 'px' }">
          <li v-for="(item, index) in items" :key="index" class="Dropdown__itemWrapper">
            <slot name="item" v-bind="{ item, close }">
              <button class="Dropdown__item" @click="handleItemClick(item)">
                <slot name="itemLabel" v-bind="{ item }">
                  {{ item }}
                </slot>
              </button>
            </slot>
          </li>
        </ul>
      </slot>
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

interface Dropdownprops {
  label?: string
  variant?: ButtonVariant
  block?: boolean
  icon?: string
  height?: number
  items?: Item[]
}

withDefaults(defineProps<Dropdownprops>(), {
  height: 200
})

const emit = defineEmits<{
  'item-click': [Item]
}>()

const isOpen = ref(false)

const rootElement = ref<HTMLDivElement>()

const dropdownElement = ref<HTMLDivElement>()

function open() {
  if (isOpen.value) {
    return
  }

  console.log('open')

  isOpen.value = true
}

function close() {
  if (!isOpen.value) {
    return
  }

  console.log('close')

  isOpen.value = false
}

function toggle(state?: boolean) {
  console.log('isOpen.value', isOpen.value, state)

  state ?? !isOpen.value ? open() : close()
}

function handleItemClick(item: Item) {
  emit('item-click', item)
  close()
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
  item?: (props: { item: Item; close: () => void }) => any
  itemLabel?: (props: { item: Item }) => any
}>()
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

.Dropdown__dropdown {
  position: absolute;
  z-index: 9;
  background-color: var(--vuiii-color-white);
  border: 1px solid var(--vuiii-color-gray--light);
  box-shadow: var(--vuiii-shadow--large);
  border-radius: 0.25rem;
  min-width: 100%;
  box-sizing: border-box;
  width: max-content;
}

.Dropdown__items {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;

  & > * + * {
    border-top: 1px solid var(--vuiii-color-gray--light);
  }
}

.Dropdown__itemWrapper {
  display: block;
}

.Dropdown__item {
  all: unset;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  display: block;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background-color: var(--vuiii-color-gray--lighter);
  }
}
</style>
