<script lang="ts" setup>
import Button, { type ButtonProps } from '@/components/Button.vue'
import { useFilteredProps } from '@/composables/useFilteredProps'

export interface IconButtonProps extends Omit<ButtonProps, 'prefixIcon' | 'suffixIcon' | 'label' | 'block'> {
  icon: string
  title?: string
}

const props = defineProps<IconButtonProps>()

const buttonProps = useFilteredProps(props, ['icon'])

defineEmits<{
  click: []
}>()
</script>

<template>
  <Button class="vuiii-icon-button" :prefixIcon="icon" v-bind="buttonProps" />
</template>

<style lang="postcss">
.vuiii-icon-button.vuiii-button {
  padding: 0.5em;

  .vuiii-button__icon {
    margin: 0;
  }
}
</style>
