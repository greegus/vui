import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

// Import vuiii styles
import '../../../src/assets/css/style.css'

// Custom components
import ComponentDemo from './components/ComponentDemo.vue'
import DesignToken from './components/DesignToken.vue'

// Custom styles
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register global components for use in markdown
    app.component('ComponentDemo', ComponentDemo)
    app.component('DesignToken', DesignToken)
  },
} satisfies Theme
