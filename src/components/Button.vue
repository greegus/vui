<template>
  <component
    :is="component"
    class="Button vuiii-button"
    :class="{
      [`vuiii-button--variant-${$props.variant}`]: $props.variant,
      [`vuiii-button--size-${$props.size}`]: $props.size,
      'vuiii-button--disabled': $props.disabled || $props.loading,
      'vuiii-button--loading': $props.loading,
      'vuiii-button--outlined': $props.outlined && $props.variant,
      'vuiii-button--block': $props.block,
      'vuiii-button--pill': $props.pill,
    }"
    v-bind="$attrs"
    :to="component === 'router-link' ? $props.to : undefined"
    :href="component === 'a' ? $props.href : undefined"
    :type="component === 'button' ? $props.type : undefined"
  >
    <slot name="prefix">
      <Icon
        v-if="$props.prefixIcon || $props.loading"
        class="vuiii-button__icon vuiii-button__icon--prefix"
        :name="$props.loading ? 'spinner' : $props.prefixIcon!"
        :size="$props.size"
      />
    </slot>

    <span v-if="$slots.default || $props.label">
      <slot>{{ $props.label }}</slot>
    </span>

    <slot name="suffix">
      <Icon
        v-if="$props.suffixIcon"
        class="vuiii-button__icon vuiii-button__icon--suffix"
        :name="$props.suffixIcon"
        :size="$props.size"
      />
    </slot>
  </component>
</template>

<script lang="ts" setup>
/**
 * Polymorphic button component that renders as <button>, <a>, or <router-link>.
 * Supports multiple variants, sizes, icons, and loading states.
 *
 * @component Button
 *
 * @example
 * // Basic button
 * import { Button } from 'vuiii'
 *
 * <Button label="Click me" />
 * <Button variant="primary" label="Submit" />
 * <Button variant="danger" label="Delete" />
 *
 * @example
 * // With icons
 * <Button prefixIcon="plus" label="Add Item" />
 * <Button label="Download" suffixIcon="arrow-down" />
 * <Button prefixIcon="save" suffixIcon="chevron-down" label="Save" />
 *
 * @example
 * // Different sizes
 * <Button size="small" label="Small" />
 * <Button size="normal" label="Normal" />
 * <Button size="large" label="Large" />
 *
 * @example
 * // As router link (renders as <router-link>)
 * <Button :to="{ name: 'home' }" label="Go Home" />
 * <Button :to="'/about'" label="About" variant="secondary" />
 *
 * @example
 * // As external link (renders as <a>)
 * <Button href="https://example.com" label="Visit Site" />
 *
 * @example
 * // Loading state (shows spinner, disables button)
 * <Button :loading="isSubmitting" label="Submit" variant="primary" />
 *
 * @example
 * // Outlined variant
 * <Button variant="primary" outlined label="Outlined Primary" />
 *
 * @example
 * // Full width and pill shape
 * <Button block label="Full Width" />
 * <Button pill label="Rounded" />
 *
 * @example
 * // With custom slot content
 * <Button variant="primary">
 *   <template #prefix><CustomIcon /></template>
 *   Custom Content
 *   <template #suffix><Badge>3</Badge></template>
 * </Button>
 *
 * @slot default - Button label content (alternative to label prop)
 * @slot prefix - Custom prefix content (replaces prefixIcon)
 * @slot suffix - Custom suffix content (replaces suffixIcon)
 */
import "@/assets/css/button.css";

import { computed } from "vue";
import type { RouteLocationRaw } from "vue-router";

import Icon from "@/components/Icon.vue";
import type { ButtonVariant, InputSize } from "@/types";

export type NativeButtonProps = {
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export type ButtonProps = NativeButtonProps & {
  size?: InputSize;
  variant?: ButtonVariant;
  prefixIcon?: string;
  suffixIcon?: string;
  label?: string;
  block?: boolean;
  loading?: boolean;
  outlined?: boolean;
  pill?: boolean;
  to?: RouteLocationRaw;
  href?: string;
};

const props = withDefaults(defineProps<ButtonProps>(), {
  type: "button",
});

defineSlots<{
  prefix?: void;
  default?: void;
  suffix?: void;
}>();

const component = computed(() => {
  if (props.to) {
    return "router-link";
  }

  if (props.href) {
    return "a";
  }

  return "button";
});
</script>
