<script setup lang="ts">
import CiHeader from '~/components/integrations/CiHeader.vue'
import CmEmpty from '~/components/commons/CmEmpty.vue'
import { useServiceApi, usePackageApi } from '~/api'

definePageMeta({
  layout: 'falling',
  path: '/web/modules/finance'
})

useSeoMeta({
  title: 'Tài chính số | Module Binex',  
  description: 'Quản lý tài chính thông minh và hiệu quả với module Finance được thiết kế chuyên sâu',
  ogTitle: 'Tài chính số | Module Binex',
  ogDescription: 'Quản lý tài chính thông minh và hiệu quả với module Finance được thiết kế chuyên sâu',
  ogImage: '/img/ecosystem_light.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
});

const route = useRoute()
const serviceId = computed(() => route.query.id as string)

const serviceApi = useServiceApi()
const packageApi = usePackageApi()

// 1. Fetch Service by ID from query
const service = serviceId.value
  ? (await serviceApi.findOne(serviceId.value))?.data || null
  : null

// 2. Fetch Packages specifically for this service if packageIds are present
const financePackages = (service?.packageIds?.length ?? 0) > 0
  ? (await packageApi.findDetailsByIds({ ids: service!.packageIds }))?.data || []
  : []

const formatPrice = (price: string | number) => {
  const value = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(value)) return price
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const calculateFinalPrice = (price: string, sale?: number) => {
  const base = parseFloat(price)
  if (isNaN(base)) return 0
  if (!sale) return base
  return base * (1 - sale / 100)
}

const getPriceUnit = (expire: number) => {
  if (expire >= 360) return '/ năm'
  if (expire >= 28) return '/ tháng'
  return ''
}

const authModal = useAuthModal();
const packageModal = usePackageModal();
const authToken = useCookie('auth_token', { path: '/' });
const isShaking = ref<string | null>(null);

const handleSelectPackage = (pack: any) => {
  console.log('[Finance] Clicking package:', pack.name, '| AuthToken:', !!authToken.value);
  
  isShaking.value = pack.id;
  setTimeout(() => { isShaking.value = null; }, 500);

  if (!authToken.value) {
    authModal.openLogin('Hãy đăng nhập hệ thống để có thể tiếp tục khám phá và mua gói dịch vụ');
    return;
  }
  
  packageModal.open(pack);
};
</script>

<template>
  <div class="min-h-screen bg-black text-white font-['Inter'] relative overflow-hidden">
    <CiHeader />

    <!-- 1. Hero Section -->
    <section class="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <!-- Background Video -->
      <video autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover opacity-50">
        <source src="/mp4/14529357.mp4" type="video/mp4">
      </video>
      <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>

      <div class="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div class="mb-8 flex justify-center translate-y-4 animate-fade-in opacity-0" style="animation-fill-mode: forwards;">
          <img src="/img/mascot_finance.png" class="h-40 md:h-60 object-contain mix-blend-screen drop-shadow-[0_0_50px_rgba(204,255,0,0.4)]" alt="Finance Mascot" />
        </div>
        <h1 class="text-6xl md:text-9xl font-black uppercase mb-8 tracking-tighter !leading-[0.85] animate-fade-in opacity-0" style="animation-delay: 0.3s; animation-fill-mode: forwards;">
          Finance <br/> <span class="text-[#CCFF00]">Intelligence</span>
        </h1>
        <p class="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto font-medium animate-fade-in opacity-0" style="animation-delay: 0.6s; animation-fill-mode: forwards;">
          Quản trị dòng tiền, tối ưu đầu tư và kiểm soát tài chính minh bạch cho mọi doanh nghiệp.
        </p>
      </div>
    </section>

    <!-- 2. Value Section -->
    <section class="relative w-full py-40 flex items-center justify-center z-20">
      <div class="absolute inset-0 z-0 pointer-events-none opacity-10" 
           style="background-image: url('/img/202605051657.jpeg'); background-size: 100% 100%; background-repeat: no-repeat;"></div>

      <div class="max-w-4xl mx-auto text-center relative z-10 px-6">
        <div class="text-[#CCFF00] uppercase tracking-[0.4em] text-[10px] font-black mb-8">Financial Accuracy</div>
        <h2 class="text-5xl md:text-8xl font-black mb-12 tracking-tighter !leading-tight uppercase">
          Chính xác <br/> <span class="text-white/20">Tuyệt đối</span>
        </h2>
        <p class="text-lg md:text-xl text-white/40 leading-relaxed mb-16 max-w-2xl mx-auto font-medium uppercase tracking-widest">
          Đảm bảo mọi con số đều được kiểm soát và minh bạch trong thời gian thực.
        </p>
      </div>
    </section>

    <!-- 3. Package Grid -->
    <section class="py-32 px-6 md:px-12 bg-zinc-950/50 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div class="max-w-8xl mx-auto relative z-10">
        <div class="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div class="max-w-2xl">
            <div class="text-[#CCFF00] uppercase tracking-[0.5em] font-black text-[10px] mb-6">Finance Packages</div>
            <h2 class="text-5xl md:text-7xl font-black uppercase !leading-[0.9]">Các gói <br/> <span class="text-white/10">Giải pháp</span></h2>
          </div>
          <p class="text-white/40 max-w-md text-sm leading-relaxed font-medium uppercase tracking-widest text-right">
             Lựa chọn gói dịch vụ tài chính phù hợp với nhu cầu kiểm soát và phát triển của bạn.
          </p>
        </div>

        <div v-if="financePackages.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div v-for="pack in financePackages" :key="pack.id" class="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-10 hover:border-[#CCFF00]/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(204,255,0,0.05)] flex flex-col h-full">
            <!-- Sale Badge -->
            <div v-if="pack.sale" class="absolute -top-4 -right-4 bg-[#CCFF00] text-black text-[10px] font-black px-4 py-2 rounded-full transform rotate-12 group-hover:rotate-0 transition-transform shadow-lg z-20">
              TIẾT KIỆM {{ pack.sale }}%
            </div>

            <div class="mb-10 overflow-hidden">
              <div class="w-12 h-12 bg-[#CCFF00]/10 rounded-xl flex items-center justify-center mb-6 border border-[#CCFF00]/20">
                <Icon name="ph:bank-fill" class="text-[#CCFF00] w-6 h-6" />
              </div>
              <h3 class="text-xl md:text-2xl font-black text-white mb-4 uppercase tracking-tight break-all">
                {{ pack.name }}
              </h3>
              <p class="text-white/40 text-sm leading-relaxed font-medium">
                {{ pack.description }}
              </p>
            </div>

            <div class="mb-10">
              <div class="flex items-baseline gap-2">
                <span class="text-4xl font-black text-[#CCFF00] tracking-tighter">
                  {{ formatPrice(calculateFinalPrice(pack.price, pack.sale)) }}
                </span>
                <span class="text-white/20 text-[10px] uppercase font-black tracking-widest">{{ getPriceUnit(pack.expire) }}</span>
              </div>
              <div v-if="pack.sale" class="text-white/20 text-sm line-through mt-2 font-medium">
                {{ formatPrice(pack.price) }}
              </div>
            </div>

            <!-- Features list -->
            <ul class="space-y-5 mb-12 flex-grow">
              <li class="flex items-center gap-4 text-xs text-white/60 font-bold uppercase tracking-widest">
                <Icon name="ph:database-fill" class="text-[#CCFF00] w-4 h-4 opacity-50" />
                <span>{{ pack.storageLimit > 0 ? pack.storageLimit + ' MB Lưu trữ' : 'Không giới hạn lưu trữ' }}</span>
              </li>
              <li class="flex items-center gap-4 text-xs text-white/60 font-bold uppercase tracking-widest">
                <Icon name="ph:calendar-check-fill" class="text-[#CCFF00] w-4 h-4 opacity-50" />
                <span>Hiệu lực {{ pack.expire }} ngày</span>
              </li>
              <li v-if="pack.isGroup" class="flex items-center gap-4 text-xs text-[#CCFF00] font-bold uppercase tracking-widest">
                <Icon name="ph:users-four-fill" class="w-4 h-4" />
                <span>Gói nhóm ({{ pack.amountGroup }} thành viên)</span>
              </li>
            </ul>

            <button 
              @click="handleSelectPackage(pack)"
              :class="{ 'animate-shake': isShaking === pack.id }"
              class="w-full py-5 bg-white/5 border border-white/10 rounded-xl text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#CCFF00] hover:text-black transition-all duration-300 group-hover:border-[#CCFF00] relative z-30"
            >
              Chọn gói ngay
            </button>
          </div>
        </div>
        <CmEmpty v-else message="Chưa có gói dịch vụ cho module này" />
      </div>

      <div class="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </section>

    <!-- Footer -->
    <footer class="py-20 text-center border-t border-white/5">
      <p class="text-white/20 text-[10px] uppercase font-black tracking-[0.4em]"> © 2026 Bản quyền thuộc về <b>Công ty TNHH Công nghệ số Binex Việt Nam</b>.</p>
    </footer>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
  border-color: #CCFF00 !important;
}
</style>
