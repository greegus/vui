<template>
  <ModalLayout ref="root" class="ModalLayoutDialog" width="480" :title="$props.title">
    {{ $props.message }}

    <template v-if="$props.buttons?.length" #footer>
      <div class="ModalLayoutDialog__buttons">
        <span v-for="(button, $index) in $props.buttons" :key="$index" class="ModalLayoutDialog__buttonWrapper">
          <Button
            type="button"
            :variant="button.variant"
            :prefix-icon="button.icon"
            autofocus
            @click="$emit('close', button.value)"
          >
            {{ button.label }}
          </Button>
        </span>
      </div>
    </template>
  </ModalLayout>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

import { ButtonOptions } from '../../modal'
import Button from '../Button.vue'
import ModalLayout from './ModalLayout.vue'

defineEmits(['close'])

const props = defineProps({
  title: {
    type: String,
    default: ''
  },

  message: {
    type: String,
    default: ''
  },

  buttons: {
    type: Array as PropType<ButtonOptions[]>,
    default: () => []
  }
})
</script>

<style lang="postcss">
.ModalLayoutDialog__buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1rem;

  & > * + * {
    margin-left: 0.5rem;
  }
}
</style>
