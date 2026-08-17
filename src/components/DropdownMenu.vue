<script lang="ts" generic="Item extends any = any" setup>
import { computed, ref, watch } from 'vue'

type DropdownMenuProps = {
  items?: Item[]
  cursorIndex?: number
  /** ARIA role for the list element. Set to `listbox` when used as a combobox popup. */
  listRole?: 'listbox' | 'menu'
  /** Id applied to the list element (referenced by a combobox via `aria-controls`). */
  listId?: string
  /** Prefix for per-option ids (`${optionIdPrefix}-${index}`), used for `aria-activedescendant`. */
  optionIdPrefix?: string
  /** Marks an item as unavailable, so it renders disabled and emits no `item-click`. */
  itemDisabled?: (item: Item, index: number) => boolean
  /**
   * Groups consecutive items under a heading. Items are expected to arrive already ordered by
   * group; a heading is rendered wherever the label changes, so a group split across the list
   * would render its heading twice.
   */
  itemGroupLabel?: (item: Item, index: number) => string | undefined
}

type ItemWithIndex = { item: Item; index: number }

/** A heading or an item, in render order — keeps item indices flat despite the interleaved headings. */
type Row = { type: 'group'; label: string } | ({ type: 'item'; disabled: boolean } & ItemWithIndex)

const props = defineProps<DropdownMenuProps>()

const emit = defineEmits<{
  'item-click': [ItemWithIndex]
  'item-mouseenter': [ItemWithIndex]
  'item-mouseleave': [ItemWithIndex]
}>()

defineSlots<{
  item?: (props: ItemWithIndex & { cursorIndex?: number }) => any
  itemLabel?: (props: ItemWithIndex & { cursorIndex?: number }) => any
  groupLabel?: (props: { label: string }) => any
}>()

const itemElements = ref<HTMLElement[]>([])

const rows = computed<Row[]>(() => {
  const result: Row[] = []
  let currentGroup: string | undefined

  ;(props.items ?? []).forEach((item, index) => {
    const label = props.itemGroupLabel?.(item, index)

    if (label && label !== currentGroup) {
      result.push({ type: 'group', label })
    }

    currentGroup = label

    // Resolved once per item here rather than per use in the template, which reads it three times.
    result.push({ type: 'item', item, index, disabled: Boolean(props.itemDisabled?.(item, index)) })
  })

  return result
})

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
      <template v-for="(row, rowIndex) in rows" :key="rowIndex">
        <!--
          Headings share the flat list with the options so that option indices stay contiguous for
          cursor navigation and aria-activedescendant. They are marked presentational so a screen
          reader does not announce them as unselectable entries of the listbox; the trade-off is
          that group membership itself is conveyed visually only.
        -->
        <li v-if="row.type === 'group'" class="DropdownMenu__groupLabel" role="presentation">
          <slot name="groupLabel" v-bind="{ label: row.label }">
            {{ row.label }}
          </slot>
        </li>

        <li
          v-else
          class="DropdownMenu__item"
          :class="{ 'DropdownMenu__item--withCursor': cursorIndex === row.index }"
          :id="optionIdPrefix ? `${optionIdPrefix}-${row.index}` : undefined"
          :role="listRole === 'listbox' ? 'option' : listRole === 'menu' ? 'menuitem' : undefined"
          :aria-selected="listRole === 'listbox' ? cursorIndex === row.index : undefined"
          :aria-disabled="row.disabled ? 'true' : undefined"
          ref="itemElements"
        >
          <slot name="item" v-bind="{ item: row.item, index: row.index, cursorIndex }">
            <button
              class="DropdownMenu__button"
              :class="{ 'DropdownMenu__button--disabled': row.disabled }"
              :disabled="row.disabled"
              @click="emit('item-click', { item: row.item, index: row.index })"
              @mouseenter="emit('item-mouseenter', { item: row.item, index: row.index })"
              @mouseleave="emit('item-mouseleave', { item: row.item, index: row.index })"
            >
              <slot name="itemLabel" v-bind="{ item: row.item, index: row.index, cursorIndex }">
                {{ row.item }}
              </slot>
            </button>
          </slot>
        </li>
      </template>
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

.DropdownMenu__groupLabel {
  display: block;
  padding: 0.5rem 1.25rem 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vuiii-dropdownMenu-groupLabel-textColor, currentColor);
  opacity: var(--vuiii-dropdownMenu-groupLabel-opacity, 0.6);

  /* The divider between entries belongs between options, not under a heading */
  & + .DropdownMenu__item {
    border-top: none;
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

  &:hover:not(:disabled) {
    color: var(--vuiii-dropdownMenu-button-textColor--hover);
    background-color: var(--vuiii-dropdownMenu-button-bgColor--hover);
  }

  &:disabled {
    cursor: default;
    opacity: var(--vuiii-dropdownMenu-button-opacity--disabled, 0.5);
  }
}
</style>
