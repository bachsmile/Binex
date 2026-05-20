<script setup lang="ts">
interface Props {
  hoverable?: boolean;
  border?: boolean;
}

withDefaults(defineProps<Props>(), {
  hoverable: false,
  border: true,
});
</script>

<template>
  <div 
    class="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm transition-all duration-300 relative overflow-hidden"
    :class="[
      border ? 'border border-zinc-100/60 dark:border-zinc-800/40' : '',
      hoverable ? 'hover:shadow-md hover:translate-y-[-2px] hover:border-zinc-200/80 dark:hover:border-zinc-700/60' : ''
    ]"
  >
    <slot></slot>
  </div>
</template>
