import { defineComponent } from 'vue'

export const transformInputAttrs = defineComponent({
  emits: ['update:modelValue'],

  computed: {
    normalizedAttrs(): any {
      const retrieveValue = (element: HTMLInputElement) => {
        if (element.getAttribute('type') === 'number') {
          return element.valueAsNumber
        }

        if (element.getAttribute('type') === 'checkbox') {
          return element.checked
        }

        return element.value
      }

      const { class: _class, ...attrs } = this.$attrs

      return {
        ...attrs,
        onInput: (e: KeyboardEvent) => this.$emit('update:modelValue', retrieveValue(e.target as HTMLInputElement))
      }
    }
  }
})
