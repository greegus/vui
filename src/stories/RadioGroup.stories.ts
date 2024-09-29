import { type Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

import RadioGroup from '../components/RadioGroup.vue'
import { objectOptions, plainObjectOptions } from './assets/options'
import DumpValue from './helpers/components/DumpValue.vue'

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
    options: plainObjectOptions
  }
} as Meta<typeof RadioGroup>

export const Default: StoryObj<typeof RadioGroup> = {}

export const Disabled: StoryObj<typeof RadioGroup> = {
  args: { disabled: true }
}

// export const Sizes: StoryObj<typeof RadioGroup> = {
//   render: (args) => ({
//     components: { RadioGroup },
//     setup: () => ({ args }),
//     template: `
//       <div style="display: flex; gap: 4rem">
//         <RadioGroup v-bind="args" size="small" />
//         <RadioGroup v-bind="args" size="normal" />
//         <RadioGroup v-bind="args" size="large" />
//       </div
//     `
//   })
// }

export const OptionPropsMapping: StoryObj<typeof RadioGroup> = {
  args: {
    options: objectOptions,
    optionValue: 'value',
    optionLabel: 'label',
    optionDisabled: 'disabled',
    optionDescription: 'description'
  }
}

export const ValueCasting: StoryObj<typeof RadioGroup> = {
  args: { options: plainObjectOptions, type: 'number' },
  render: (args) => ({
    components: { RadioGroup, DumpValue },
    setup: () => ({ args, value: ref() }),
    template: `
      <RadioGroup v-bind="args" v-model="value" />
      <DumpValue :value="value" />
    `
  })
}

export const CustomRadioSymbol: StoryObj<typeof RadioGroup> = {
  args: {
    options: plainObjectOptions
  },
  render: (args) => ({
    components: { RadioGroup, DumpValue },
    setup: () => ({ args, value: ref() }),
    template: `
      <RadioGroup v-bind="args" v-model="value">
        <template #symbol="{ checked }">
          {{ checked ? '(o)' : '( )' }}
        </template>
      </RadioGroup>
      <DumpValue :value="value" />
    `
  })
}
