import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

// Import vuiii styles
import '../../../src/assets/css/style.css'
// Custom components
import ComponentDemo from './components/ComponentDemo.vue'
import DesignToken from './components/DesignToken.vue'
import RouterLinkStub from './components/RouterLinkStub.vue'

// Custom styles
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register global components for use in markdown
    app.component('ComponentDemo', ComponentDemo)
    app.component('DesignToken', DesignToken)
    // Lets the router-aware components render in demos — see RouterLinkStub
    app.component('RouterLink', RouterLinkStub)
  },
} satisfies Theme
