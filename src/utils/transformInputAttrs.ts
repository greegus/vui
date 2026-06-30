import { defineComponent } from 'vue'

import { retrieveInputValue } from './retrieveInputValue'

export const transformInputAttrs = defineComponent({
  emits: ['update:model-value'],

  computed: {
    normalizedAttrs(): Record<string, unknown> {
      const { class: _class, ...attrs } = this.$attrs

      return {
        ...attrs,
        onInput: (e: Event) => this.$emit('update:model-value', retrieveInputValue(e)),
      }
    },
  },
})
