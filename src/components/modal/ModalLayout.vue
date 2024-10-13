<template>
  <div
    ref="root"
    class="ModalLayout"
    :class="{ hasHeader, hasFooter, isScrollable: $props.scroll, isPlain: $props.plain }"
    :style="computedStyle"
  >
    <div v-if="!$props.hideCloseButton" class="ModalLayout__close" @click="close()">
      <Icon name="x" class="ModalLayout__closeIcon" />
    </div>

    <div v-if="hasHeader" class="ModalLayout__header">
      <slot name="header">
        <div class="ModalLayout__title">
          {{ $props.title }}
        </div>
      </slot>
    </div>

    <div class="ModalLayout__body">
      <slot>
        <div class="ModalLayout__content">
          {{ $props.content }}
        </div>
      </slot>
    </div>

    <div v-if="hasFooter" class="ModalLayout__footer">
      <slot name="footer">
        <div class="ModalLayout__buttons">
          <span v-for="(button, $index) in $props.buttons" :key="$index" class="ModalLayout__buttonWrapper">
            <Button
              type="button"
              :label="button.label"
              :variant="button.variant"
              :prefix-icon="button.icon"
              :disabled="button.disabled"
              :loading="button.loading"
              @click="close(button.value)"
            />
          </span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, type CSSProperties, onMounted, ref, useSlots } from 'vue'

import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import { useCloseModal } from '@/modal'
import type { ModalLayoutButton } from '@/types'

const slots = useSlots()

const close = useCloseModal()

const root = ref<HTMLElement>()

const props = withDefaults(
  defineProps<{
    title?: string
    content?: string
    width?: number | string
    hideCloseButton?: boolean
    scroll?: boolean
    plain?: boolean
    buttons?: ModalLayoutButton[]
  }>(),
  {
    title: '',
    content: '',
    width: 600,
    buttons: () => []
  }
)

defineSlots<{
  header: void
  default: void
  footer: void
}>()

const hasHeader = computed<boolean>(() => {
  return Boolean(slots.header || props.title)
})

const hasFooter = computed<boolean>(() => {
  return Boolean(slots.footer) || Boolean(props.buttons?.length)
})

const computedStyle = computed<Partial<CSSProperties>>(() => {
  const maxWidth = props.width + (Number(props.width) ? 'px' : '')

  if (maxWidth && maxWidth !== 'auto') {
    return {
      width: '100%',
      maxWidth
    }
  }

  return {}
})

onMounted(() => {
  const inputs = root.value?.querySelectorAll('input')

  if (inputs?.length) {
    inputs[0].focus()
    return
  }

  const buttons = root.value?.querySelectorAll('button')

  if (buttons?.length) {
    const primaryButton = Array.from(buttons).find((button) => button.classList.contains('vuiii-button--primary'))

    if (primaryButton) {
      primaryButton.focus()
      return
    }

    buttons[0].focus()
  }
})
</script>

<style lang="postcss" scoped>
.ModalLayout {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: auto;
  min-height: fit-content;

  color: var(--vuiii-modal-textColor);
  background-color: var(--vuiii-modal-bgColor);
  border: var(--vuiii-modal-borderWidth) solid var(--vuiii-modal-borderColor);
  border-radius: var(--vuiii-modal-borderRadius);
  box-shadow: var(--vuiii-modal-boxShadow);

  &.isScrollable {
    min-height: auto;
    max-height: calc(100vh - 3rem);
  }
}

.ModalLayout__header {
  flex: 0 0 auto;
  padding: var(--vuiii-modal-padding);
  padding-right: calc(var(--vuiii-modal-closeButton-size) + var(--vuiii-modal-padding) * 2);

  & .ModalLayout.isPlain {
    padding: 0;
  }
}

.ModalLayout__title {
  font-family: var(--vuiii-modal-title-fontFamily);
  font-size: var(--vuiii-modal-title-fontSize);
  font-weight: var(--vuiii-modal-title-fontWeight);
}

.ModalLayout__close {
  position: absolute;
  z-index: 1;
  top: var(--vuiii-modal-closeButton-top);
  right: var(--vuiii-modal-closeButton-right);

  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--vuiii-modal-padding);

  opacity: 0.4;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
}

.ModalLayout__closeIcon {
  width: var(--vuiii-modal-closeButton-size);
  height: var(--vuiii-modal-closeButton-size);
}

.ModalLayout__body {
  flex: 1 0 auto;
  padding: var(--vuiii-modal-padding);
  border-radius: 4px;
}

.ModalLayout__content {
  padding-right: calc(var(--vuiii-modal-closeButton-size) + var(--vuiii-modal-padding));

  &:not(:empty) {
    min-height: var(--vuiii-modal-closeButton-size);
  }
}

.ModalLayout.hasHeader .ModalLayout__body {
  padding-top: 0;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
}

.ModalLayout.hasFooter .ModalLayout__body {
  padding-bottom: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.ModalLayout.isScrollable .ModalLayout__body {
  flex: 1 1 auto;
  overflow: auto;
  padding: 1.5rem;

  overscroll-behavior: contain;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.ModalLayout.isScrollable.hasHeader .ModalLayout__body {
  border-top: var(--vuii--modal-dividerWidth) solid var(--vuii--modal-dividerColor);
}

.ModalLayout.isScrollable.hasFooter .ModalLayout__body {
  border-bottom: var(--vuii--modal-dividerWidth) solid var(--vuii--modal-dividerColor);
}

.ModalLayout.isPlain .ModalLayout__body {
  padding: 0;
}

.ModalLayout__footer {
  flex: 0 0 auto;
  padding: var(--vuiii-modal-padding);
}

.ModalLayout.isPlain .ModalLayout__footer {
  padding: 0;
}

.ModalLayout__buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  & > * + * {
    margin-left: 0.5rem;
  }
}

.ModalLayout__message--offset {
  padding-right: 2.5rem;
}
</style>
