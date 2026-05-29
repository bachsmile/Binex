<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const buttonAttrs = computed(() => ({
  type: 'button',
  ...attrs,
}));
</script>

<template>
  <button v-bind="buttonAttrs">
    <slot />
  </button>
</template>
