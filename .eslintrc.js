module.exports = {
  env: {
    browser: true,
    es6: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  extends: ['plugin:vue/vue3-recommended', 'plugin:prettier/recommended', 'prettier'],
  plugins: ['vue', 'prettier', 'simple-import-sort'],
  rules: {
    'import/order': 'off',
    'sort-imports': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'vue/multi-word-component-names': 'off',
    'vue/no-reserved-component-names': 'off'
  }
}
