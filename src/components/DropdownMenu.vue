<script lang="ts" generic="Item extends any = any" setup>
interface DropdownMenuProps {
  items?: Item[]
}

defineProps<DropdownMenuProps>()

const emits = defineEmits<{
  'clickItem': [Item]
}>()

defineSlots<{
  item?: (props: { item: Item }) => any
  itemLabel?: (props: { item: Item }) => any
}>()

function handleItemClick(item: Item) {
  emits('clickItem', item)
}
</script>

<template>
  <div class="DropdownMenu">
    <ul class="DropdownMenu__items" v-if="items?.length">
      <li v-for="(item, index) in items" :key="index" class="DropdownMenu__itemWrapper">
        <slot name="item" v-bind="{ item, index }">
          <button class="DropdownMenu__item" @click="handleItemClick(item)">
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
  border-radius: 0.25rem;
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

.DropdownMenu__itemWrapper {
  display: block;
}

.DropdownMenu__item {
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
