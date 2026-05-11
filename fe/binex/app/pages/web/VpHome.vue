<script setup lang="ts">
import CiHeader from '~/components/integrations/CiHeader.vue'
import CmModal from '~/components/commons/CmModal.vue'
import CmCard from '~/components/commons/CmCard.vue'

const { public: { apiBaseUrl } } = useRuntimeConfig()
const { data: serviceResponse } = await useFetch<{ data: any[], total: number }>(`${apiBaseUrl}/service`, {
  params: { limit: 100 }
})

const getMascot = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('wedding')) return '/img/mascot_wedding.png'
  if (n.includes('finance') || n.includes('tài chính')) return '/img/mascot_finance.png'
  if (n.includes('law') || n.includes('luật')) return '/img/mascot_law.png'
  if (n.includes('education') || n.includes('giáo dục')) return '/img/mascot_education.png'
  if (n.includes('medical') || n.includes('y tế')) return '/img/mascot_medical.png'
  if (n.includes('business') || n.includes('doanh nghiệp')) return '/img/mascot_business.png'
  return '/img/mascot_empty_nobg.png'
}

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

definePageMeta({
  layout: 'falling',
  path: '/'
})

const showWelcomeModal = ref(false)
const token = useCookie('auth_token')

const logout = () => {
  token.value = null
  window.location.reload()
}

onMounted(() => {
  setTimeout(() => {
    showWelcomeModal.value = true
  }, 500)
})
</script>

<template>
  <div class="zillas-style min-h-screen bg-white">
    <CiHeader />
    <!-- 1. Hero Section - Dark & Bold (Full Width) -->
    <section class="relative w-full h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-black px-6">

      <div class="absolute inset-0 z-0">
        <img src="/img/hero_tropical.png" class="w-full h-full object-cover opacity-60" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
      </div>
      
      <div class="relative z-10 max-w-6xl w-full">
        <div class="text-[#CCFF00] uppercase tracking-[0.4em] font-black text-base mb-8 animate-slide-up">
          Trung tâm hệ sinh thái <b>BINEX</b>
        </div>
        <h1 class="text-6xl md:text-8xl font-black text-white leading-[1] tracking-tighter mb-10 animate-slide-up uppercase">
          Xin chào & <br/>
          <span class="text-white/80">Cám ơn</span>
        </h1>
        <div class="flex items-center gap-6 mt-16 animate-slide-up">
          <div class="w-16 h-1 bg-[#CCFF00]"></div>
          <div class="text-white uppercase tracking-[0.3em] text-xs font-black">Khám phá ngay</div>
        </div>
      </div>

      <!-- Torn edge effect -->
      <!-- <div class="absolute bottom-0 left-0 w-full h-20 bg-white" style="clip-path: polygon(0 100%, 100% 100%, 100% 0, 85% 60%, 70% 20%, 55% 80%, 40% 30%, 25% 90%, 10% 40%, 0 70%);"></div> -->
    </section>

    <!-- 2. White Section - Full Width Torn Paper -->
    <section class="relative w-full min-h-[600px] flex items-center justify-center z-20 py-32 overflow-visible">
      <!-- THE FULL WIDTH TORN PAPER BACKGROUND -->
      <div class="absolute inset-0 z-0 pointer-events-none" 
           style="background-image: url('/img/202605051657.jpeg'); background-size: 100% 100%; background-repeat: no-repeat;"></div>

      <div class="max-w-4xl mx-auto text-center relative z-10 px-6">
        <div class="text-slate-400 uppercase tracking-widest text-sm font-bold mb-4">Your Partner in</div>
        <h2 class="text-6xl md:text-8xl font-black text-[#CCFF00] mb-10 tracking-tighter drop-shadow-sm">EFFICIENCY</h2>
        <p class="text-xl text-slate-500 leading-relaxed mb-12 max-w-2xl mx-auto font-medium">
          Binex giúp bạn xây dựng nền móng vững chắc cho việc quản trị cá nhân và doanh nghiệp, tối ưu hóa mọi nguồn lực để đạt được sự tăng trưởng vượt bậc.
        </p>
        <button class="px-10 py-5 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-sm rounded-lg hover:scale-105 transition-all shadow-xl shadow-[#CCFF00]/20">
          Đặt lịch tư vấn
        </button>
      </div>
    </section>

    <!-- 3. Module Showcase Section (Dynamic) -->
    <section class="py-32 px-6 md:px-12 bg-black relative overflow-hidden">
      <div class="max-w-8xl mx-auto relative z-10">
        <div class="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div class="max-w-2xl">
            <div class="text-[#CCFF00] uppercase tracking-[0.5em] font-black text-[10px] mb-6">Binex Modules</div>
            <h2 class="text-5xl md:text-7xl font-black uppercase !leading-[0.9] text-white">Dịch vụ <br/> <span class="text-white/10">Toàn diện</span></h2>
          </div>
          <p class="text-white/40 max-w-md text-sm leading-relaxed font-medium uppercase tracking-widest">
            Mỗi module được thiết kế chuyên biệt để giải quyết các bài toán đặc thù trong từng lĩnh vực, mang lại hiệu quả tối ưu nhất.
          </p>
        </div>

        <div v-if="serviceResponse?.data?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="service in serviceResponse.data" :key="service.id" class="h-full">
            <CmCard 
              :title="service.name"
              :description="service.description"
              :image="getMascot(service.name)"
              :to="{ path: getModulePath(service.name), query: { id: service.id } }"
            />
          </div>
        </div>
        <div v-else class="flex justify-center py-20 opacity-20">
          <p class="uppercase tracking-[0.5em] font-black text-xs text-white">Đang tải dữ liệu module...</p>
        </div>
      </div>
    </section>

    <!-- 4. Simple Contact / Call to Action - Torn Paper Style -->
    <section class="relative w-full min-h-[600px] flex items-center justify-center z-20 py-32 overflow-visible">
      <!-- THE BACKGROUND IMAGE -->
      <div class="absolute inset-0 z-0 pointer-events-none" 
           style="background-image: url('/img/202605051644.jpeg'); background-size: 100% 100%; background-repeat: no-repeat;"></div>
      
      <!-- Dark overlay for legibility -->
      <div class="absolute inset-0 bg-black/40 z-1"></div>

      <div class="max-w-4xl mx-auto text-center relative z-10 px-6">
        <h2 class="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight uppercase">Ready to Grow Your Business?</h2>
        <p class="text-[#CCFF00] font-black tracking-[0.3em] text-xs uppercase mb-12">Ready to grow your business?</p>
        <button class="px-10 py-5 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-sm rounded-lg hover:bg-black hover:text-[#CCFF00] transition-all">
          Schedule Your Consultation
        </button>
      </div>
    </section>

    <!-- 5. Map Section (Faked) -->
    <section class="h-[600px] bg-slate-900 relative">
      <div class="absolute inset-0 bg-black z-10 pointer-events-none"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-full max-w-sm">
        <div class="bg-white p-12 rounded-xl text-center shadow-2xl">
          <div class="text-2xl font-black mb-4 tracking-tighter">BINEX <span class="text-[#CCFF00]">CENTER</span></div>
          <p class="text-slate-400 text-sm mb-6 font-medium">123 Tech Avenue, Suite 100, <br/> Digital City, 00000</p>
          <div class="text-[#CCFF00] font-black text-xs uppercase tracking-widest">Main Office</div>
        </div>
      </div>
      <!-- Placeholder Map Pattern -->
      <div class="w-full h-full opacity-30" style="background-image: radial-gradient(circle at 2px 2px, #CCFF00 1px, transparent 0); background-size: 40px 40px;"></div>
    </section>

    <!-- Footer -->
    <footer class="py-20 bg-black/40 text-white px-6 border-t border-white/5">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div class="h-16 mix-blend-screen">
          <img src="/img/1778046369521.png" class="h-full w-auto object-contain" />
        </div>
        <div class="flex gap-8 text-xs font-bold uppercase tracking-widest text-white/40">
          <a href="#" class="hover:text-[#CCFF00]">Home</a>
          <a href="#" class="hover:text-[#CCFF00]">Services</a>
          <a href="#" class="hover:text-[#CCFF00]">Cases</a>
          <a href="#" class="hover:text-[#CCFF00]">Contact</a>
        </div>
      </div>
      <div class="mt-20 pt-10 border-t border-white/5 text-center text-[10px] text-white/20 tracking-[0.5em] uppercase">
        © 2026 Bản quyền thuộc về <b>Công ty TNHH Công nghệ số Binex Việt Nam</b>.
      </div>
    </footer>

    <!-- Welcome Modal -->
    <CmModal v-model="showWelcomeModal">
      <img src="/img/fn1.png" class="w-full h-full object-cover" />
    </CmModal>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

.zillas-style {
  font-family: 'Inter', sans-serif;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up {
  animation: slide-up 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.animate-bounce-slow {
  animation: bounce 3s infinite ease-in-out;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
</style>