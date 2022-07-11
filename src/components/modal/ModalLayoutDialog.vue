<template>
  <ModalLayout class="ModalLayoutDialog" width="480" :title="title">
    <div class="ModalLayoutDialog__message" :class="{ 'ModalLayoutDialog__message--offset': !title }">
      {{ message }}
    </div>

    <template v-if="buttons?.length" #footer>
      <div class="ModalLayoutDialog__buttons">
        <span v-for="(button, $index) in buttons" :key="$index" class="ModalLayoutDialog__buttonWrapper">
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

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { ButtonOptions } from '../../modal'
import Button from '../Button.vue'
import ModalLayout from './ModalLayout.vue'

export default defineComponent({
  components: {
    ModalLayout,
    Button
  },

  props: {
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
  },

  emits: ['close']
})
</script>

<style lang="postcss" scoped>
.ModalLayoutDialog__buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1rem;

  & > * + * {
    margin-left: 0.5rem;
  }
}

.ModalLayoutDialog__message--offset {
  padding-right: 2.5rem;
}
</style>
