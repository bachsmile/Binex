<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <table v-bind="$attrs">
    <slot />
  </table>
</template>
