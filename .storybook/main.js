import { resolve, dirname } from 'path'
import { mergeConfig } from 'vite'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': resolve(__dirname, '../src')
        }
      }
    })
  }
};
