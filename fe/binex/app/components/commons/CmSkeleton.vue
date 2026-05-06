<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  borderRadius?: string
  className?: string
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  borderRadius: '0.5rem',
  className: ''
})
</script>

<template>
  <div 
    class="skeleton-item relative overflow-hidden bg-white/5" 
    :class="className"
    :style="{ 
      width: width, 
      height: height, 
      borderRadius: borderRadius 
    }"
  >
    <div class="shimmer-effect absolute inset-0"></div>
  </div>
</template>

<style scoped>
.skeleton-item {
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.02);
}

.shimmer-effect {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
  transform: translateX(-100%);
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
