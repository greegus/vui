<template>
  <div
    class="Input vuiii-input"
    :class="[
      $attrs.class,
      {
        'vuiii-input--invalid': invalid,
        'vuiii-input--disabled': $attrs.disabled,
        'vuiii-input--small': size === 'small'
      }
    ]"
    @click="$refs.input.focus()"
  >
    <slot v-if="hasPrefix" name="prefix">
      <div class="Input__icon Input__icon--left">
        <Icon :name="prefixIcon" />
      </div>
    </slot>

    <input
      ref="input"
      :aria-label="$attrs.placeholder || 'input'"
      v-bind="normalizedAttrs"
      class="Input__nestedInput vuiii-input__nested"
      :value="modelValue"
    />

    <slot v-if="hasSuffix" name="suffix">
      <div class="Input__icon Input__icon--right">
        <Icon :name="suffixIcon" />
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import '../assets/css/input.css'

import { defineComponent, PropType } from 'vue'

import { transformInputAttrs } from '../utils/transformInputAttrs'
import Icon from './Icon.vue'

const sizes = ['normal', 'small'] as const

type Size = typeof sizes[number]

export default defineComponent({
  components: {
    Icon
  },

  mixins: [transformInputAttrs],

  inheritAttrs: false,

  props: {
    modelValue: {
      type: [Number, String],
      default: ''
    },

    prefixIcon: {
      type: String,
      default: ''
    },

    suffixIcon: {
      type: String,
      default: ''
    },

    size: {
      type: String as PropType<Size>,
      default: 'normal',
      validator: (value: Size) => sizes.includes(value)
    },

    invalid: Boolean
  },

  computed: {
    hasPrefix(): boolean {
      return Boolean(this.$slots.prefix || this.prefixIcon)
    },

    hasSuffix(): boolean {
      return Boolean(this.$slots.suffix || this.suffixIcon)
    }
  }
})
</script>

<style lang="postcss" scoped>
.Input.Input /* Intentional selector overload */ {
  cursor: text;
  display: flex;
  align-items: center;
  padding-left: 0;
  padding-right: 0;
  line-height: 1;
}

.Input__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  opacity: 0.35;
}

.Input__icon--right {
  margin-left: -1rem;
}

.Input__icon--left {
  margin-right: -1rem;
}

.Input__nestedInput {
  flex: auto;
  align-self: stretch;
  width: 100%;
}
</style>
