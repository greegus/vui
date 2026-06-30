import { type Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Tabs from '../components/Tabs.vue'
import TabsNav from '../components/TabsNav.vue'
import DumpValue from './helpers/components/DumpValue.vue'

const tabs = [
  { key: 'profile', label: 'Profile' },
  { key: 'messages', label: 'Messages' },
  { key: 'settings', label: 'Settings' },
]

const tabsWithIcons = [
  { key: 'profile', label: 'Profile', icon: 'pencil' },
  { key: 'messages', label: 'Messages', icon: 'mail' },
  { key: 'search', label: 'Search', icon: 'search' },
]

export default {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component:
          'Tabbed interface: a tab switcher plus per-tab content rendered via `tab:{key}` slots. Active tab is an optional v-model whose value is the tab key.',
      },
    },
  },

  argTypes: {
    keepAlive: { control: { type: 'boolean' } },
    tabs: { control: { type: 'object' } },
  },

  args: {
    tabs,
  },
} as Meta<typeof Tabs>

export const Default: StoryObj<typeof Tabs> = {
  render: (args) => ({
    components: { Tabs, DumpValue },
    setup: () => {
      const active = ref('profile')
      return { args, active }
    },
    template: `
      <Tabs v-bind="args" v-model="active">
        <template #tab:profile>Profile content</template>
        <template #tab:messages>Messages content</template>
        <template #tab:settings>Settings content</template>
      </Tabs>
      <DumpValue :value="active" />
    `,
  }),
}

export const WithIcons: StoryObj<typeof Tabs> = {
  args: { tabs: tabsWithIcons },
  render: (args) => ({
    components: { Tabs },
    setup: () => ({ args }),
    template: `
      <Tabs v-bind="args">
        <template #tab:profile>Profile content</template>
        <template #tab:messages>Messages content</template>
        <template #tab:search>Search content</template>
      </Tabs>
    `,
  }),
}

export const CustomLabel: StoryObj<typeof Tabs> = {
  render: (args) => ({
    components: { Tabs },
    setup: () => ({ args }),
    template: `
      <Tabs v-bind="args">
        <template #label:messages>
          Messages
          <span style="margin-left: .4em; padding: 0 .4em; border-radius: 999px; background: var(--vuiii-color-primary); color: white; font-size: .75em;">3</span>
        </template>
        <template #tab:profile>Profile content</template>
        <template #tab:messages>Messages content</template>
        <template #tab:settings>Settings content</template>
      </Tabs>
    `,
  }),
}

export const KeepAlive: StoryObj<typeof Tabs> = {
  args: { keepAlive: true },
  parameters: {
    docs: {
      description: {
        story:
          'With `keep-alive`, inactive panels stay mounted (hidden), so the text typed below survives tab switches.',
      },
    },
  },
  render: (args) => ({
    components: { Tabs },
    setup: () => ({ args }),
    template: `
      <Tabs v-bind="args">
        <template #tab:profile><input placeholder="Type, switch tabs, come back…" /></template>
        <template #tab:messages>Messages content</template>
        <template #tab:settings>Settings content</template>
      </Tabs>
    `,
  }),
}

export const DisabledTab: StoryObj<typeof Tabs> = {
  args: {
    tabs: [
      { key: 'profile', label: 'Profile' },
      { key: 'messages', label: 'Messages', disabled: true },
      { key: 'settings', label: 'Settings' },
    ],
  },
  render: (args) => ({
    components: { Tabs },
    setup: () => ({ args }),
    template: `
      <Tabs v-bind="args">
        <template #tab:profile>Profile content</template>
        <template #tab:messages>Messages content</template>
        <template #tab:settings>Settings content</template>
      </Tabs>
    `,
  }),
}

export const StandaloneNav: StoryObj<typeof TabsNav> = {
  parameters: {
    docs: {
      description: { story: 'The `TabsNav` switcher used on its own with a v-model.' },
    },
  },
  render: () => ({
    components: { TabsNav, DumpValue },
    setup: () => {
      const active = ref('profile')
      return { active, tabs }
    },
    template: `
      <TabsNav v-model="active" :tabs="tabs" />
      <DumpValue :value="active" />
    `,
  }),
}
