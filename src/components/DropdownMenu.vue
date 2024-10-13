<script lang="ts" generic="Item extends any = any" setup>
import { ref, watch } from 'vue'

interface DropdownMenuProps {
  items?: Item[]
  cursorIndex?: number
}

type ItemWithIndex = { item: Item; index: number }

const props = defineProps<DropdownMenuProps>()

const emit = defineEmits<{
  'itemClick': [ItemWithIndex]
  'itemMouseenter': [ItemWithIndex]
  'itemMouseleave': [ItemWithIndex]
}>()

defineSlots<{
  item?: (props: ItemWithIndex & { cursorIndex?: number }) => any
  itemLabel?: (props: ItemWithIndex & { cursorIndex?: number }) => any
}>()

const itemElements = ref<HTMLElement[]>([])

watch(
  () => props.cursorIndex,
  (cursorIndex) => {
    if (cursorIndex !== undefined && cursorIndex >= 0) {
      itemElements.value[cursorIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }
)
</script>

<template>
  <div class="DropdownMenu">
    <ul class="DropdownMenu__items" v-if="items?.length">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="DropdownMenu__item"
        :class="{ 'DropdownMenu__item--withCursor': cursorIndex === index }"
        ref="itemElements"
      >
        <slot name="item" v-bind="{ item, index, cursorIndex }">
          <button
            class="DropdownMenu__button"
            @click="emit('itemClick', { item, index })"
            @mouseenter="emit('itemMouseenter', { item, index })"
            @mouseleave="emit('itemMouseleave', { item, index })"
          >
            <slot name="itemLabel" v-bind="{ item, index, cursorIndex }">
              {{ item }}
            </slot>
          </button>
        </slot>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss">
.DropdownMenu {
  position: relative;
  z-index: 10;
  background-color: var(--vuiii-dropdownMenu-bgColor);
  color: var(--vuiii-dropdownMenu-textColor);
  border: var(--vuiii-dropdownMenu-borderWidth) solid var(--vuiii-dropdownMenu-borderColor);
  border-radius: var(--vuiii-dropdownMenu-borderRadius);
  box-shadow: var(--vuiii-dropdownMenu-boxShadow);
  min-width: 100%;
  box-sizing: border-box;
  width: max-content;
  display: flex;
  flex-flow: column;
}

.DropdownMenu__items {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1 1 auto;
  max-height: 100%;

  & > * + * {
    border-top: var(--vuiii-dropdownMenu-separator-width) solid var(--vuiii-color-gray--light);
  }
}

.DropdownMenu__item {
  display: block;

  &:first-child,
  &:first-child .DropdownMenu__button {
    border-top-left-radius: var(--vuiii-dropdownMenu-borderRadius);
    border-top-right-radius: var(--vuiii-dropdownMenu-borderRadius);
  }

  &:last-child,
  &:last-child .DropdownMenu__button {
    border-bottom-left-radius: var(--vuiii-dropdownMenu-borderRadius);
    border-bottom-right-radius: var(--vuiii-dropdownMenu-borderRadius);
  }

  &.DropdownMenu__item--withCursor {
    color: var(--vuiii-dropdownMenu-cursor-textColor);
    background-color: var(--vuiii-dropdownMenu-cursor-bgColor);
  }
}

.DropdownMenu__button {
  all: unset;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  display: block;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    color: var(--vuiii-dropdownMenu-button-textColor--hover);
    background-color: var(--vuiii-dropdownMenu-button-bgColor--hover);
  }
}
</style>
