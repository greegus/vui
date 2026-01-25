<script lang="ts" setup>
/**
 * Icon-only button. A simplified Button wrapper for actions that only need an icon.
 *
 * @component IconButton
 *
 * @example
 * // Basic usage
 * import { IconButton } from 'vuiii'
 *
 * <IconButton icon="pencil" @click="edit()" />
 * <IconButton icon="trash" variant="danger" @click="remove()" />
 *
 * @example
 * // Different variants
 * <IconButton icon="plus" variant="primary" />
 * <IconButton icon="check" variant="secondary" />
 * <IconButton icon="x-mark" variant="danger" />
 *
 * @example
 * // Different sizes
 * <IconButton icon="cog" size="small" />
 * <IconButton icon="cog" size="normal" />
 * <IconButton icon="cog" size="large" />
 *
 * @example
 * // With title (tooltip)
 * <IconButton icon="trash" title="Delete item" @click="remove()" />
 *
 * @example
 * // Loading state
 * <IconButton icon="arrow-path" :loading="isRefreshing" @click="refresh()" />
 *
 * @emits click - When button is clicked
 */
import Button, { type ButtonProps } from "@/components/Button.vue";
import { useFilteredProps } from "@/composables/useFilteredProps";

export type IconButtonProps = Omit<ButtonProps, "prefixIcon" | "suffixIcon" | "label" | "block"> & {
  icon: string;
  title?: string;
};

const props = defineProps<IconButtonProps>();

const buttonProps = useFilteredProps(props, ["icon"]);

const emit = defineEmits<{
  click: [Event];
}>();
</script>

<template>
  <Button class="vuiii-icon-button" :prefixIcon="icon" v-bind="buttonProps" @click="emit('click', $event)" />
</template>

<style>
.vuiii-icon-button.vuiii-button {
  padding: 0.5em;

  .vuiii-button__icon {
    margin: 0;
  }
}
</style>
