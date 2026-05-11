<script setup lang="ts">
interface Props {
  title: string
  description?: string
  icon?: string
  image?: string
  to?: string | Record<string, any>
  color?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'ph:cube-duotone',
  color: 'from-[#CCFF00] to-cyan-400'
})
</script>

<template>
  <NuxtLink 
    :to="to"
    class="group relative block w-full h-full p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 hover:border-[#CCFF00]/30 transition-all duration-500 overflow-hidden"
  >
    <!-- Background Glow -->
    <div class="absolute -inset-20 bg-[#CCFF00] blur-[120px] opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
    
    <!-- Mascot Overlay -->
    <div v-if="image" class="absolute -right-4 -bottom-4 z-20 w-48 h-48 opacity-90 group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-700 pointer-events-none">
      <div class="absolute inset-0 bg-[#CCFF00] blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity"></div>
      <img :src="image" class="w-full h-full object-contain mix-blend-screen drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" alt="Service Mascot" />
    </div>

    <div class="relative z-10 flex flex-col h-full max-w-[80%]">
      <!-- Icon with animated background -->
      <div class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-[#CCFF00]/50 transition-all duration-500 relative">
        <div class="absolute inset-0 bg-[#CCFF00] blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
        <Icon :name="icon" class="text-3xl text-white group-hover:text-[#CCFF00] transition-colors relative z-10" />
      </div>

      <h3 class="text-2xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-[#CCFF00] transition-colors">
        {{ title }}
      </h3>
      
      <p v-if="description" class="text-white/40 text-sm leading-relaxed mb-8 line-clamp-3 group-hover:text-white/60 transition-colors">
        {{ description }}
      </p>

      <div class="mt-auto flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#CCFF00] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
        Khám phá ngay <Icon name="ph:arrow-right-bold" />
      </div>
    </div>

    <!-- Decorative Corner -->
    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent -translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-bl-[4rem]"></div>
  </NuxtLink>
</template>
