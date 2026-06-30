<template>
  <div class="Card" :class="{ 'Card--hasHeader': hasHeader }">
    <div v-if="hasHeader" class="Card__header">
      <div class="Card__headerMain">
        <slot name="header">
          <div class="Card__title">
            <slot name="title">{{ $props.title }}</slot>
          </div>
        </slot>
      </div>

      <div v-if="$slots.tools" class="Card__tools">
        <slot name="tools" />
      </div>
    </div>

    <div class="Card__body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * Simple content container with an optional header (title + tools) and a body.
 * Shares its padding and border-radius tokens with Dialog (`--vuiii-card-*`).
 *
 * @component Card
 *
 * @example
 * // Basic usage
 * import { Card } from 'vuiii'
 *
 * <Card title="Profile">
 *   Card body content
 * </Card>
 *
 * @example
 * // With header tools (rendered on the right)
 * <Card title="Members">
 *   <template #tools>
 *     <IconButton icon="plus" @click="add()" />
 *   </template>
 *   ...
 * </Card>
 *
 * @example
 * // Custom title / full header
 * <Card>
 *   <template #title><Icon name="star" /> Featured</template>
 *   ...
 * </Card>
 *
 * @example
 * // Outlined card (override the transparent default border)
 * <Card title="Outlined" style="--vuiii-card-borderColor: var(--vuiii-divider-color)">
 *   ...
 * </Card>
 *
 * @slot default - Card body content
 * @slot header - Overrides the whole header-left region (default renders the title)
 * @slot title - Overrides just the title text (default is the `title` prop)
 * @slot tools - Content rendered on the right side of the header
 */
import { computed, useSlots } from 'vue'

const props = defineProps<{
  title?: string
}>()

defineSlots<{
  default?: () => any
  header?: () => any
  title?: () => any
  tools?: () => any
}>()

const slots = useSlots()

const hasHeader = computed<boolean>(() => Boolean(props.title || slots.header || slots.title || slots.tools))
</script>

<style scoped>
.Card {
  background-color: var(--vuiii-card-bgColor);
  color: var(--vuiii-card-textColor);
  border: var(--vuiii-card-borderWidth) solid var(--vuiii-card-borderColor);
  border-radius: var(--vuiii-card-borderRadius);
}

.Card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: var(--vuiii-card-padding);
}

.Card__title {
  font-family: var(--vuiii-card-title-fontFamily);
  font-size: var(--vuiii-card-title-fontSize);
  font-weight: var(--vuiii-card-title-fontWeight);
}

.Card__tools {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: none;
}

.Card__body {
  padding: var(--vuiii-card-padding);
}

.Card--hasHeader .Card__body {
  padding-top: 0;
}
</style>
