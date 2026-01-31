import { type Meta, StoryObj } from "@storybook/vue3-vite";

import Divider from "../components/Divider.vue";

export default {
  title: "Components/Divider",
  component: Divider,
  parameters: {
    docs: {
      description: {
        component: "Divider component for visual separation between content",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
  args: {
    orientation: "horizontal",
  },
} as Meta<typeof Divider>;

export const Default: StoryObj<typeof Divider> = {};

export const Vertical: StoryObj<typeof Divider> = {
  args: { orientation: "vertical" },
  render: (args) => ({
    components: { Divider },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; align-items: center; gap: 1rem; height: 100px;">
        <div>Content on left</div>
        <Divider v-bind="args" />
        <div>Content on right</div>
      </div>
    `,
  }),
};

export const Orientations: StoryObj<typeof Divider> = {
  render: () => ({
    components: { Divider },
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h3 style="margin-top: 0;">Horizontal (default)</h3>
          <p>Content above</p>
          <Divider />
          <p>Content below</p>
        </div>

        <div>
          <h3 style="margin-top: 0;">Vertical</h3>
          <div style="display: flex; align-items: center; gap: 1rem; height: 80px;">
            <div>Left content</div>
            <Divider orientation="vertical" />
            <div>Right content</div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const MultipleHorizontal: StoryObj<typeof Divider> = {
  render: () => ({
    components: { Divider },
    template: `
      <div>
        <h3 style="margin-top: 0;">Section 1</h3>
        <p>Some content in the first section</p>
        <Divider />

        <h3>Section 2</h3>
        <p>Some content in the second section</p>
        <Divider />

        <h3>Section 3</h3>
        <p>Some content in the third section</p>
      </div>
    `,
  }),
};
