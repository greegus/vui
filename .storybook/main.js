// This file has been automatically migrated to valid ESM format by Storybook.
import { resolve } from 'path'

import { mergeConfig } from 'vite'

export default {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs', '@chromatic-com/storybook'],

  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },

  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': resolve(import.meta.dirname, '../src'),
        },
      },
      // Set base path for production builds when STORYBOOK_BASE_PATH is defined
      ...(configType === 'PRODUCTION' && process.env.STORYBOOK_BASE_PATH
        ? { base: process.env.STORYBOOK_BASE_PATH }
        : {}),
    })
  },
}
