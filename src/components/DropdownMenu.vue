<script lang="ts" generic="Item extends any = any" setup>
interface DropdownMenuProps {
  items?: Item[]
  cursorIndex?: number
}

type ItemWithIndex = { item: Item; index: number }

defineProps<DropdownMenuProps>()

const emit = defineEmits<{
  'itemClick': [ItemWithIndex]
  'itemMouseenter': [ItemWithIndex]
  'itemMouseleave': [ItemWithIndex]
}>()

defineSlots<{
  item?: (props: ItemWithIndex) => any
  itemLabel?: (props: ItemWithIndex) => any
}>()
</script>

<template>
  <div class="DropdownMenu">
    <ul class="DropdownMenu__items" v-if="items?.length">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="DropdownMenu__item"
        :class="{ 'DropdownMenu__item--withCursor': cursorIndex === index }"
      >
        <slot name="item" v-bind="{ item, index }">
          <button
            class="DropdownMenu__button"
            @click="emit('itemClick', { item, index })"
            @mouseenter="emit('itemMouseenter', { item, index })"
            @mouseleave="emit('itemMouseleave', { item, index })"
          >
            <slot name="itemLabel" v-bind="{ item, index }">
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
  z-index: 9;
  background-color: var(--vuiii-color-white);
  border: 1px solid var(--vuiii-color-gray--light);
  box-shadow: var(--vuiii-shadow--large);
  border-radius: var(--vuiii-field-borderRadius);
  min-width: 100%;
  box-sizing: border-box;
  width: max-content;
}

.DropdownMenu__items {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;

  & > * + * {
    border-top: 1px solid var(--vuiii-color-gray--light);
  }
}

.DropdownMenu__item {
  display: block;

  &--withCursor {
    background-color: color-mix(in srgb, var(--vuiii-color-primary) 20%, transparent);
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
    background-color: var(--vuiii-color-gray--lighter);
  }
}
</style>
