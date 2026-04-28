<script setup lang="ts">
const props = withDefaults(defineProps<{
  delay?: number
  duration?: number
}>(), {
  delay: 0,
  duration: 1000,
})

const visible = ref(false)

onMounted(() => {
  setTimeout(() => {
    visible.value = true
  }, props.delay)
})
</script>

<template>
  <div
    class="transition-opacity"
    :style="{
      opacity: visible ? 1 : 0,
      transitionDuration: `${duration}ms`,
    }"
  >
    <slot />
  </div>
</template>
