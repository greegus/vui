export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: ['Introduction', 'Example', 'Guides'],
    },
  },
  backgrounds: {
    options: {
      light: { name: 'Light', value: '#ffffff' },
      gray: { name: 'Gray', value: 'oklch(97.02% 0 0)' },
      dark: { name: 'Dark', value: '#1a1a1a' },
    },
  },
}

export const initialGlobals = {
  backgrounds: { value: 'light' },
}

export const tags = ['autodocs']
