import { type Meta, StoryObj } from "@storybook/vue3-vite";

import ShortcutIcon from "../components/ShortcutIcon.vue";

export default {
  title: "Components/ShortcutIcon",
  component: ShortcutIcon,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Renders a keyboard shortcut as styled keycap badges. Handles cross-platform differences — uses ⌘/⌥ icons on macOS and Ctrl/Alt text on Windows/Linux.",
      },
    },
  },
  argTypes: {
    shortcut: {
      control: { type: "object" },
    },
  },
  args: {
    shortcut: { key: "k", mod: true },
  },
} as Meta<typeof ShortcutIcon>;

export const Default: StoryObj<typeof ShortcutIcon> = {};

export const ModifierKey: StoryObj<typeof ShortcutIcon> = {
  args: { shortcut: { key: "k", mod: true } },
  parameters: {
    docs: {
      description: {
        story: "Mod resolves to ⌘ (Command) on macOS and Ctrl on Windows/Linux.",
      },
    },
  },
};

export const ShiftModifier: StoryObj<typeof ShortcutIcon> = {
  args: { shortcut: { key: "s", mod: true, shift: true } },
};

export const AltModifier: StoryObj<typeof ShortcutIcon> = {
  args: { shortcut: { key: "p", alt: true } },
  parameters: {
    docs: {
      description: {
        story: "Alt renders as the Lucide Option icon (⌥) on macOS and Alt text on Windows/Linux.",
      },
    },
  },
};

export const AllModifiers: StoryObj<typeof ShortcutIcon> = {
  args: { shortcut: { key: "z", ctrl: true, alt: true, shift: true, mod: true } },
  parameters: {
    docs: {
      description: {
        story: "All modifier keys combined. Order follows platform convention: Ctrl → Alt → Shift → Mod → Key.",
      },
    },
  },
};

export const SingleKey: StoryObj<typeof ShortcutIcon> = {
  args: { shortcut: { key: "Esc" } },
  parameters: {
    docs: {
      description: {
        story: "A standalone key without modifiers. Multi-character key names are displayed as-is.",
      },
    },
  },
};

export const Examples: StoryObj<typeof ShortcutIcon> = {
  render: () => ({
    components: { ShortcutIcon },
    setup: () => ({
      shortcuts: [
        { label: "Save", shortcut: { key: "s", mod: true } },
        { label: "Save As", shortcut: { key: "s", mod: true, shift: true } },
        { label: "Find", shortcut: { key: "f", mod: true } },
        { label: "Undo", shortcut: { key: "z", mod: true } },
        { label: "Redo", shortcut: { key: "z", mod: true, shift: true } },
        { label: "Copy", shortcut: { key: "c", mod: true } },
        { label: "Paste", shortcut: { key: "v", mod: true } },
        { label: "Select All", shortcut: { key: "a", mod: true } },
        { label: "Quick Open", shortcut: { key: "p", mod: true } },
        { label: "Command Palette", shortcut: { key: "p", mod: true, shift: true } },
        { label: "Toggle Sidebar", shortcut: { key: "b", mod: true } },
        { label: "Preferences", shortcut: { key: ",", mod: true } },
        { label: "Escape", shortcut: { key: "Esc" } },
        { label: "Delete", shortcut: { key: "Delete" } },
        { label: "Alt + Click", shortcut: { key: "Click", alt: true } },
        { label: "Enter", shortcut: { key: "Enter" } },
      ],
    }),
    template: `
      <div style="display: flex; flex-flow: column; gap: 0.75rem;">
        <div v-for="item in shortcuts" :key="item.label" style="display: flex; align-items: center; gap: 1rem; min-width: 300px;">
          <span style="flex: 1; text-align: right; font-size: 14px; color: #666;">{{ item.label }}</span>
          <ShortcutIcon :shortcut="item.shortcut" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "Common keyboard shortcuts as they would appear in a menu or command palette.",
      },
    },
  },
};
