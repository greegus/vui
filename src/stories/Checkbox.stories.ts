import { type Meta, type StoryFn } from '@storybook/vue3'

import Checkbox from '../components/Checkbox.vue'
import DumpValue from './helpers/components/DumpValue.vue'
import { ref } from 'vue'

export default {
  title: 'Example/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: 'Standard checkbox'
      }
    }
  },
  args: {
    label: 'Agree with terms and conditions'
  }
} as Meta<typeof Checkbox>

const Template: StoryFn<typeof Checkbox> = (args) => ({
  components: { Checkbox },
  setup: () => ({ args, value: ref(false) }),
  template: `
    <Checkbox v-bind="args" v-model="value" />
  `
})

export const Default = {
  render: Template
}

export const Disabled = {
  render: Template,
  args: { disabled: true }
}

export const Description = {
  render: Template,
  args: { description: 'Lorem ipsum dolor sid amed melonis quo.' }
}

export const Sizes = {
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 4rem">
        <div style="display: flex; flex-flow: column; gap: 1rem">
          <Checkbox v-bind="args" size="small" />
          <Checkbox v-bind="args" size="normal" />
          <Checkbox v-bind="args" size="large" />
        </div>

        <div style="display: flex; flex-flow: column; gap: 1rem">
          <Checkbox v-bind="args" size="small" switch />
          <Checkbox v-bind="args" size="normal" switch />
          <Checkbox v-bind="args" size="large" switch />
        </div>
      </div>
    `
  })
}

export const Switch = {
  render: Template,
  args: { switch: true }
}

export const CustomLabelSlot = {
  render: () => ({
    components: { Checkbox },
    template: `
      <Checkbox required>
        Agree with <a href="#" target="_blank" @click.prevent>terms and conditions</a>
      </Checkbox>
    `
  })
}

export const ValueParsing = {
  args: {
    valueParser: {
      stringify: (rawValue) => rawValue === 'yes',
      parse: (serializedValue) => (serializedValue ? 'yes' : 'no')
    }
  },
  render: (args) => ({
    components: { Checkbox, DumpValue },
    setup: () => ({ args, value: ref('yes') }),
    template: `
      <div>
        <Checkbox v-bind="args" v-model="value" />
        <DumpValue :value="value" />
      </div>
    `
  })
}
