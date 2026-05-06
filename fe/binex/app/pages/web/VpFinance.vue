<script setup lang="ts">
definePageMeta({
  layout: 'falling',
  path: '/finance'
})
</script>

<template>
  <div class="min-h-screen bg-black text-white pt-32 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-20 animate-slide-up">
        <div class="text-[#CCFF00] uppercase tracking-[0.3em] font-black text-xs mb-6">Binex Ecosystem</div>
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase">
          Finance <br/>
          <span class="text-white/40">Management.</span>
        </h1>
        <div class="w-24 h-1 bg-[#CCFF00]"></div>
      </div>

      <!-- Placeholder for Finance Content -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="p-12 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all cursor-pointer group">
          <div class="w-16 h-16 rounded-2xl bg-[#CCFF00]/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <Icon name="ph:chart-line-up-bold" class="text-3xl text-[#CCFF00]" />
          </div>
          <h3 class="text-2xl font-black mb-4 uppercase tracking-tighter">Coming Soon</h3>
          <p class="text-white/40 text-sm leading-relaxed">Module quản trị tài chính đang trong quá trình hoàn thiện. Hãy quay lại sau để trải nghiệm.</p>
        </div>
      </div>
    </div>
  </div>
</template>
