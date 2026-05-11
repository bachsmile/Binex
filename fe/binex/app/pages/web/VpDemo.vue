<script setup lang="ts">
import CiHeader from '~/components/integrations/CiHeader.vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

definePageMeta({
  layout: 'falling',
  path: '/demo'
})

const video1 = '/mp4/web demo (8).mp4'
const video2 = '/mp4/202605071033.mp4'
const video3 = '/mp4/202605081341.mp4'
const asset3 = '/web demo (4).gif'
const asset4 = '/img/tech_connectivity_1778145265728.png'
const robotAsset = '/web demo (2).gif'

const videoPlayer = ref<HTMLVideoElement | null>(null)
const isMuted = ref(true)
const videoEnded = ref(false)


const activeStep = ref(0) // 0: Video 1, 1: Video 2, 2: Video 3, 3: Footer
const scrollyContainer = ref<HTMLElement | null>(null)
const isAnimating = ref(false)
const scrollAttempts = ref(0) 

const totalSteps = 5
const phoneIndex = ref(1) 
const carouselCount = ref(0) // Track how many times they've spun the carousel

const nextStep = () => {
  if (activeStep.value < totalSteps - 1 && !isAnimating.value) {
    if (activeStep.value === 0 && !videoEnded.value) {
      scrollAttempts.value++
      if (scrollAttempts.value < 2) return 
    }
    
    // Infinite Internal Carousel Logic for Step 2
    // if (activeStep.value === 2) {
    //   carouselCount.value++
    //   // Allow exit to next section after 3 spins (less annoying)
    //   if (carouselCount.value > 3) {
    //     carouselCount.value = 0
    //   } else {
    //     phoneIndex.value = (phoneIndex.value + 1) % 5
    //     return
    //   }
    // }

    isAnimating.value = true
    activeStep.value++
    setTimeout(() => { isAnimating.value = false }, 800)
  }
}

const prevStep = () => {
  if (activeStep.value > 0 && !isAnimating.value) {
    // Infinite Internal Carousel Logic for Step 2
    // if (activeStep.value === 2) {
    //   phoneIndex.value = (phoneIndex.value - 1 + 5) % 5
    //   return
    // }

    isAnimating.value = true
    activeStep.value--
    setTimeout(() => { isAnimating.value = false }, 800)
  }
}

const handleWheel = (e: WheelEvent) => {
  if (isAnimating.value) return
  
  // Prevent default scroll behavior for zero-scroll app
  if (e.cancelable) e.preventDefault()
  
  if (e.deltaY > 0) {
    nextStep()
  } else if (e.deltaY < 0) {
    prevStep()
  }
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (videoPlayer.value) {
    videoPlayer.value.muted = isMuted.value
  }
}

const onVideoEnded = () => {
  videoEnded.value = true
  // Loop manually so we can still catch the first completion
  if (videoPlayer.value) {
    videoPlayer.value.play()
  }
}

const enterSite = () => {
  nextStep()
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  
  if (videoPlayer.value) {
    videoPlayer.value.play().catch(e => console.log('Autoplay blocked', e))
    videoPlayer.value.addEventListener('ended', onVideoEnded)
  }

  window.addEventListener('wheel', handleWheel, { passive: false })
})

onUnmounted(() => {
  document.body.style.overflow = 'auto'
  window.removeEventListener('wheel', handleWheel)
})

// Data for AI steps (moved here for cleaner script)
const aiSteps = [
  {
    id: 1,
    label: 'TỰ ĐỘNG HÓA',
    title: 'Tự động hóa thông minh',
    desc: 'Hệ thống AI tự động hóa các quy trình phức tạp, giúp doanh nghiệp tiết kiệm 70% thời gian vận hành.',
    image: '/img/tech_automation_1778145250016.png'
  },
  {
    id: 2,
    label: 'KẾT NỐI',
    title: 'Kết nối không giới hạn',
    desc: 'Xây dựng mạng lưới liên kết dữ liệu thời gian thực, cho phép các bộ phận phối hợp nhịp nhàng.',
    image: '/img/tech_connectivity_1778145265728.png'
  },
  {
    id: 3,
    label: 'HỆ SINH THÁI',
    title: 'Hệ sinh thái bền vững',
    desc: 'Tích hợp toàn diện các giải pháp vào một nền tảng duy nhất, tạo ra môi trường làm việc số hiện đại.',
    image: '/img/tech_ecosystem_1778145281406.png'
  },
  {
    id: 4,
    label: 'PHÂN TÍCH',
    title: 'Phân tích dữ liệu lớn',
    desc: 'Xử lý hàng triệu dòng dữ liệu mỗi giây để đưa ra những dự báo chính xác về xu hướng thị trường.',
    image: '/img/tech_automation_1778145250016.png'
  },
  {
    id: 5,
    label: 'BẢO MẬT',
    title: 'Bảo mật đa tầng',
    desc: 'Bảo vệ tài sản số của doanh nghiệp bằng công nghệ mã hóa tiên tiến nhất hiện nay.',
    image: '/img/tech_connectivity_1778145265728.png'
  }
]
</script>

<template>
  <div class="relative h-screen w-screen bg-black overflow-hidden font-inter text-white">
    <img 
      src="/web demo.png" 
      class="absolute top-10 left-10 w-40 h-auto z-50 pointer-events-none"
    />
    <CiHeader class="z-50" />

    <!-- STEP 0: VIDEO 1 -->
    <div 
      class="absolute inset-0 z-10 transition-opacity duration-1000"
      :class="activeStep === 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
    >
      <video 
        ref="videoPlayer"
        :src="video1" 
        class="w-full h-full object-cover pointer-events-none"
        autoplay 
        muted 
        playsinline
      ></video>
      <div class="absolute bottom-12 left-12 z-20">
        <Transition name="fade-in">
          <div v-if="!videoEnded" class="flex flex-col gap-3">
            <div class="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 animate-pulse">
              <Icon name="ph:lock-key-fill" class="text-[#CCFF00]" />
              <span class="text-[9px] font-black uppercase tracking-[0.2em] text-white/70">Đang giới thiệu...</span>
            </div>
            <p v-if="scrollAttempts > 0" class="text-[10px] text-[#CCFF00] font-bold text-center animate-bounce">Cuộn thêm một lần để bỏ qua</p>
          </div>
          <button 
            v-else
            @click="enterSite"
            class="group flex items-center gap-6 px-10 py-5 bg-[#CCFF00] text-black rounded-full transition-all duration-700 hover:scale-105 shadow-[0_0_30px_rgba(204,255,0,0.3)]"
          >
            <span class="text-xs font-black uppercase tracking-[0.3em]">Bắt đầu khám phá</span>
            <Icon name="ph:arrow-right-bold" class="group-hover:translate-x-2 transition-transform" />
          </button>
        </Transition>
      </div>
    </div>

    <!-- STEP 1: VIDEO 2 -->
    <div 
      class="absolute inset-0 z-20 transition-opacity duration-1000"
      :class="activeStep === 1 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
    >
      <video 
        :src="video2" 
        class="absolute inset-0 w-full h-full object-cover pointer-events-none"
        autoplay 
        loop
        muted 
        playsinline
      ></video>
    </div>

    <!-- STEP 2: GIF CONTENT + PHONE CAROUSEL -->
    <div 
      class="absolute inset-0 z-20 transition-opacity duration-1000"
      :class="activeStep === 2 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
    >
      <video 
        :src="video3" 
        class="absolute inset-0 w-full h-full object-cover  pointer-events-none"
        autoplay 
        loop
        muted 
        playsinline
      ></video>
      
      <!-- Phone Carousel -->
      <div class="relative h-full w-full flex flex-col justify-center items-center overflow-hidden">

        <div class="relative w-full max-w-7xl h-[600px] flex items-center justify-center">
          <div 
            v-for="(item, index) in aiSteps" 
            :key="'phone-'+item.id"
            class="absolute transition-all duration-1000 ease-out cursor-pointer group"
            :style="(() => {
              const total = 5;
              let diff = (index - phoneIndex + total) % total;
              if (diff > total / 2) diff -= total;
              
              return {
                transform: `translateX(${diff * 350}px) scale(${index === phoneIndex ? 1.1 : 0.7})`,
                zIndex: index === phoneIndex ? 50 : 40 - Math.abs(diff),
                // opacity: index === phoneIndex ? 1 : Math.max(0.2, 0.6 - Math.abs(diff) * 0.2),
                filter: index === phoneIndex ? 'none' : 'blur(2px)'
              }
            })()"
            @click="phoneIndex = index"
          >
            <!-- iPhone Mockup Shell -->
            <div class="relative w-[280px] h-[580px] bg-[#111] rounded-[3rem] border-[8px] border-[#222] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
              <!-- Dynamic Island -->
              <div class="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20 flex items-center justify-center gap-2 px-3 overflow-hidden transition-all duration-500 group-hover:w-32 group-hover:h-7 shadow-lg">
                <div class="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                <div class="flex-1 h-1 bg-white/5 rounded-full"></div>
                <div class="w-1 h-1 rounded-full bg-[#CCFF00]/30 blur-[0.5px]"></div>
              </div>
              
              <!-- Screen Content -->
              <div class="absolute inset-0 z-10">
                <img :src="item.image" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                
                <!-- Overlay Text -->
                <div class="absolute bottom-10 left-6 right-6 text-left">
                  <p class="text-[#CCFF00] text-[8px] font-black tracking-widest uppercase mb-2">{{ item.label }}</p>
                  <h4 class="text-xl font-black uppercase leading-tight mb-2">{{ item.title }}</h4>
                  <p class="text-white/50 text-[9px] leading-relaxed line-clamp-3">{{ item.desc }}</p>
                </div>
              </div>
            </div>
            
            <!-- Glow effect for center phone -->
            <div v-if="index === phoneIndex" class="absolute -inset-10 bg-[#CCFF00]/10 blur-[100px] -z-10 rounded-full animate-pulse"></div>
          </div>
        </div>

        <!-- Carousel Indicators -->
        <div class="absolute bottom-24 flex gap-4 z-30">
          <div 
            v-for="(dot, idx) in aiSteps" 
            :key="'pdot-'+idx"
            class="w-12 h-1 rounded-full transition-all duration-500"
            :class="idx === phoneIndex ? 'bg-[#CCFF00]' : 'bg-white/10'"
          ></div>
        </div>

        <!-- Step 2 Action Button (Red Style with Mouse Click) -->
        <div class="absolute bottom-16 right-16 z-30">
          <button 
            class="group relative flex items-center justify-center px-14 py-5 bg-gradient-to-b from-[#FF4D4D] to-[#E60000] text-white rounded-2xl transition-all duration-1000 delay-500 shadow-[0_15px_50px_rgba(230,0,0,0.4)] border-b-[6px] border-[#990000] animate-button-press"
            :class="activeStep === 2 ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-20 opacity-0 pointer-events-none'"
            @click="nextStep"
          >
            <span class="text-3xl font-black uppercase tracking-tight text-[#FFFF00] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">VÀO HỌC NGAY</span>
            
            <!-- Click Ripple Effect -->
            <div class="absolute inset-0 bg-white/40 rounded-2xl opacity-0 animate-click-ripple"></div>

            <!-- Mouse Cursor Animation Overlay -->
            <div class="absolute -right-8 -bottom-8 pointer-events-none animate-mouse-click">
              <Icon name="ph:cursor-fill" class="text-white text-5xl rotate-[-20deg] drop-shadow-[0_0_15px_rgba(0,150,255,0.9)]" />
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- PERSISTENT ROBOT LAYER (Active in Step 1, 2, and 3) -->
    <div 
      class="absolute inset-0 z-40 pointer-events-none transition-all duration-[1500ms] ease-in-out"
      :class="[
        activeStep >= 1 && activeStep <= 3 ? 'opacity-100' : 'opacity-0',
      ]"
    >
      <img 
        :src="robotAsset" 
        class="absolute top-1/2 -translate-y-1/2 w-[200px] h-auto transition-all duration-[2000ms] ease-in-out"
        :style="{
          right: activeStep === 2 ? 'calc(100% - 300px)' : '5%',
          transform: activeStep === 2 ? 'translateY(50%) rotateY(180deg)' : `translateY(-50%)`,
          filter: activeStep === 2 ? 'drop-shadow(0 0 50px rgba(204,255,0,0.5))' : 'none'
        }"
      />
    </div>

    <!-- STEP 3: SVG CONTENT -->
    <div 
      class="absolute inset-0 z-20 transition-opacity duration-1000 bg-black flex items-center justify-center"
      :class="activeStep === 3 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
    >
      <img 
        :src="asset3" 
        class="w-full h-full object-contain opacity-80"
      />
    </div>

    <!-- STEP 4: FOOTER -->
    <Transition name="fade-in">
      <div v-show="activeStep === 4" class="absolute inset-0 z-30 bg-black flex flex-col justify-center items-center">
        <div class="max-w-4xl text-center space-y-12 px-6">
          <h2 class="text-7xl font-black uppercase tracking-tighter">Sẵn sàng bắt đầu?</h2>
          <p class="text-slate-400 text-xl">Liên hệ với chúng tôi để nhận tư vấn giải pháp AI tối ưu cho doanh nghiệp của bạn.</p>
          <div class="flex flex-wrap justify-center gap-6">
            <button class="px-12 py-6 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-sm rounded-full">Liên hệ ngay</button>
            <button class="px-12 py-6 border border-white/20 text-white font-black uppercase tracking-widest text-sm rounded-full">Xem tài liệu</button>
          </div>
        </div>
        
        <!-- Mini Footer -->
        <div class="absolute bottom-12 w-full px-12 flex justify-between items-center text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">
          <div>© 2026 BINEX TECHNOLOGY</div>
          <div class="flex gap-8">
            <a href="#" class="hover:text-white">Privacy</a>
            <a href="#" class="hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </Transition>

    <!-- GLOBAL PROGRESS INDICATOR -->
    <div class="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-50">
      <div 
        v-for="i in totalSteps" 
        :key="'dot-'+i"
        class="w-1.5 rounded-full transition-all duration-500 cursor-pointer"
        :class="activeStep === i-1 ? 'h-8 bg-[#CCFF00] shadow-[0_0_15px_#CCFF00]' : 'h-1.5 bg-white/20'"
        @click="activeStep = i-1"
      ></div>
    </div>
  </div>
</template>

<style scoped>
/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 1.2s cubic-bezier(0.23, 1, 0.32, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: scale(1.1);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.content-swap-enter-active,
.content-swap-leave-active {
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.content-swap-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.content-swap-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 12s linear infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.05); }
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}

@keyframes mouse-click {
  0% { transform: translate(50px, 50px) scale(1.2); opacity: 0; }
  20% { transform: translate(0, 0) scale(1.2); opacity: 1; }
  40% { transform: translate(0, 0) scale(0.85); }
  50% { transform: translate(0, 0) scale(1.2); }
  100% { transform: translate(0, 0) scale(1.2); opacity: 1; }
}

@keyframes button-press {
  0%, 38% { transform: scale(1); }
  40% { transform: scale(0.96); }
  45%, 100% { transform: scale(1); }
}

@keyframes click-ripple {
  0%, 38% { transform: scale(0.5); opacity: 0; }
  40% { transform: scale(1); opacity: 1; }
  60% { transform: scale(1.4); opacity: 0; }
  100% { opacity: 0; }
}

.animate-mouse-click { animation: mouse-click 3s infinite; }
.animate-button-press { animation: button-press 3s infinite; }
.animate-click-ripple { animation: click-ripple 3s infinite; }

/* Custom button hover effect */
.group:hover .group-hover\:translate-x-0 {
  transform: translateX(0);
}
</style>
