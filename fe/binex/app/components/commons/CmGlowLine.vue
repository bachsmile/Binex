<script setup lang="ts">
interface Props {
  color?: string
  opacity?: number
  vertical?: boolean
}

withDefaults(defineProps<Props>(), {
  color: 'from-[#CCFF00] to-cyan-400',
  opacity: 0.2,
  vertical: false
})
</script>

<template>
  <div 
    :class="[
      'relative overflow-hidden',
      vertical ? 'w-[1px] h-full' : 'w-full h-[1px]',
    ]"
  >
    <div 
      :class="[
        'absolute inset-0 bg-gradient-to-r',
        color,
        vertical ? 'bg-gradient-to-b' : 'bg-gradient-to-r'
      ]"
      :style="{ opacity }"
    ></div>
    <!-- Glow Effect -->
    <div 
      :class="[
        'absolute inset-0 blur-[2px]',
        color,
        vertical ? 'bg-gradient-to-b' : 'bg-gradient-to-r'
      ]"
      :style="{ opacity: opacity * 0.5 }"
    ></div>
  </div>
</template>
