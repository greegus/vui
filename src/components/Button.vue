<template>
  <component
    :is="component"
    class="Button button"
    :class="[classModifiers, { 'Button--block': block }, { 'button--disabled': $attrs.disabled }]"
    v-bind="normalizedAttrs"
  >
    <slot name="prefix">
      <Icon
        v-if="prefixIcon && !loading"
        class="Button__icon Button__icon--prefix"
        :class="[`Button__icon--${size}`]"
        :name="prefixIcon"
      />
    </slot>

    <Icon v-if="loading" class="Button__icon Button__icon--prefix" :class="[`Button__icon--${size}`]" name="spinner" />

    <span v-if="$slots.default || label">
      <slot>{{ label }}</slot>
    </span>

    <slot name="suffix">
      <Icon
        v-if="suffixIcon"
        class="Button__icon Button__icon--suffix"
        :class="[`Button__icon--${size}`]"
        :name="suffixIcon"
      />
    </slot>
  </component>
</template>

<script lang="ts">
import '../assets/css/button.css'

import { defineComponent, PropType } from 'vue'

import Icon from './Icon.vue'

const sizes = ['normal', 'small'] as const
const variants = ['default', 'primary', 'secondary', 'danger'] as const

export type Size = typeof sizes[number]
export type Variant = typeof variants[number]

export default defineComponent({
  components: {
    Icon
  },
  inheritAttrs: false,

  props: {
    size: {
      type: String as PropType<Size>,
      default: 'normal',
      validator: (value: Size) => sizes.includes(value)
    },

    variant: {
      type: String as PropType<Variant>,
      default: 'default',
      validator: (value: Variant) => variants.includes(value)
    },

    prefixIcon: {
      type: String,
      default: ''
    },

    suffixIcon: {
      type: String,
      default: ''
    },

    label: {
      type: String,
      default: ''
    },

    active: Boolean,

    loading: Boolean,

    block: Boolean,

    disabled: Boolean
  },

  computed: {
    component(): string {
      if (this.$attrs.to) {
        return 'router-link'
      }

      if (this.$attrs.href) {
        return 'a'
      }

      return 'button'
    },

    classModifiers() {
      const classModifiers: any[] = [this.size, this.variant]

      if (this.active) {
        classModifiers.push('active')
      }

      if (this.loading) {
        classModifiers.push('loading')
      }

      if (this.disabled) {
        classModifiers.push('disabled')
      }

      return classModifiers.map((modifier) => `button--${modifier}`)
    },

    normalizedAttrs(): object {
      return {
        // Sanitize attrs so the button would have attribute `type="button"` set by default
        type: this.component === 'button' ? 'button' : undefined,
        ...this.$attrs
      }
    }
  }
})
</script>

<style lang="postcss" scoped>
.Button--block {
  width: 100%;
}

.Button__icon--small {
  width: 0.75rem;
}

.Button__icon--normal {
  width: 1.35rem;
}

.Button__icon--prefix.Button__icon--normal {
  margin-left: -0.125rem;
}

.Button__icon--suffix.Button__icon--normal {
  margin-right: -0.125rem;
}
</style>
