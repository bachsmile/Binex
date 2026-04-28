<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const videoRef = ref<HTMLVideoElement | null>(null);
const videoOpacity = ref(0);

onMounted(() => {
  let animationFrameId: number;

  const checkVideoTime = () => {
    if (videoRef.value) {
      const video = videoRef.value;
      const currentTime = video.currentTime;
      const duration = video.duration;

      if (!isNaN(duration)) {
        if (currentTime < 0.5) {
          // Fade in over 0.5s at the start
          videoOpacity.value = currentTime / 0.5;
        } else if (duration - currentTime < 0.5) {
          // Fade out over 0.5s before the end
          videoOpacity.value = (duration - currentTime) / 0.5;
        } else {
          // Fully visible
          videoOpacity.value = 1;
        }
      }
    }
    animationFrameId = requestAnimationFrame(checkVideoTime);
  };

  animationFrameId = requestAnimationFrame(checkVideoTime);

  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId);
  });
});

const onVideoEnded = () => {
  if (videoRef.value) {
    videoOpacity.value = 0;
    setTimeout(() => {
      if (videoRef.value) {
        videoRef.value.currentTime = 0;
        videoRef.value.play();
      }
    }, 100);
  }
};
</script>

<template>
  <div class="relative min-h-screen w-full overflow-hidden bg-white font-sans">
    
    <!-- Background Video Layer (z-0) -->
    <div class="absolute inset-0 z-0 pointer-events-none" style="top: 300px; inset: auto 0 0 0;">
      <video
        ref="videoRef"
        class="w-full h-full object-cover transition-opacity duration-75"
        :style="{ opacity: videoOpacity }"
        autoplay
        muted
        playsinline
        @ended="onVideoEnded"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4" type="video/mp4" />
      </video>
    </div>

    <!-- Gradient Overlay -->
    <div class="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-white via-transparent to-white"></div>

    <!-- Navigation bar (z-10) -->
    <nav class="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
      <div class="text-3xl tracking-tight font-serif text-black">Aethera<sup>&reg;</sup></div>
      <div class="hidden md:flex gap-8 text-sm">
        <a href="#" class="text-black transition-colors">Home</a>
        <a href="#" class="text-[#6F6F6F] hover:text-black transition-colors">Studio</a>
        <a href="#" class="text-[#6F6F6F] hover:text-black transition-colors">About</a>
        <a href="#" class="text-[#6F6F6F] hover:text-black transition-colors">Journal</a>
        <a href="#" class="text-[#6F6F6F] hover:text-black transition-colors">Reach Us</a>
      </div>
      <button class="bg-black text-white rounded-full px-6 py-2.5 text-sm hover:scale-105 transition-transform duration-300">Begin Journey</button>
    </nav>

    <!-- Hero Section (z-10) -->
    <div class="relative z-10 flex flex-col items-center justify-center text-center px-6" style="padding-top: calc(8rem - 75px); padding-bottom: 10rem;">
      <h1 class="text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal font-serif leading-[0.95] text-black tracking-[-2.46px] animate-fade-rise opacity-0">
        Beyond <span class="italic text-[#6F6F6F]">silence,</span> we build <span class="italic text-[#6F6F6F]">the eternal.</span>
      </h1>
      
      <p class="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-[#6F6F6F] animate-fade-rise-delay opacity-0">
        Building platforms for brilliant minds, fearless makers, and thoughtful souls. Through the noise, we craft digital havens for deep work and pure flows.
      </p>
      
      <button class="bg-black text-white rounded-full px-14 py-5 text-base mt-12 hover:scale-105 transition-transform duration-300 animate-fade-rise-delay-2 opacity-0">
        Begin Journey
      </button>
    </div>

  </div>
</template>
