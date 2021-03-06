import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'vui'
    },

    rollupOptions: {
      external: ['vue', 'vue-router'],
      output: {
        globals: {
          'vue': 'Vue',
          'vue-router': 'VueRouter'
        }
      }
    }
  }
})
