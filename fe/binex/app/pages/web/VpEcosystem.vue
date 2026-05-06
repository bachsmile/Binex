<script setup lang="ts">
import CiHeader from '~/components/integrations/CiHeader.vue'
import CmEcosystemOrbit from '~/components/commons/CmEcosystemOrbit.vue'

definePageMeta({
  layout: 'falling',
  path: '/ecosystem'
})

const ecosystemItems = [
  { id: 1, title: 'Quản lý Công việc', icon: 'ph:briefcase-duotone' },
  { id: 2, title: 'Quản lý Dự án', icon: 'ph:kanban-duotone' },
  { id: 3, title: 'App Giao hàng', icon: 'ph:truck-duotone' },
  { id: 4, title: 'Chat & Mạng xã hội', icon: 'ph:chat-circle-dots-duotone' },
  { id: 5, title: 'Hệ thống ERP', icon: 'ph:factory-duotone' },
  { id: 6, title: 'Kế toán', icon: 'ph:calculator-duotone' },
  { id: 7, title: 'Quản lý Kho', icon: 'ph:warehouse-duotone' },
  { id: 8, title: 'Quản lý thiết bị', icon: 'ph:hard-drives-duotone' },
  { id: 9, title: 'Nhân sự', icon: 'ph:users-four-duotone' },
  { id: 10, title: 'CRM', icon: 'ph:identification-card-duotone' },
  { id: 11, title: 'Hợp đồng điện tử', icon: 'ph:file-text-duotone' },
  { id: 12, title: 'Văn bản nội bộ', icon: 'ph:envelope-simple-open-duotone' },
  { id: 13, title: 'DMS', icon: 'ph:folders-duotone' },
  { id: 14, title: 'Công văn', icon: 'ph:stamp-duotone' },
]
</script>

<template>
  <div class="ecosystem-view min-h-screen bg-black text-white overflow-hidden relative">
    <!-- Video Background -->
    <video 
      autoplay 
      muted 
      loop 
      playsinline
      class="absolute inset-0 w-full h-full object-cover  mix-blend-screen"
    >
      <source src="/mp4/14529357.mp4" type="video/mp4">
    </video>

    <CiHeader />

    <main class="relative z-10 pt-32 pb-20 px-6 flex flex-col items-center justify-center min-h-screen">
      <div class="text-center mb-6 animate-fade-in">
        <div class="text-[#CCFF00] uppercase tracking-[0.5em] font-black text-[10px] mb-6">Binex Ecosystem</div>
        <h1 class="text-2xl md:text-4xl font-black uppercase mb-6 leading-tight">
          Hệ sinh thái <br/>
          <span class="text-white/30">Chuyển đổi số toàn diện</span>
        </h1>
        <div class="w-24 h-1 bg-[#CCFF00] mx-auto rounded-full"></div>
      </div>

      <!-- Orbit Diagram -->
      <div class="w-full max-w-5xl animate-scale-in">
        <CmEcosystemOrbit :items="ecosystemItems" />
      </div>

      <!-- Footer Motto -->
      <div class="mt-20 text-center animate-fade-in animation-delay-500">
        <p class="text-xl md:text-2xl font-bold uppercase tracking-widest text-white/80 mb-2">
          One Business - One Platform - All in One
        </p>
        <p class="text-[#CCFF00] font-black uppercase tracking-[0.3em] text-xs">
          Nền tảng chuyển đổi số thế hệ mới
        </p>
      </div>
    </main>

    <!-- Animated Particles/Lines in background (Optional but nice) -->
    <div class="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#CCFF00]/10 to-transparent pointer-events-none"></div>
  </div>
</template>

<style scoped>
.ecosystem-view {
  font-family: 'Inter', sans-serif;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fade-in 1.2s ease-out forwards;
}

.animate-scale-in {
  animation: scale-in 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}
</style>
