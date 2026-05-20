<script setup lang="ts">
import CiHeader from "~/components/integrations/CiHeader.vue";
import { gsap } from "gsap";
import st4 from "@/assets/img/pt4.svg";
import CmPhoneCarousel from "~/components/commons/CmPhoneCarousel.vue";

definePageMeta({
  layout: "falling",
  path: "/demo",
});

const video1 = "/";
const video2 = "/";
const video3 = "/";
const asset3 = "/";
const asset4 = "/";
const robotAsset = "/";

const videoPlayer = ref<HTMLVideoElement | null>(null);
const videoPlayer2 = ref<HTMLVideoElement | null>(null);
const videoPlayer3 = ref<HTMLVideoElement | null>(null);
const isMuted = ref(true);
const videoEnded = ref(false);

const activeStep = ref(3); // 0: Video 1, 1: Video 2, 2: Video 3, 3: Footer
const activeIndex = ref<number | null>(null);

// Restart video when step changes
watch(activeStep, (newStep) => {
  if (newStep === 0 && videoPlayer.value) {
    videoPlayer.value.currentTime = 0;
    videoPlayer.value.play();
  } else if (newStep === 1 && videoPlayer2.value) {
    videoPlayer2.value.currentTime = 0;
    videoPlayer2.value.play();
  } else if (newStep === 2 && videoPlayer3.value) {
    videoPlayer3.value.currentTime = 0;
    videoPlayer3.value.play();
  }
});
const scrollyContainer = ref<HTMLElement | null>(null);
const isAnimating = ref(false);
const scrollAttempts = ref(0);

const totalSteps = 5;
const carouselCount = ref(0); // Track how many times they've spun the carousel

const nextStep = () => {
  if (activeStep.value < totalSteps - 1 && !isAnimating.value) {
    if (activeStep.value === 0 && !videoEnded.value) {
      scrollAttempts.value++;
      if (scrollAttempts.value < 2) return;
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

    isAnimating.value = true;
    activeStep.value++;
    setTimeout(() => {
      isAnimating.value = false;
    }, 800);
  }
};

const prevStep = () => {
  if (activeStep.value > 0 && !isAnimating.value) {
    // Infinite Internal Carousel Logic for Step 2
    // if (activeStep.value === 2) {
    //   phoneIndex.value = (phoneIndex.value - 1 + 5) % 5
    //   return
    // }

    isAnimating.value = true;
    activeStep.value--;
    setTimeout(() => {
      isAnimating.value = false;
    }, 800);
  }
};

const handleWheel = (e: WheelEvent) => {
  if (isAnimating.value) return;

  // Prevent default scroll behavior for zero-scroll app
  if (e.cancelable) e.preventDefault();

  if (e.deltaY > 0) {
    nextStep();
  } else if (e.deltaY < 0) {
    prevStep();
  }
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  if (videoPlayer.value) {
    videoPlayer.value.muted = isMuted.value;
  }
};

const onVideoEnded = () => {
  videoEnded.value = true;
  // Loop manually so we can still catch the first completion
  if (videoPlayer.value) {
    videoPlayer.value.play();
  }
};

const enterSite = () => {
  nextStep();
};
const svgClickRef = ref();
const svgClick = () => {};
onMounted(() => {
  document.body.style.overflow = "hidden";

  if (videoPlayer.value) {
    videoPlayer.value.play().catch((e) => console.log("Autoplay blocked", e));
    videoPlayer.value.addEventListener("ended", onVideoEnded);
  }

  window.addEventListener("wheel", handleWheel, { passive: false });
  const groups = svgClickRef.value?.$el?.querySelectorAll("svg > g");

  groups.forEach((g: SVGGElement, index: number) => {
    g.addEventListener("click", () => {
      if (activeIndex.value === index) {
        // TẮT: Quay lại trạng thái ban đầu
        activeIndex.value = null;
        groups.forEach((otherG: SVGGElement) => {
          gsap.to(otherG, {
            opacity: 1,
            pointerEvents: "auto",
            duration: 0.5,
            ease: "power2.inOut",
          });
        });
        gsap.to(g, {
          x: 0,
          y: 0,
          yPercent: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.inOut",
        });
      } else if (activeIndex.value === null) {
        // BẬT: Tập trung vào group này và ẩn các thành phần khác
        activeIndex.value = index;
        const rect = g.getBoundingClientRect();
        const scale = 1.5;
        const targetX = window.innerWidth - rect.width * scale;
        console.log(window.innerWidth, rect.width * scale, targetX, rect.left);

        const moveX = targetX - rect.right;
        const moveY = window.innerHeight / 2 - (rect.top + rect.height / 2);

        groups.forEach((otherG: SVGGElement, i: number) => {
          if (i !== index) {
            gsap.to(otherG, {
              opacity: 0,
              pointerEvents: "none",
              duration: 0.5,
              ease: "power2.inOut",
            });
          }
        });

        gsap.to(g, {
          x: moveX,
          y: moveY,
          yPercent: -50,
          duration: 0.5,
          scale: scale,
          ease: "power2.inOut",
        });
      }
    });

    g.addEventListener("mouseenter", () => {
      // Chặn hover nếu đang có group được phóng to
      if (activeIndex.value !== null) return;
      gsap.to(g, {
        y: -20,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    g.addEventListener("mouseleave", () => {
      // Chặn hover nếu đang có group được phóng to
      if (activeIndex.value !== null) return;
      gsap.to(g, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
});

onUnmounted(() => {
  document.body.style.overflow = "auto";
  window.removeEventListener("wheel", handleWheel);
});

// Data for AI steps (moved here for cleaner script)
const aiSteps = [
  {
    id: 1,
    label: "TỰ ĐỘNG HÓA",
    title: "Tự động hóa thông minh",
    desc: "Hệ thống AI tự động hóa các quy trình phức tạp, giúp doanh nghiệp tiết kiệm 70% thời gian vận hành.",
    image: "/img/tech_automation_1778145250016.png",
  },
  {
    id: 2,
    label: "KẾT NỐI",
    title: "Kết nối không giới hạn",
    desc: "Xây dựng mạng lưới liên kết dữ liệu thời gian thực, cho phép các bộ phận phối hợp nhịp nhàng.",
    image: "/img/tech_connectivity_1778145265728.png",
  },
  {
    id: 3,
    label: "HỆ SINH THÁI",
    title: "Hệ sinh thái bền vững",
    desc: "Tích hợp toàn diện các giải pháp vào một nền tảng duy nhất, tạo ra môi trường làm việc số hiện đại.",
    image: "/img/tech_ecosystem_1778145281406.png",
  },
  {
    id: 4,
    label: "PHÂN TÍCH",
    title: "Phân tích dữ liệu lớn",
    desc: "Xử lý hàng triệu dòng dữ liệu mỗi giây để đưa ra những dự báo chính xác về xu hướng thị trường.",
    image: "/img/tech_automation_1778145250016.png",
  },
  {
    id: 5,
    label: "BẢO MẬT",
    title: "Bảo mật đa tầng",
    desc: "Bảo vệ tài sản số của doanh nghiệp bằng công nghệ mã hóa tiên tiến nhất hiện nay.",
    image: "/img/tech_connectivity_1778145265728.png",
  },
];
</script>

<template>
  <div
    class="relative h-screen w-screen bg-black overflow-hidden font-inter text-white"
  >
    <img
      src="/web demo.png"
      class="absolute top-10 left-10 w-40 h-auto z-50 pointer-events-none"
    />
    <CiHeader class="z-50" />

    <!-- STEP 0: VIDEO 1 -->
    <div
      class="absolute inset-0 z-10 transition-opacity duration-1000"
      :class="
        activeStep === 0
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      "
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
            <div
              class="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 animate-pulse"
            >
              <Icon name="ph:lock-key-fill" class="text-[#CCFF00]" />
              <span
                class="text-[9px] font-black uppercase tracking-[0.2em] text-white/70"
                >Đang giới thiệu...</span
              >
            </div>
            <p
              v-if="scrollAttempts > 0"
              class="text-[10px] text-[#CCFF00] font-bold text-center animate-bounce"
            >
              Cuộn thêm một lần để bỏ qua
            </p>
          </div>
          <button
            v-else
            @click="enterSite"
            class="group flex items-center gap-6 px-10 py-5 bg-[#CCFF00] text-black rounded-full transition-all duration-700 hover:scale-105 shadow-[0_0_30px_rgba(204,255,0,0.3)]"
          >
            <span class="text-xs font-black uppercase tracking-[0.3em]"
              >Bắt đầu khám phá</span
            >
            <Icon
              name="ph:arrow-right-bold"
              class="group-hover:translate-x-2 transition-transform"
            />
          </button>
        </Transition>
      </div>
    </div>

    <!-- STEP 1: VIDEO 2 -->
    <div
      class="absolute inset-0 z-20 transition-opacity duration-1000"
      :class="
        activeStep === 1
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      "
    >
      <video
        ref="videoPlayer2"
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
      :class="
        activeStep === 2
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      "
    >
      <video
        ref="videoPlayer3"
        :src="video3"
        class="absolute inset-0 w-full h-full object-cover pointer-events-none"
        autoplay
        loop
        muted
        playsinline
      ></video>

      <CmPhoneCarousel 
        :items="aiSteps" 
        button-text="VÀO HỌC NGAY"
        @action="nextStep"
      />
    </div>

    <!-- PERSISTENT ROBOT LAYER (Active in Step 1, 2, and 3) -->
    <div
      class="absolute inset-0 z-40 pointer-events-none transition-all duration-[1500ms] ease-in-out"
      :class="[
        activeStep >= 1 && activeStep <= 2 ? 'opacity-100' : 'opacity-0',
      ]"
    >
      <img
        :src="robotAsset"
        class="absolute top-1/2 -translate-y-1/2 w-[200px] h-auto transition-all duration-[2000ms] ease-in-out"
        :style="{
          right: activeStep === 2 ? 'calc(100% - 300px)' : '5%',
          transform:
            activeStep === 2
              ? 'translateY(50%) rotateY(180deg)'
              : `translateY(-50%)`,
          filter:
            activeStep === 2
              ? 'drop-shadow(0 0 50px rgba(204,255,0,0.5))'
              : 'none',
        }"
      />
    </div>

    <!-- GLOBAL ACTION BUTTON LAYER (Active in Step 1 & 2) -->
    <div
      class="absolute bottom-16 right-16 z-50 transition-all duration-1000"
      :class="
        activeStep === 1 || activeStep === 2
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-20 opacity-0 pointer-events-none'
      "
    >
      <button
        class="group relative flex items-center justify-center px-14 py-5 bg-gradient-to-b from-[#FF4D4D] to-[#E60000] text-white rounded-2xl shadow-[0_15px_50px_rgba(230,0,0,0.4)] border-b-[6px] border-[#990000] animate-button-press"
        @click="nextStep"
      >
        <span
          class="text-3xl font-black uppercase tracking-tight text-[#FFFF00] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
          >VÀO HỌC NGAY</span
        >

        <!-- Click Ripple Effect -->
        <div
          class="absolute inset-0 bg-white/40 rounded-2xl opacity-0 animate-click-ripple"
        ></div>

        <!-- Mouse Cursor Animation Overlay -->
        <div
          class="absolute -right-8 -bottom-8 pointer-events-none animate-mouse-click"
        >
          <Icon
            name="ph:cursor-fill"
            class="text-white text-5xl rotate-[-20deg] drop-shadow-[0_0_15px_rgba(0,150,255,0.9)]"
          />
        </div>
      </button>
    </div>

    <!-- STEP 3: SVG CONTENT -->
    <div
      class="absolute inset-0 z-20 transition-opacity duration-1000 bg-black flex items-center justify-center"
      :class="
        activeStep === 3
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      "
    >
      <img :src="asset3" class="absolute inset-0 w-full h-full object-cover" />
      <st4
        ref="svgClickRef"
        class="relative z-10 max-w-full max-h-full"
        style="overflow: visible"
        @click="svgClick"
      />
    </div>

    <!-- STEP 4: FOOTER -->
    <Transition name="fade-in">
      <div
        v-show="activeStep === 4"
        class="absolute inset-0 z-30 bg-black flex flex-col justify-center items-center"
      >
        <div class="max-w-4xl text-center space-y-12 px-6">
          <h2 class="text-7xl font-black uppercase tracking-tighter">
            Sẵn sàng bắt đầu?
          </h2>
          <p class="text-slate-400 text-xl">
            Liên hệ với chúng tôi để nhận tư vấn giải pháp AI tối ưu cho doanh
            nghiệp của bạn.
          </p>
          <div class="flex flex-wrap justify-center gap-6">
            <button
              class="px-12 py-6 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-sm rounded-full"
            >
              Liên hệ ngay
            </button>
            <button
              class="px-12 py-6 border border-white/20 text-white font-black uppercase tracking-widest text-sm rounded-full"
            >
              Xem tài liệu
            </button>
          </div>
        </div>

        <!-- Mini Footer -->
        <div
          class="absolute bottom-12 w-full px-12 flex justify-between items-center text-white/20 text-[10px] font-black uppercase tracking-[0.5em]"
        >
          <div>© 2026 BINEX TECHNOLOGY</div>
          <div class="flex gap-8">
            <a href="#" class="hover:text-white">Privacy</a>
            <a href="#" class="hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </Transition>

    <!-- GLOBAL PROGRESS INDICATOR -->
    <div
      class="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-50"
    >
      <div
        v-for="i in totalSteps"
        :key="'dot-' + i"
        class="w-1.5 rounded-full transition-all duration-500 cursor-pointer"
        :class="
          activeStep === i - 1
            ? 'h-8 bg-[#CCFF00] shadow-[0_0_15px_#CCFF00]'
            : 'h-1.5 bg-white/20'
        "
        @click="activeStep = i - 1"
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
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 12s linear infinite;
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.05);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}

@keyframes mouse-click {
  0% {
    transform: translate(50px, 50px) scale(1.2);
    opacity: 0;
  }
  20% {
    transform: translate(0, 0) scale(1.2);
    opacity: 1;
  }
  40% {
    transform: translate(0, 0) scale(0.85);
  }
  50% {
    transform: translate(0, 0) scale(1.2);
  }
  100% {
    transform: translate(0, 0) scale(1.2);
    opacity: 1;
  }
}

@keyframes button-press {
  0%,
  38% {
    transform: scale(1);
  }
  40% {
    transform: scale(0.96);
  }
  45%,
  100% {
    transform: scale(1);
  }
}

@keyframes click-ripple {
  0%,
  38% {
    transform: scale(0.5);
    opacity: 0;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
  60% {
    transform: scale(1.4);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

.animate-mouse-click {
  animation: mouse-click 3s infinite;
}
.animate-button-press {
  animation: button-press 3s infinite;
}
.animate-click-ripple {
  animation: click-ripple 3s infinite;
}

/* Custom button hover effect */
.group:hover .group-hover\:translate-x-0 {
  transform: translateX(0);
}
</style>
