import { Meta, StoryFn } from '@storybook/vue3'

import Checkbox from '@/components/Checkbox.vue'

export default {
  title: 'Example/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: 'Standard checkbox'
      }
    }
  }
} as Meta<typeof Checkbox>

const Template: StoryFn<typeof Checkbox> = (args) => ({
  components: { Checkbox },
  setup: () => ({}),
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
            <Checkbox label="Subscribe to newsletter" />
        </div>

        <div>
            <Checkbox label="Subscribe to newsletter" disabled />
        </div>

        <div>
            <Checkbox label="Subscribe to newsletter (small size)" size="small" />
        </div>

        <div>
            <Checkbox label="Subscribe to newsletter" description="Lorem ipsum dolor sid amed melonis quo." />
        </div>

        <div>
            <Checkbox required>
                Agree with <a href="#" target="_blank" @click.prevent>terms and conditions</a>
            </Checkbox>
        </div>

        <div>
            <Checkbox label="Subscribe to newsletter" switch />
        </div>

        <div>
            <Checkbox label="Subscribe to newsletter" switch size="small" />
        </div>
    </div>
  `
})

export const Default = {
  render: Template
}
