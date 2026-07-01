<script lang="ts" generic="Item extends any = any" setup>
import { ref, watch } from 'vue'

type DropdownMenuProps = {
  items?: Item[]
  cursorIndex?: number
  /** ARIA role for the list element. Set to `listbox` when used as a combobox popup. */
  listRole?: 'listbox' | 'menu'
  /** Id applied to the list element (referenced by a combobox via `aria-controls`). */
  listId?: string
  /** Prefix for per-option ids (`${optionIdPrefix}-${index}`), used for `aria-activedescendant`. */
  optionIdPrefix?: string
}

type ItemWithIndex = { item: Item; index: number }

const props = defineProps<DropdownMenuProps>()

const emit = defineEmits<{
  'item-click': [ItemWithIndex]
  'item-mouseenter': [ItemWithIndex]
  'item-mouseleave': [ItemWithIndex]
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
        behavior: 'smooth',
      })
    }
  },
)
</script>

<template>
  <div class="DropdownMenu">
    <ul class="DropdownMenu__items" v-if="items?.length" :role="listRole" :id="listId">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="DropdownMenu__item"
        :class="{ 'DropdownMenu__item--withCursor': cursorIndex === index }"
        :id="optionIdPrefix ? `${optionIdPrefix}-${index}` : undefined"
        :role="listRole === 'listbox' ? 'option' : listRole === 'menu' ? 'menuitem' : undefined"
        :aria-selected="listRole === 'listbox' ? cursorIndex === index : undefined"
        ref="itemElements"
      >
        <slot name="item" v-bind="{ item, index, cursorIndex }">
          <button
            class="DropdownMenu__button"
            @click="emit('item-click', { item, index })"
            @mouseenter="emit('item-mouseenter', { item, index })"
            @mouseleave="emit('item-mouseleave', { item, index })"
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

<style>
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
    border-top: var(--vuiii-dropdownMenu-dividerWidth) solid var(--vuiii-dropdownMenu-dividerColor);
  }
}

.DropdownMenu__item {
  display: block;

  &:first-child,
  &:first-child .DropdownMenu__button {
    border-top-left-radius: calc(var(--vuiii-dropdownMenu-borderRadius) - var(--vuiii-dropdownMenu-borderWidth));
    border-top-right-radius: calc(var(--vuiii-dropdownMenu-borderRadius) - var(--vuiii-dropdownMenu-borderWidth));
  }

  &:last-child,
  &:last-child .DropdownMenu__button {
    border-bottom-left-radius: calc(var(--vuiii-dropdownMenu-borderRadius) - var(--vuiii-dropdownMenu-borderWidth));
    border-bottom-right-radius: calc(var(--vuiii-dropdownMenu-borderRadius) - var(--vuiii-dropdownMenu-borderWidth));
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
