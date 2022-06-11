<template>
  <div
    class="ModalLayout"
    :class="{ hasHeader, hasFooter, isScrollable: $props.scroll, isPlain: $props.plain }"
    :style="computedStyle"
  >
    <div v-if="!hideCloser" class="ModalLayout__close" @click="close()">
      <Icon name="x" class="ModalLayout__closeIcon" />
    </div>

    <div v-if="hasHeader" class="ModalLayout__header">
      <slot name="header">
        <div class="ModalLayout__title">
          {{ title }}
        </div>
      </slot>
    </div>

    <div class="ModalLayout__body">
      <slot />
    </div>

    <div v-if="hasFooter" class="ModalLayout__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, CSSProperties, getCurrentInstance, getCurrentScope, useAttrs, useSlots } from 'vue'

import Icon from '../Icon.vue'

const slots = useSlots()
const attrs = useAttrs()

const props = defineProps({
  title: {
    type: String,
    default: ''
  },

  width: {
    type: [Number, String],
    default: 600
  },

  hideCloser: Boolean,

  scroll: Boolean,

  plain: Boolean
})

const hasHeader = computed<boolean>(() => {
  return Boolean(slots.header || props.title)
})

const hasFooter = computed<boolean>(() => {
  return Boolean(slots.footer)
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

function close() {
  window.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Escape' }))
}
</script>

<style lang="postcss">
.ModalLayout {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: auto;
  min-height: fit-content;

  background-color: white;
  border-radius: 4px;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &.isScrollable {
    min-height: auto;
    max-height: calc(100vh - 3rem);
  }
}

.ModalLayout__header {
  flex: 0 0 auto;
  padding: 1.25rem 4rem 1.25rem 1.5rem;

  & .ModalLayout.isPlain {
    padding: 0;
  }
}

.ModalLayout__title {
  font-size: larger;
}

.ModalLayout__close {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 4rem;
  height: 4.3rem;

  font-size: 1.85rem;
  opacity: 0.4;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
}

.ModalLayout__closeIcon {
  width: 1.5rem;
  height: 1.5rem;
}

.ModalLayout__body {
  flex: 1 0 auto;
  padding: 1.5rem;
  border-radius: 4px;
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
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.ModalLayout.isScrollable.hasFooter .ModalLayout__body {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.ModalLayout.isPlain .ModalLayout__body {
  padding: 0;
}

.ModalLayout__footer {
  flex: 0 0 auto;
  padding: 1.25rem 1.5rem;
}

.ModalLayout.isPlain .ModalLayout__footer {
  padding: 0;
}
</style>
