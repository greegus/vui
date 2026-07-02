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

export const globalTypes = {
  theme: {
    description: 'vuiii color theme',
    defaultValue: 'light',
    toolbar: {
      title: 'Theme',
      icon: 'contrast',
      dynamicTitle: true,
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
        { value: 'auto', title: 'Auto (OS)' },
      ],
    },
  },
}

// Apply a `vuiii-mode-*` class to the preview root so the neutral tokens flip, without wrapping the
// story (which would break `layout: 'centered'` etc.). Pick a matching canvas colour via the
// Backgrounds toolbar. `auto` follows the OS via prefers-color-scheme (opt-in via `vuiii-mode-auto`).
export const decorators = [
  (story, context) => ({
    components: { story },
    setup() {
      const theme = context.globals.theme
      const root = document.documentElement
      root.classList.remove('vuiii-mode-dark', 'vuiii-mode-light', 'vuiii-mode-auto')
      if (theme === 'dark') root.classList.add('vuiii-mode-dark')
      else if (theme === 'light') root.classList.add('vuiii-mode-light')
      else if (theme === 'auto') root.classList.add('vuiii-mode-auto')
      return {}
    },
    template: '<story />',
  }),
]

export const tags = ['autodocs']
