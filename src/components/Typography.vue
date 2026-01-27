<template>
  <component
    :is="resolvedTag"
    class="Typograpgy"
    :class="{
      'vuiii-typography-display': variant === 'display',
      'vuiii-typography-heading1': variant === 'heading1',
      'vuiii-typography-heading2': variant === 'heading2',
      'vuiii-typography-heading3': variant === 'heading3',
      'vuiii-typography-heading4': variant === 'heading4',
      'vuiii-typography-heading5': variant === 'heading5',
      'vuiii-typography-heading6': variant === 'heading6',
      'vuiii-typography-body1': variant === 'body1',
      'vuiii-typography-body2': variant === 'body2',
      'vuiii-typography-caption': variant === 'caption',
      'vuiii-typography-label': variant === 'label',
    }"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
/**
 * Typography component for consistent text styling.
 * Automatically selects appropriate HTML tag based on variant.
 *
 * @component Typography
 *
 * @example
 * // Different variants
 * import { Typography } from 'vuiii'
 *
 * <Typography variant="display">Display Text</Typography>
 * <Typography variant="heading1">Heading 1</Typography>
 * <Typography variant="heading2">Heading 2</Typography>
 * <Typography variant="body1">Body text paragraph</Typography>
 * <Typography variant="caption">Small caption text</Typography>
 * <Typography variant="label">Form label</Typography>
 *
 * @example
 * // Automatic tag selection
 * <Typography variant="heading1">Renders as h1</Typography>
 * <Typography variant="body1">Renders as p</Typography>
 * <Typography variant="label">Renders as span</Typography>
 *
 * @example
 * // Override the HTML tag
 * <Typography variant="heading1" tag="h2">
 *   Styled as heading1, but renders as h2
 * </Typography>
 *
 * @example
 * // Available variants and their default tags:
 * // display -> h1
 * // heading1 -> h1
 * // heading2 -> h2
 * // heading3 -> h3
 * // heading4 -> h4
 * // heading5 -> h5
 * // heading6 -> h6
 * // body1 -> p
 * // body2 -> p
 * // label -> span
 * // caption -> span
 */
import { computed } from "vue";

const { variant = "body1", tag } = defineProps<{
  variant?:
    | "display"
    | "heading1"
    | "heading2"
    | "heading3"
    | "heading4"
    | "heading5"
    | "heading6"
    | "body1"
    | "body2"
    | "label"
    | "caption";
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "caption";
}>();

const resolvedTag = computed(() => {
  const variantToTagMap = {
    display: "h1",
    heading1: "h1",
    heading2: "h2",
    heading3: "h3",
    heading4: "h4",
    heading5: "h5",
    heading6: "h6",
    body1: "p",
    body2: "p",
    label: "span",
    caption: "span",
  };

  return tag || (variant && variantToTagMap[variant]) || "p";
});
</script>
