<template>
  <hr
    class="Divider"
    :class="{ 'Divider--vertical': orientation === 'vertical' }"
  />
</template>

<script lang="ts" setup>
/**
 * Visual separator line for content sections.
 * Can be horizontal (default) or vertical.
 *
 * @component Divider
 *
 * @example
 * // Horizontal divider (default)
 * import { Divider } from 'vuiii'
 *
 * <div>Section 1</div>
 * <Divider />
 * <div>Section 2</div>
 *
 * @example
 * // Vertical divider (for inline content)
 * <div style="display: flex; align-items: center;">
 *   <span>Item 1</span>
 *   <Divider orientation="vertical" />
 *   <span>Item 2</span>
 * </div>
 *
 * @example
 * // In FormFields (using FORM_DIVIDER constant)
 * import { FORM_DIVIDER } from 'vuiii'
 *
 * const fields = [
 *   { name: 'name', component: Input, label: 'Name' },
 *   FORM_DIVIDER,
 *   { name: 'email', component: Input, label: 'Email' }
 * ]
 */
withDefaults(defineProps<{
  orientation?: "horizontal" | "vertical";
}>(), {
  orientation: "horizontal"
});
</script>

<style scoped>
.Divider {
  --margin: var(--vuiii-divider-margin);
  --color: var(--vuiii-divider-color);
  --width: var(--vuiii-divider-width);

  /* Reset default hr styles */
  border: 0;
  margin: 0;
  padding: 0;

  /* Horizontal (default) */
  width: 100%;
  height: 0;
  border-top: var(--width) solid var(--color);
  margin-top: var(--margin);
  margin-bottom: var(--margin);
}

.Divider--vertical {
  /* Vertical orientation */
  display: inline-block;
  width: 0;
  height: 100%;
  border-top: 0;
  border-left: var(--width) solid var(--color);
  margin-top: 0;
  margin-bottom: 0;
  margin-left: var(--margin);
  margin-right: var(--margin);
  vertical-align: middle;
}
</style>
