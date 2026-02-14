import { type Meta, type StoryObj } from "@storybook/vue3-vite";

import Button from "../components/Button.vue";
import Input from "../components/Input.vue";
import Tooltip from "../components/Tooltip.vue";

export default {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Tooltip that wraps content and shows a title on hover. Uses CSS Anchor Positioning for placement.",
      },
    },
  },
  decorators: [() => ({ template: '<div style="padding: 80px;"><story /></div>' })],
  argTypes: {
    title: {
      control: "text",
    },
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    withArrow: {
      control: "boolean",
    },
    showOnFocus: {
      control: "boolean",
    },
    delay: {
      control: "number",
    },
    offset: {
      control: "number",
    },
  },
  args: {
    title: "Tooltip title",
    placement: "top",
  },
} as Meta<typeof Tooltip>;

export const Default: StoryObj<typeof Tooltip> = {
  render: (args) => ({
    components: { Tooltip, Button },
    setup: () => ({ args }),
    template: `
      <Tooltip v-bind="args">
        <Button label="Hover me" variant="secondary" />
      </Tooltip>
    `,
  }),
};

export const Placements: StoryObj<typeof Tooltip> = {
  render: (args) => ({
    components: { Tooltip, Button },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px; align-items: center;">
        <Tooltip v-bind="args" placement="top" title="Top tooltip">
          <Button label="Top" variant="secondary" />
        </Tooltip>

        <Tooltip v-bind="args" placement="bottom" title="Bottom tooltip">
          <Button label="Bottom" variant="secondary" />
        </Tooltip>

        <Tooltip v-bind="args" placement="right" title="Right tooltip">
          <Button label="Right" variant="secondary" />
        </Tooltip>

        <Tooltip v-bind="args" placement="left" title="Left tooltip">
          <Button label="Left" variant="secondary" />
        </Tooltip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Demonstrates the four placement options: top, bottom, left, and right.",
      },
    },
  },
};

export const WithArrow: StoryObj<typeof Tooltip> = {
  render: (args) => ({
    components: { Tooltip, Button },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px; align-items: center;">
        <Tooltip v-bind="args" placement="top" title="Top" withArrow>
          <Button label="Top" variant="secondary" />
        </Tooltip>

        <Tooltip v-bind="args" placement="bottom" title="Bottom" withArrow>
          <Button label="Bottom" variant="secondary" />
        </Tooltip>

        <Tooltip v-bind="args" placement="left" title="Left" withArrow>
          <Button label="Left" variant="secondary" />
        </Tooltip>

        <Tooltip v-bind="args" placement="right" title="Right" withArrow>
          <Button label="Right" variant="secondary" />
        </Tooltip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Tooltips with arrow indicator pointing towards the trigger element.",
      },
    },
  },
};

export const WithDelay: StoryObj<typeof Tooltip> = {
  args: {
    title: "Delayed tooltip (500ms)",
    delay: 500,
  },
  render: (args) => ({
    components: { Tooltip, Button },
    setup: () => ({ args }),
    template: `
      <Tooltip v-bind="args">
        <Button label="Hover and wait" variant="secondary" />
      </Tooltip>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Tooltip with a 500ms delay before appearing. Moving the mouse away before the delay cancels the tooltip.",
      },
    },
  },
};

export const WithOffset: StoryObj<typeof Tooltip> = {
  render: (args) => ({
    components: { Tooltip, Button },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 48px; align-items: center;">
        <Tooltip v-bind="args" title="Default gap (4px)">
          <Button label="Default" variant="secondary" />
        </Tooltip>

        <Tooltip v-bind="args" title="12px offset" :offset="12">
          <Button label="Offset 12" variant="secondary" />
        </Tooltip>

        <Tooltip v-bind="args" title="24px offset" :offset="24" withArrow>
          <Button label="Offset 24" variant="secondary" />
        </Tooltip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Custom offset (in pixels) to adjust the gap between the trigger and the tooltip.",
      },
    },
  },
};

export const ShowOnFocus: StoryObj<typeof Tooltip> = {
  render: (args) => ({
    components: { Tooltip, Input },
    setup: () => ({ args }),
    template: `
      <Tooltip v-bind="args" title="Please enter your email address" showOnFocus>
        <Input placeholder="Focus me" />
      </Tooltip>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Tooltip that also appears when the trigger element receives focus. Useful for accessibility and form hints.",
      },
    },
  },
};

export const CustomTitle: StoryObj<typeof Tooltip> = {
  render: (args) => ({
    components: { Tooltip, Button },
    setup: () => ({ args }),
    template: `
      <Tooltip v-bind="args" withArrow>
        <template #title>
          <strong>Rich</strong> tooltip content
        </template>
        <Button label="Custom title" variant="secondary" />
      </Tooltip>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Tooltip with custom rich content via the #title slot.",
      },
    },
  },
};
