<script setup lang="ts">
interface OrbitItem {
  id: string | number
  title: string
  icon: string
  color?: string
}

interface Props {
  items: OrbitItem[]
  centerTitle?: string
  centerIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  centerTitle: 'BI-CORE AI',
  centerIcon: 'ph:cpu-fill'
})

// Calculate rotation for each item
const getItemStyle = (index: number, total: number) => {
  const angle = (index * 360) / total
  return {
    transform: `rotate(${angle}deg) translateY(-220px) rotate(-${angle}deg)`
  }
}
</script>

<template>
  <div class="relative w-full h-[600px] flex items-center justify-center select-none overflow-visible">
    <!-- Orbital Lines -->
    <div class="absolute w-[440px] h-[440px] border border-white/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
    <div class="absolute w-[300px] h-[300px] border border-[#CCFF00]/5 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
    
    <!-- Central Core -->
    <div class="relative z-10 group">
      <div class="absolute inset-0 bg-[#CCFF00] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
      <div class="w-40 h-40 rounded-full bg-gradient-to-br from-black to-zinc-900 border-2 border-[#CCFF00]/30 flex flex-col items-center justify-center p-6 text-center relative z-10 shadow-[0_0_50px_-10px_rgba(204,255,0,0.3)]">
        <Icon :name="centerIcon" class="text-5xl text-[#CCFF00] mb-3 animate-pulse" />
        <span class="text-[10px] font-black tracking-[0.2em] uppercase text-[#CCFF00]">{{ centerTitle }}</span>
      </div>
      <!-- Decorative rings -->
      <div class="absolute -inset-4 border border-[#CCFF00]/10 rounded-full animate-[ping_3s_ease-in-out_infinite]"></div>
    </div>

    <!-- Satellite Items -->
    <div 
      v-for="(item, idx) in items" 
      :key="item.id"
      class="absolute transition-all duration-500 hover:scale-110"
      :style="getItemStyle(idx, items.length)"
    >
      <div class="flex flex-col items-center group cursor-pointer">
        <div 
          class="w-16 h-16 rounded-2xl bg-black/80 border border-white/10 flex items-center justify-center mb-3 group-hover:border-[#CCFF00] group-hover:shadow-[0_0_20px_-5px_#CCFF00] transition-all relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          <Icon :name="item.icon" class="text-2xl text-white group-hover:text-[#CCFF00] transition-colors relative z-10" />
        </div>
        <div class="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 whitespace-nowrap">
          <span class="px-3 py-1 bg-[#CCFF00] text-black text-[9px] font-black uppercase tracking-widest rounded-full">
            {{ item.title }}
          </span>
        </div>
        <span class="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:opacity-0 transition-opacity">
          {{ item.title }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
