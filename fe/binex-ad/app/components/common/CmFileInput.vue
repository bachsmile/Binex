<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const emit = defineEmits<{
  change: [event: Event];
}>();

const inputRef = ref<HTMLInputElement | null>(null);

defineExpose({
  click: () => inputRef.value?.click(),
  clear: () => {
    if (inputRef.value) {
      inputRef.value.value = '';
    }
  },
});
</script>

<template>
  <input
    ref="inputRef"
    type="file"
    v-bind="$attrs"
    @change="emit('change', $event)"
  />
</template>
