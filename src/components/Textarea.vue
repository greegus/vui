<template>
  <textarea class="Textarea vuiii-input" v-bind="normalizedAttrs" />
</template>

<script lang="ts">
import '../assets/css/input.css'

import { defineComponent } from 'vue'

import { transformInputAttrs } from '../utils/transformInputAttrs'

export default defineComponent({
  mixins: [transformInputAttrs],

  props: {
    modelValue: {
      type: String,
      default: ''
    }
  }
})
</script>
