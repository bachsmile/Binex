<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  value: number;
  max?: number;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  height: 'h-2',
});

const percentage = computed(() => {
  if (props.max <= 0) return 0;
  const pct = (props.value / props.max) * 100;
  return Math.min(100, Math.max(0, pct));
});
</script>

<template>
  <div class="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden" :class="height">
    <div 
      class="bg-primary h-full rounded-full transition-all duration-500 ease-out" 
      :style="{ width: `${percentage}%` }"
    ></div>
  </div>
</template>
