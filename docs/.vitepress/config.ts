import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'VUIII',
  description: 'Vue 3 Component Library with TypeScript Support',

  base: '/vuiii/',

  head: [['link', { rel: 'icon', href: '/vuiii/favicon.ico' }]],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/getting-started/' },
      { text: 'Components', link: '/components/' },
      { text: 'Composables', link: '/composables/' },
      { text: 'Design Tokens', link: '/design-tokens/' },
      {
        text: 'Storybook',
        link: 'https://greegus.github.io/vuiii/storybook/',
        target: '_blank',
      },
    ],

    sidebar: {
      '/getting-started/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Installation', link: '/getting-started/' },
            { text: 'Configuration', link: '/getting-started/configuration' },
            { text: 'Theming', link: '/getting-started/theming' },
            { text: 'Composing Forms', link: '/getting-started/composing-forms' },
            { text: 'Option Extractors', link: '/getting-started/option-extractors' },
          ],
        },
      ],
      '/components/': [
        {
          text: 'Overview',
          items: [{ text: 'All Components', link: '/components/' }],
        },
        {
          text: 'Form Inputs',
          items: [
            { text: 'Input', link: '/components/input' },
            { text: 'InputWrapper', link: '/components/input-wrapper' },
            { text: 'Textarea', link: '/components/textarea' },
            { text: 'Select', link: '/components/select' },
            { text: 'Autocomplete', link: '/components/autocomplete' },
            { text: 'Checkbox', link: '/components/checkbox' },
            { text: 'CheckboxGroup', link: '/components/checkbox-group' },
            { text: 'RadioGroup', link: '/components/radio-group' },
            { text: 'RadioButtonGroup', link: '/components/radio-button-group' },
            { text: 'FilePicker', link: '/components/file-picker' },
          ],
        },
        {
          text: 'Buttons',
          items: [
            { text: 'Button', link: '/components/button' },
            { text: 'IconButton', link: '/components/icon-button' },
            { text: 'ButtonGroup', link: '/components/button-group' },
          ],
        },
        {
          text: 'Forms & Layout',
          items: [
            { text: 'Card', link: '/components/card' },
            { text: 'FormFields', link: '/components/form-fields' },
            { text: 'FormGroup', link: '/components/form-group' },
            { text: 'Table', link: '/components/table' },
            { text: 'Divider', link: '/components/divider' },
            { text: 'Typography', link: '/components/typography' },
            { text: 'Breadcrumbs', link: '/components/breadcrumbs' },
          ],
        },
        {
          text: 'Navigation',
          items: [
            { text: 'Tabs', link: '/components/tabs' },
            { text: 'Tabs Nav', link: '/components/tabs-nav' },
          ],
        },
        {
          text: 'Feedback & Overlays',
          items: [
            { text: 'DialogStack', link: '/components/dialog-stack' },
            { text: 'Dropdown', link: '/components/dropdown' },
            { text: 'DropdownMenu', link: '/components/dropdown-menu' },
            { text: 'SnackbarStack', link: '/components/snackbar-stack' },
            { text: 'Tooltip', link: '/components/tooltip' },
          ],
        },
        {
          text: 'Utilities',
          items: [{ text: 'Icon', link: '/components/icon' }],
        },
      ],
      '/composables/': [
        {
          text: 'Overview',
          items: [{ text: 'All Composables', link: '/composables/' }],
        },
        {
          text: 'Data Loading',
          items: [
            { text: 'useLoadData', link: '/composables/use-load-data' },
            { text: 'useLoadPaginatedData', link: '/composables/use-load-paginated-data' },
          ],
        },
        {
          text: 'Form Actions',
          items: [
            { text: 'useSubmitAction', link: '/composables/use-submit-action' },
            { text: 'useValidation', link: '/composables/use-validation' },
          ],
        },
        {
          text: 'DOM Interactions',
          items: [
            { text: 'useOnClickOutside', link: '/composables/use-on-click-outside' },
            { text: 'useOnFocusOutside', link: '/composables/use-on-focus-outside' },
            { text: 'useOnKeyPress', link: '/composables/use-on-key-press' },
            { text: 'useCursor', link: '/composables/use-cursor' },
            { text: 'useFocusTrap', link: '/composables/use-focus-trap' },
          ],
        },
        {
          text: 'File Handling',
          items: [
            { text: 'useDropArea', link: '/composables/use-drop-area' },
            { text: 'usePreventHandlingDrop', link: '/composables/use-prevent-handling-drop' },
          ],
        },
        {
          text: 'Routing',
          items: [
            { text: 'useRouteQuery', link: '/composables/use-route-query' },
            { text: 'usePageFromRouteQuery', link: '/composables/use-page-from-route-query' },
          ],
        },
        {
          text: 'Dialogs & Notifications',
          items: [
            { text: 'useDialogStack', link: '/composables/dialog-stack' },
            { text: 'useSnackbar', link: '/composables/snackbar' },
          ],
        },
      ],
      '/design-tokens/': [
        {
          text: 'Design Tokens',
          items: [
            { text: 'Overview', link: '/design-tokens/' },
            { text: 'Colors', link: '/design-tokens/colors' },
            { text: 'Typography', link: '/design-tokens/typography' },
            { text: 'Buttons', link: '/design-tokens/buttons' },
            { text: 'Fields', link: '/design-tokens/fields' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/greegus/vuiii' }],

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright 2023-present',
    },
  },

  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../src', import.meta.url)),
      },
    },
  },
})
