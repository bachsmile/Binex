<script setup lang="ts">
import CiHeader from '~/components/integrations/CiHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-black text-white font-['Inter'] relative overflow-hidden">
    <video autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover opacity-30">
      <source src="/mp4/14529357.mp4" type="video/mp4">
    </video>
    <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black"></div>
    <CiHeader />
    <main class="relative z-10 container mx-auto px-6 h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center">
      <div class="relative mb-12 animate-float">
        <div class="absolute inset-0 bg-[#CCFF00] blur-[150px] opacity-20"></div>
        <img src="/img/mascot_law.png" alt="Law" class="w-80 h-auto mix-blend-screen relative z-10 drop-shadow-[0_0_50px_rgba(204,255,0,0.3)]" />
      </div>
      <div class="max-w-3xl">
        <div class="text-[#CCFF00] uppercase tracking-[0.6em] font-black text-xs mb-6">Binex Ecosystem</div>
        <h1 class="text-6xl md:text-8xl font-black uppercase mb-8 tracking-tighter leading-none">Law <br/> <span class="text-white/10">Module</span></h1>
        <p class="text-xl text-white/40 mb-12 leading-relaxed font-medium">Hệ thống hỗ trợ pháp lý và quản lý hồ sơ chuyên nghiệp, đảm bảo tính tuân thủ và an toàn dữ liệu.</p>
        <div class="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
          <div class="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></div>
          <span class="text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">Đang được hoàn thiện</span>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
.animate-float { animation: float 6s ease-in-out infinite; }
</style>
