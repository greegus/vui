const { resolve } = require('path')
const { mergeConfig } = require('vite')

module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },

  features: {
    'storyStoreV7': true
  },

  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': resolve(__dirname, '../src')
        }
      }
    })
  },

  docs: {
    autodocs: true
  }
}
