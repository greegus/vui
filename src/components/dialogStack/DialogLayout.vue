<template>
  <div
    ref="root"
    class="DialogLayout"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="hasHeader ? titleId : undefined"
    :class="{
      hasHeader,
      hasFooter,
      isScrollable: $props.scroll,
      isPlain: $props.plain,
      isWithCloseButton: $props.withCloseButton,
    }"
    :style="computedStyle"
  >
    <button v-if="$props.withCloseButton" type="button" class="DialogLayout__close" aria-label="Close" @click="close()">
      <Icon name="x" class="DialogLayout__closeIcon" />
    </button>

    <div v-if="hasHeader" class="DialogLayout__header">
      <slot name="header">
        <div :id="titleId" class="DialogLayout__title">
          {{ $props.title }}
        </div>
      </slot>
    </div>

    <div class="DialogLayout__body">
      <slot>
        <div class="DialogLayout__content">
          {{ $props.content }}
        </div>
      </slot>
    </div>

    <div v-if="hasFooter" class="DialogLayout__footer">
      <slot name="footer">
        <div class="DialogLayout__buttons">
          <span v-for="(button, $index) in $props.buttons" :key="$index" class="DialogLayout__buttonWrapper">
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
import { computed, type CSSProperties, onMounted, ref, useId, useSlots } from "vue";

import Button from "@/components/Button.vue";
import Icon from "@/components/Icon.vue";
import { useCloseDialog } from "@/dialogStack";
import type { DialogLayoutButton } from "@/types";

const slots = useSlots();

const close = useCloseDialog();

const titleId = `dialog-title-${useId()}`;

const root = ref<HTMLElement>();

const props = withDefaults(
  defineProps<{
    title?: string;
    content?: string;
    width?: number | string;
    withCloseButton?: boolean;
    scroll?: boolean;
    plain?: boolean;
    buttons?: DialogLayoutButton[];
  }>(),
  {
    title: "",
    content: "",
    width: 600,
    buttons: () => [],
  },
);

defineSlots<{
  header?: void;
  default?: void;
  footer?: void;
}>();

const hasHeader = computed<boolean>(() => {
  return Boolean(slots.header || props.title);
});

const hasFooter = computed<boolean>(() => {
  return Boolean(slots.footer) || Boolean(props.buttons?.length);
});

const computedStyle = computed<Partial<CSSProperties>>(() => {
  const maxWidth = props.width + (Number(props.width) ? "px" : "");

  if (maxWidth && maxWidth !== "auto") {
    return {
      width: "100%",
      maxWidth,
    };
  }

  return {};
});

onMounted(() => {
  // TODO fix focus management
  const inputs = root.value?.querySelectorAll("input");

  if (inputs?.length) {
    inputs[0]?.focus();
    return;
  }

  const buttons = root.value?.querySelectorAll("button");

  if (buttons?.length) {
    const primaryButton = Array.from(buttons).find((button) => button.classList.contains("vuiii-button--primary"));

    if (primaryButton) {
      primaryButton.focus();
      return;
    }

    buttons[0]?.focus();
  }
});
</script>

<style scoped>
.DialogLayout {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: auto;
  min-height: fit-content;

  color: var(--vuiii-dialog-textColor);
  background-color: var(--vuiii-dialog-bgColor);
  border: var(--vuiii-dialog-borderWidth) solid var(--vuiii-dialog-borderColor);
  border-radius: var(--vuiii-dialog-borderRadius);
  box-shadow: var(--vuiii-dialog-boxShadow);

  &.isScrollable {
    min-height: auto;
    max-height: calc(100vh - 3rem);
  }
}

.DialogLayout__header {
  flex: 0 0 auto;
  padding: var(--vuiii-dialog-padding);
}

.DialogLayout.isPlain .DialogLayout__header {
  padding: 0;
}

.DialogLayout.isWithCloseButton .DialogLayout__header {
  padding-right: calc(var(--vuiii-dialog-closeButton-size) + var(--vuiii-dialog-padding) * 2);
}

.DialogLayout__title {
  font-family: var(--vuiii-dialog-title-fontFamily);
  font-size: var(--vuiii-dialog-title-fontSize);
  font-weight: var(--vuiii-dialog-title-fontWeight);
}

.DialogLayout__close {
  all: unset;
  position: absolute;
  z-index: 1;
  top: var(--vuiii-dialog-closeButton-top);
  right: var(--vuiii-dialog-closeButton-right);

  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--vuiii-dialog-padding);

  opacity: 0.4;
  color: inherit;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
}

.DialogLayout__closeIcon {
  width: var(--vuiii-dialog-closeButton-size);
  height: var(--vuiii-dialog-closeButton-size);
}

.DialogLayout__body {
  flex: 1 0 auto;
  padding: var(--vuiii-dialog-padding);
  border-radius: 4px;
}

.DialogLayout__content {
  &:not(:empty) {
    min-height: var(--vuiii-dialog-closeButton-size);
  }
}

.DialogLayout.isWithCloseButton .DialogLayout__content {
  padding-right: calc(var(--vuiii-dialog-closeButton-size) + var(--vuiii-dialog-padding));
}

.DialogLayout.hasHeader .DialogLayout__body {
  padding-top: 0;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
}

.DialogLayout.hasFooter .DialogLayout__body {
  padding-bottom: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.DialogLayout.isScrollable .DialogLayout__body {
  flex: 1 1 auto;
  overflow: auto;

  overscroll-behavior: contain;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.DialogLayout.isScrollable.hasHeader .DialogLayout__body {
  border-top: var(--vuiii-dialog-dividerWidth) var(--vuiii-dialog-dividerStyle) var(--vuiii-dialog-dividerColor);
}

.DialogLayout.isScrollable.hasFooter .DialogLayout__body {
  border-bottom: var(--vuiii-dialog-dividerWidth) var(--vuiii-dialog-dividerStyle) var(--vuiii-dialog-dividerColor);
}

.DialogLayout.isPlain .DialogLayout__body {
  padding: 0;
}

.DialogLayout__footer {
  flex: 0 0 auto;
  padding: var(--vuiii-dialog-padding);
}

.DialogLayout.isPlain .DialogLayout__footer {
  padding: 0;
}

.DialogLayout__buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  & > * + * {
    margin-left: 0.5rem;
  }
}

.DialogLayout__message--offset {
  padding-right: 2.5rem;
}
</style>
