import { type Meta, type StoryFn } from '@storybook/vue3'

import Button from '../components/Button.vue'
import { icons } from './assets/icons'

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Example/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Standard button'
      }
    }
  },
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  args: {
    variant: 'primary',
    size: 'normal',
    label: 'Add to Cart'
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'normal', 'large']
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary']
    },
    prefixIcon: {
      control: { type: 'select' },
      options: icons
    },
    suffixIcon: {
      control: { type: 'select' },
      options: icons
    },
    block: {
      control: { type: 'boolean' }
    },
    pill: {
      control: { type: 'boolean' }
    }
  }
} as Meta<typeof Button>

const DefaultTeplate: StoryFn<typeof Button> = () => ({
  components: { Button },
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: flex; gap: .5rem;">
        <Button label="Add to Cart" />
        <Button variant="primary" label="Add to Cart" />
        <Button variant="secondary" label="Add to Cart" />
        <Button variant="danger" label="Add to Cart" />
        <Button variant="success" label="Add to Cart" />
      </div>

      <div style="display: flex; gap: .5rem;">
        <Button disabled label="Add to Cart" />
        <Button disabled variant="primary" label="Add to Cart" />
        <Button disabled variant="secondary" label="Add to Cart" />
        <Button disabled variant="danger" label="Add to Cart" />
        <Button disabled variant="success" label="Add to Cart" />
      </div>

      <div style="display: flex; gap: .5rem;">
        <Button active label="Add to Cart" />
        <Button active variant="primary" label="Add to Cart" />
        <Button active variant="secondary" label="Add to Cart" />
        <Button active variant="danger" label="Add to Cart" />
        <Button active variant="success" label="Add to Cart" />
      </div>

      <div style="display: flex; gap: .5rem;">
        <Button outlined label="Add to Cart" />
        <Button outlined variant="primary" label="Add to Cart" />
        <Button outlined variant="secondary" label="Add to Cart" />
        <Button outlined variant="danger" label="Add to Cart" />
        <Button outlined variant="success" label="Add to Cart" />
      </div>

      <div style="display: flex; gap: .5rem;">
        <Button loading label="Add to Cart" />
        <Button loading variant="primary" label="Add to Cart" />
        <Button loading variant="secondary" label="Add to Cart" />
        <Button loading variant="danger" label="Add to Cart" />
        <Button loading variant="success" label="Add to Cart" />
      </div>

      <div style="display: flex; gap: .5rem;">
        <Button size="small" variant="primary" label="Add to Cart" />
        <Button size="normal" variant="primary" label="Add to Cart" />
        <Button size="large" variant="primary" label="Add to Cart" />
      </div>

      <div style="display: flex; gap: .5rem;">
        <Button loading size="small" variant="primary" label="Add to Cart" />
        <Button loading size="normal" variant="primary" label="Add to Cart" />
        <Button loading size="large" variant="primary" label="Add to Cart" />
      </div>

      <div style="display: flex; gap: .5rem;">
        <Button prefix-icon="plus" size="small" variant="primary" label="Add to Cart" />
        <Button prefix-icon="plus" size="normal" variant="primary" label="Add to Cart" />
        <Button prefix-icon="plus" size="large" variant="primary" label="Add to Cart" />
      </div>

      <div style="display: flex; gap: .5rem;">
        <Button pill size="small" variant="primary" label="Pill button" />
        <Button pill size="normal" variant="primary" label="Pill button" />
        <Button pill size="large" variant="primary" label="Pill button" />
      </div>
    </div>
  `
})

export const Default = {
  render: DefaultTeplate
}

const PlaygroundTemplate: StoryFn<typeof Button> = (args) => ({
  components: { Button },
  setup: () => ({ args }),
  template: '<Button v-bind="args" />'
})

export const Playground = {
  render: PlaygroundTemplate
}
