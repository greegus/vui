import { Meta, StoryFn } from '@storybook/vue3'

import Icon from '../components/Icon.vue'

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Example/Icon',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component: 'Standard icon'
      }
    }
  }
} as Meta<typeof Icon>

const Template: StoryFn<typeof Icon> = (args) => ({
  components: { Icon },
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
      <Icon name="spinner" />
      <Icon name="arrow-narrow-down" />
      <Icon name="arrow-narrow-left" />
      <Icon name="arrow-narrow-right" />
      <Icon name="arrow-narrow-up" />
      <Icon name="check-circle" />
      <Icon name="check" />
      <Icon name="chevron-left" />
      <Icon name="chevron-right" />
      <Icon name="exclamation-circle" />
      <Icon name="exclamation" />
      <Icon name="minus" />
      <Icon name="plus" />
      <Icon name="search" />
      <Icon name="trash" />
      <Icon name="x" />
    </div>
  `
})

export const Default = Template.bind({})
