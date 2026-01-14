<script lang="ts" setup>
defineProps<{
  value: any;
  hideType?: boolean;
}>();
</script>

<template>
  <code style="display: block; margin-top: 1rem; padding: 1rem; background-color: lightgray">
    value:

    <span v-if="value === undefined" style="font-style: italic">undefined</span>
    <span v-else>{{ value }}</span>

    <span v-if="!hideType" style="padding-left: 1rem">(typeof {{ typeof value }})</span>
  </code>
</template>
