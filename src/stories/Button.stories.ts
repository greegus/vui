import { Meta, StoryFn } from '@storybook/vue3'

import Button from '../components/Button.vue'

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
      options: ['small', 'normal', 'large', 'xlarge']
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary']
    }
  }
} as Meta<typeof Button>

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template: StoryFn<typeof Button> = (args) => ({
  components: { Button },
  setup: () => ({ args }),
  template: '<Button v-bind="args" />'
})

export const Playground = Template.bind({})

const GalleryTeplate: StoryFn<typeof Button> = () => ({
  components: { Button },
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: flex; gap: .5rem;">
        <Button label="Add to Cart" />
        <Button variant="primary" label="Add to Cart" />
        <Button variant="secondary" label="Add to Cart" />
        <Button variant="danger" label="Add to Cart" />
      </div>

      <div style="display: flex; gap: .5rem;">
        <Button disabled label="Add to Cart" />
        <Button disabled variant="primary" label="Add to Cart" />
        <Button disabled variant="secondary" label="Add to Cart" />
        <Button disabled variant="danger" label="Add to Cart" />
      </div>

      <div style="display: flex; gap: .5rem;">
        <Button active label="Add to Cart" />
        <Button active variant="primary" label="Add to Cart" />
        <Button active variant="secondary" label="Add to Cart" />
        <Button active variant="danger" label="Add to Cart" />
      </div>

      <div style="display: flex; gap: .5rem;">
        <Button loading label="Add to Cart" />
        <Button loading variant="primary" label="Add to Cart" />
        <Button loading variant="secondary" label="Add to Cart" />
        <Button loading variant="danger" label="Add to Cart" />
      </div>

      <div style="display: flex; gap: .5rem;">
        <Button size="small" variant="primary" label="Add to Cart" />
        <Button size="normal" variant="primary" label="Add to Cart" />
        <Button size="large" variant="primary" label="Add to Cart" />
        <Button size="xlarge" variant="primary" label="Add to Cart" />
      </div>
    </div>
  `
})

export const Gallery = GalleryTeplate.bind({})

Gallery.storyName = 'Showcase of all buttons'
