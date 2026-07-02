<template>
  <div
    class="Tooltip"
    :class="{ 'Tooltip--showOnFocus': showOnFocus, 'Tooltip--delayed': delayed }"
    :style="{
      '--anchor-id': anchorName,
      '--position-area': positionArea,
      '--offset': offset != null ? `${offset}px` : undefined,
      '--delay': delay != null ? `${delay}ms` : undefined,
    }"
  >
    <div class="Tooltip__trigger" :aria-describedby="hasTooltip ? tooltipId : undefined">
      <slot />
    </div>

    <div
      v-if="hasTooltip"
      :id="tooltipId"
      class="Tooltip__bubble"
      :class="[`Tooltip__bubble--${placement}`, { 'Tooltip__bubble--withArrow': withArrow }]"
      role="tooltip"
    >
      <slot name="title">{{ title }}</slot>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * Tooltip component that wraps content and shows a title on hover.
 * Uses CSS Anchor Positioning for placement relative to the trigger element.
 * Supports delay, focus trigger, arrow indicator, and custom title content via slot.
 *
 * @component Tooltip
 *
 * @example
 * // Basic usage with title prop
 * import { Tooltip } from 'vuiii'
 *
 * <Tooltip title="This is a tooltip">
 *   <Button label="Hover me" />
 * </Tooltip>
 *
 * @example
 * // With placement
 * <Tooltip title="Below the button" placement="bottom">
 *   <Button label="Hover me" />
 * </Tooltip>
 *
 * @example
 * // With arrow
 * <Tooltip title="With arrow" withArrow>
 *   <Button label="Hover me" />
 * </Tooltip>
 *
 * @example
 * // With a short default delay before showing
 * <Tooltip title="Delayed tooltip" delayed>
 *   <Button label="Hover me" />
 * </Tooltip>
 *
 * @example
 * // With a custom delay (ms) — overrides `delayed`
 * <Tooltip title="Delayed tooltip" :delay="800">
 *   <Button label="Hover me" />
 * </Tooltip>
 *
 * @example
 * // With custom title slot
 * <Tooltip>
 *   <template #title>
 *     <strong>Rich</strong> tooltip content
 *   </template>
 *   <Button label="Hover me" />
 * </Tooltip>
 *
 * @example
 * // Show on focus (for accessibility)
 * <Tooltip title="Accessible tooltip" showOnFocus>
 *   <Input placeholder="Focus me" />
 * </Tooltip>
 *
 * @slot default - The trigger content that the tooltip wraps
 * @slot title - Custom tooltip title content (alternative to title prop)
 */

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export type TooltipProps = {
  title?: string
  placement?: TooltipPlacement
  showOnFocus?: boolean
  /** Show the tooltip after a short default delay (`--vuiii-tooltip-delay`, 500ms). Overridden by `delay`. */
  delayed?: boolean
  /** Explicit delay in milliseconds before the tooltip appears. Takes precedence over `delayed`. */
  delay?: number
  withArrow?: boolean
  offset?: number
}
</script>

<script lang="ts" setup>
import { computed, useId, useSlots } from 'vue'

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
})

defineSlots<{
  default?: () => any
  title?: () => any
}>()

const slots = useSlots()

const tooltipId = useId()

const hasTooltip = computed<boolean>(() => Boolean(props.title || slots.title))

const anchorName = `--anchor-${useId()}`

const positionArea = computed(() => {
  switch (props.placement) {
    case 'top':
      return 'top'
    case 'bottom':
      return 'bottom'
    case 'left':
      return 'left'
    case 'right':
      return 'right'
    default:
      return 'top'
  }
})
</script>

<style>
.Tooltip {
  display: inline-block;
}

/* `delayed` opts into the default delay token; an explicit `delay` prop (inline --delay) overrides it. */
.Tooltip--delayed {
  --delay: var(--vuiii-tooltip-delay);
}

.Tooltip__trigger {
  anchor-name: var(--anchor-id);
}

.Tooltip__bubble {
  --gap: var(--offset, var(--vuiii-tooltip-gap));
  --arrow-size: var(--vuiii-tooltip-arrowSize);

  position: fixed;
  position-anchor: var(--anchor-id);
  position-area: var(--position-area);
  position-try-fallbacks: flip-block, flip-inline;
  position-visibility: anchors-visible;

  z-index: var(--vuiii-zIndex-tooltip);

  background-color: var(--vuiii-tooltip-bgColor);
  color: var(--vuiii-tooltip-textColor);
  font-size: var(--vuiii-tooltip-fontSize);
  padding: var(--vuiii-tooltip-padding);
  border-radius: var(--vuiii-tooltip-borderRadius);
  box-shadow: var(--vuiii-tooltip-boxShadow);

  white-space: nowrap;
  pointer-events: none;
  width: max-content;
  max-width: 300px;

  opacity: 0;
  visibility: hidden;
  transition:
    opacity 150ms,
    visibility 150ms;
  transition-delay: 0ms;
}

/* Show on hover */
.Tooltip:hover > .Tooltip__bubble {
  opacity: 1;
  visibility: visible;
  transition-delay: var(--delay, 0ms);
}

/* Show on focus-within (opt-in) */
.Tooltip--showOnFocus:focus-within > .Tooltip__bubble {
  opacity: 1;
  visibility: visible;
  transition-delay: var(--delay, 0ms);
}

/* Placement-specific gap */

.Tooltip__bubble--top {
  margin-bottom: var(--gap);
}

.Tooltip__bubble--bottom {
  margin-top: var(--gap);
}

.Tooltip__bubble--left {
  margin-right: var(--gap);
}

.Tooltip__bubble--right {
  margin-left: var(--gap);
}

/* Arrow via ::after pseudo-element */

.Tooltip__bubble--withArrow::after {
  content: '';
  position: absolute;
  width: var(--arrow-size);
  height: var(--arrow-size);
  background-color: var(--vuiii-tooltip-bgColor);
  transform: rotate(45deg);
}

.Tooltip__bubble--withArrow.Tooltip__bubble--top::after {
  bottom: calc(var(--arrow-size) / -2);
  left: 50%;
  margin-left: calc(var(--arrow-size) / -2);
}

.Tooltip__bubble--withArrow.Tooltip__bubble--bottom::after {
  top: calc(var(--arrow-size) / -2);
  left: 50%;
  margin-left: calc(var(--arrow-size) / -2);
}

.Tooltip__bubble--withArrow.Tooltip__bubble--left::after {
  right: calc(var(--arrow-size) / -2);
  top: 50%;
  margin-top: calc(var(--arrow-size) / -2);
}

.Tooltip__bubble--withArrow.Tooltip__bubble--right::after {
  left: calc(var(--arrow-size) / -2);
  top: 50%;
  margin-top: calc(var(--arrow-size) / -2);
}
</style>
