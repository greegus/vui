import { type Meta, type StoryFn } from '@storybook/vue3'

import RadioGroup from '../components/RadioGroup.vue'
import DumpValue from './helpers/components/DumpValue.vue'
import { objectOptions } from './assets/options'
import { ref } from 'vue'

export default {
  title: 'Example/RadioGroup',
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component: 'Standard radio group'
      }
    }
  },

  args: {
    options: objectOptions,
    optionValue: 'value',
    optionLabel: 'label',
    optionDescription: 'description',
    optionDisabled: 'disabled',
    label: 'Subscribe to newsletter'
  }
} as Meta<typeof RadioGroup>

const Template: StoryFn<typeof RadioGroup> = (args) => ({
  components: { RadioGroup },
  setup: () => ({ args }),
  template: `
    <RadioGroup v-bind="args" />
  `
})

export const Default = {
  render: Template
}

export const Disabled = {
  args: { disabled: true },
  render: Template
}

// export const Sizes = {
//   args: { disabled: true },
//   render: (args) => ({
//     components: { RadioGroup },
//     setup: () => ({ args }),
//     template: `
//       <RadioGroup v-bind="args" size="small" />
//       <RadioGroup v-bind="args" size="normal" />
//       <RadioGroup v-bind="args" size="large" />
//     `
//   })
// }

export const ValueCasting = {
  render: () => ({
    components: { RadioGroup, DumpValue },
    setup: () => ({
      options: { 1: 'Option 1', 2: 'Option 2', 3: 'Option 3' },
      value: ref(1)
    }),
    template: `
      <div>
        <RadioGroup v-model="value" :options="options" type="number" />
        <DumpValue :value="value" />
      </div>
  `
  })
}
