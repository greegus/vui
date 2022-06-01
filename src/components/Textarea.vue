<template>
  <textarea v-bind="normalizedAttrs" class="Textarea input" :class="$attrs.class" :value="value" />
</template>

<script lang="ts">
import '../assets/css/input.css'

import { defineComponent } from 'vue'

import { transformInputAttrs } from '../utils/transformInputAttrs'

export default defineComponent({
  mixins: [transformInputAttrs],

  props: {
    value: {
      type: String,
      default: ''
    }
  }
})
</script>
