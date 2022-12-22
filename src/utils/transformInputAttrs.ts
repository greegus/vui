import { defineComponent } from 'vue'

import { retrieveInputValue } from './retrieveInputValue'

export const transformInputAttrs = defineComponent({
  emits: ['update:model-value'],

  computed: {
    normalizedAttrs(): any {
      const { class: _class, ...attrs } = this.$attrs

      return {
        ...attrs,
        onInput: (e: KeyboardEvent) => this.$emit('update:model-value', retrieveInputValue(e))
      }
    }
  }
})
