import { defineComponent } from 'vue'

import { retrieveInputValue } from './retrieveInputValue'

export const transformInputAttrs = defineComponent({
  emits: ['update:modelValue'],

  computed: {
    normalizedAttrs(): any {
      const { class: _class, ...attrs } = this.$attrs

      return {
        ...attrs,
        onInput: (e: KeyboardEvent) => this.$emit('update:modelValue', retrieveInputValue(e))
      }
    }
  }
})
