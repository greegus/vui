<script lang="ts" setup>
import Button, { type ButtonProps } from '@/components/Button.vue'
import { useFilteredProps } from '@/composables/useFilteredProps'

export type IconButtonProps = Omit<ButtonProps, 'prefixIcon' | 'suffixIcon' | 'label' | 'block'> & {
  icon: string
  title?: string
}

const props = defineProps<IconButtonProps>()

const buttonProps = useFilteredProps(props, ['icon'])

const emit = defineEmits<{
  click: [Event]
}>()
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
