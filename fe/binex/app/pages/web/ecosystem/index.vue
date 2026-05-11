<script setup lang="ts">
import CiHeader from '~/components/integrations/CiHeader.vue'
import CpPhoneCarousel from '~/components/commons/pages/CpPhoneCarousel.vue'
import CpEcosystemOrbit from '~/components/pages/ecosystem/CpEcosystemOrbit.vue'
import CmEmpty from '~/components/commons/CmEmpty.vue'
import { useServiceApi } from '~/api/service'

definePageMeta({
  layout: 'falling',
  path: '/ecosystem'
})

const serviceApi = useServiceApi();
const { data: serviceResponse } = await useAsyncData('services', () => 
  serviceApi.findAll({ limit: 100 })
);
console.log(serviceResponse.value);

const getModulePath = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('wedding')) return '/web/modules/wedding'
  if (n.includes('finance')) return '/web/modules/finance'
  if (n.includes('law')) return '/web/modules/law'
  if (n.includes('education')) return '/web/modules/education'
  if (n.includes('medical')) return '/web/modules/medical'
  if (n.includes('business')) return '/web/modules/business'
  return '/'
}

const carouselItems = computed(() => {
  if (!serviceResponse.value?.data) return []
  return serviceResponse.value.data.map(s => ({
    id: s.id,
    label: 'SERVICE',
    title: s.name,
    desc: s.description || 'Giải pháp chuyển đổi số toàn diện cho doanh nghiệp.',
    image: s.thumbnail || '/img/ecosystem_light.png',
    to: { path: getModulePath(s.name), query: { id: s.id } }
  }))
})

const ecosystemItems = computed(() => {
  if (!serviceResponse.value?.data) return []
  return serviceResponse.value.data.map(s => ({
    id: s.id,
    title: s.name,
    icon: s.icon || 'ph:cube-duotone',
    to: { path: getModulePath(s.name), query: { id: s.id } }
  }))
})
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
    <CpPhoneCarousel 
      v-if="carouselItems.length > 0"
      :items="carouselItems" 
    >
      <template #item="{ item }">
        <div class="relative w-full h-full overflow-hidden">
          <img :src="item.image" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          <div class="absolute bottom-10 left-6 right-6 text-left animate-fade-in">
            <p class="text-[#CCFF00] text-[8px] font-black tracking-widest uppercase mb-2">{{ item.label }}</p>
            <h4 class="text-xl font-black uppercase leading-tight mb-2 tracking-tighter">{{ item.title }}</h4>
            <p class="text-white/50 text-[9px] leading-relaxed line-clamp-3 mb-5">{{ item.desc }}</p>

            <NuxtLink 
              v-if="item.to"
              :to="item.to"
              @click.stop
              class="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 hover:bg-[#CCFF00] hover:text-black backdrop-blur-md rounded-full border border-white/10 transition-all duration-300 pointer-events-auto group/btn shadow-lg hover:shadow-[#CCFF00]/20"
            >
              <span class="text-[9px] font-black uppercase tracking-[0.2em]">Khám phá ngay</span>
              <Icon name="ph:arrow-up-right-bold" size="12" class="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </NuxtLink>
          </div>
        </div>
      </template>
    </CpPhoneCarousel>

    <main v-else class="relative z-10 pt-32 pb-20 px-6 flex flex-col items-center justify-center min-h-screen">
      <div class="text-center mb-6 animate-fade-in">
        <div class="text-[#CCFF00] uppercase tracking-[0.5em] font-black text-[10px] mb-6">Binex Ecosystem</div>
        <h1 class="text-2xl md:text-4xl font-black uppercase mb-6 leading-tight">
          Hệ sinh thái <br/>
          <span class="text-white/30">Chuyển đổi số toàn diện</span>
        </h1>
        <div class="w-24 h-1 bg-[#CCFF00] mx-auto rounded-full"></div>
      </div>

      <!-- Orbit Diagram or Empty State -->
      <div class="w-full max-w-5xl animate-scale-in">
        <CmEcosystemOrbit v-if="ecosystemItems.length > 0" :items="ecosystemItems" />
        <CmEmpty v-else message="Hệ sinh thái đang được cập nhật dữ liệu" />
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
