import { type Meta, StoryFn, StoryObj } from '@storybook/vue3'
import { computed, ref } from 'vue'

import Dropdown from '../components/Dropdown.vue'
import DropdownMenu from '../components/DropdownMenu.vue'
import Input from '../components/Input.vue'
import { icons } from './assets/icons'
import { plainArrayOptions } from './assets/options'

export default {
  title: 'Example/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Standard Dropdown'
      }
    }
  },
  argTypes: {
    label: {
      control: 'text'
    },
    icon: {
      control: 'select',
      options: icons
    },
    size: {
      control: 'select',
      options: ['small', 'normal', 'large']
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'danger', 'success']
    },
    block: {
      control: 'boolean'
    },
    pill: {
      control: 'boolean'
    }
  },
  args: {
    variant: 'primary',
    label: 'Dropdown'
  }
} as Meta<typeof Dropdown>

export const DefaultTemplate: StoryFn<typeof Dropdown> = (args) => ({
  components: { Dropdown, DropdownMenu },
  setup: () => ({ args, items: plainArrayOptions }),
  template: `
    <Dropdown v-bind="args">
      <template #default="{close}">
        <DropdownMenu :items="items" @click-item="close()" />
      </template>
    </Dropdown>
  `
})

export const Default: StoryObj<typeof Dropdown> = {
  render: DefaultTemplate
}
export const Block: StoryObj<typeof Dropdown> = {
  args: { block: true },
  render: DefaultTemplate
}

export const SearchSuggestions: StoryObj<typeof Dropdown> = {
  args: { block: true },
  render: (args) => ({
    components: { Dropdown, DropdownMenu, Input },
    setup: () => {
      const query = ref('')

      const cursor = ref(0)

      const dropdown = ref()

      const items = computed(() => {
        if (query.value === '') {
          return plainArrayOptions
        }

        return plainArrayOptions.filter((item) => item.toLowerCase().includes(query.value.toLowerCase()))
      })

      function setCursor(index: number) {
        cursor.value = Math.max(0, Math.min(plainArrayOptions.length - 1, index))
      }

      function selectItem(item) {
        if (item !== undefined) {
          query.value = item
          dropdown.value.close()
        }
      }

      return {
        args,
        items,
        query,
        cursor,
        dropdown,
        setCursor,
        selectItem
      }
    },
    template: `
      <Dropdown v-bind="args" ref="dropdown" @open="setCursor(0)">
        <template #trigger="{ open, close, isOpen }">
          <Input
            placeholder="Search"
            v-model="query"
            prefix-icon="search"
            @click="open()"
            @focus="open()"
            @keydown="open()"
            @keydown.tab="close()"
            @keydown.down="isOpen && setCursor(cursor + 1)"
            @keydown.up="isOpen && setCursor(cursor - 1)"
            @keydown.enter="isOpen && selectItem(items[cursor])"
          />
        </template>

        <template #default="{ close }" v-if="items.length">
          <DropdownMenu :items :cursor-index="cursor" @item-click="selectItem($event.item)" style="width: 100%; max-height: 100px" />
        </template>
      </Dropdown>
    `
  })
}
