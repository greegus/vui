import { Meta, StoryFn } from '@storybook/vue3'

import Input from '../components/Input.vue'
import { icons } from './icons'

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Example/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: 'Standard input field'
      }
    }
  },
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  args: {
    modelValue: '',
    size: 'normal'
  },
  argTypes: {
    modelValue: {
      control: { type: 'text' }
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'normal', 'large', 'xlarge']
    },
    prefixIcon: {
      control: { type: 'select' },
      options: icons
    },
    suffixIcon: {
      control: { type: 'select' },
      options: icons
    },
    placeholder: {
      control: { type: 'text' },
      defaultValue: 'Placeholder'
    },
    disabled: {
      control: { type: 'boolean' }
    },
    readonly: {
      control: { type: 'boolean' }
    }

    // prefixIcon?: string
    // suffixIcon?: string
    // size?: InputSize
    // invalid?: boolean

    // size: {
    //   control: { type: 'select' },
    //   options: ['small', 'normal', 'large', 'xlarge']
    // },
    // variant: {
    //   control: { type: 'select' },
    //   options: ['primary', 'secondary']
    // }
  }
} as Meta<typeof Input>

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template: StoryFn<typeof Input> = (args) => ({
  components: { Input },
  setup: () => ({ args }),
  template: '<Input v-bind="args" />'
})

export const Playground = Template.bind({})

const GalleryTeplate: StoryFn<typeof Input> = () => ({
  components: { Input },
  setup: () => ({
    alert: (message: string) => window.alert(message)
  }),
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; flex-direction: column; gap: .5rem;">
            <Input placeholder="First name" />
            <Input placeholder="Email address" prefix-icon="mail" />
            <Input placeholder="Search" prefix-icon="search" suffix-icon="x" @suffix-icon-click="alert('Suffix clicked!')" />
            <Input placeholder="username">
                <template #prefix>
                    <div style="display: flex; align-items:center; padding-left: 1rem; margin-right: -1rem">
                        facebook.com/
                    </div>
                </template>
            </Input>
        </div>

        <div style="display: flex; flex-direction: column; gap: .5rem;">
            <Input placeholder="First name" size="small" />
            <Input placeholder="First name" />
            <Input placeholder="First name" size="large" />
            <Input placeholder="First name" size="xlarge" />
        </div>
    </div>
  `
})

export const Gallery = GalleryTeplate.bind({})

Gallery.storyName = 'Showcase of input fields'
