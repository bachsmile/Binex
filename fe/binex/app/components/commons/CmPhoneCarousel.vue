<script setup lang="ts">
interface CarouselItem {
  id: number | string
  label: string
  title: string
  desc: string
  image: string
  to?: any
}

const props = defineProps<{
  items: CarouselItem[]
  activeStep?: number
  buttonText?: string
}>()

const emit = defineEmits(['action'])

const phoneIndex = ref(0)

const nextPhone = () => {
  phoneIndex.value = (phoneIndex.value + 1) % props.items.length
}

const prevPhone = () => {
  phoneIndex.value = (phoneIndex.value - 1 + props.items.length) % props.items.length
}
</script>

<template>
  <div class="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden py-20">
    <!-- Main Carousel -->
    <div class="relative w-full max-w-7xl h-[600px] flex items-center justify-center">
      <div 
        v-for="(item, index) in items" 
        :key="'phone-'+item.id"
        class="absolute transition-all duration-1000 ease-out cursor-pointer group"
        :style="(() => {
          const total = items.length;
          let diff = (index - phoneIndex + total) % total;
          if (diff > total / 2) diff -= total;
          
          return {
            transform: `translateX(${diff * 350}px) scale(${index === phoneIndex ? 1.1 : 0.7})`,
            zIndex: index === phoneIndex ? 50 : 40 - Math.abs(diff),
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
            <slot name="item" :item="item" :index="index">
              <img :src="item.image" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              
              <!-- Default Overlay Text -->
              <div class="absolute bottom-10 left-6 right-6 text-left">
                <p class="text-[#CCFF00] text-[8px] font-black tracking-widest uppercase mb-2">{{ item.label }}</p>
                <h4 class="text-xl font-black uppercase leading-tight mb-2">{{ item.title }}</h4>
                <p class="text-white/50 text-[9px] leading-relaxed line-clamp-3 mb-4">{{ item.desc }}</p>

                <NuxtLink 
                  v-if="item.to"
                  :to="item.to"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-[#CCFF00] hover:text-black backdrop-blur-md rounded-full border border-white/10 transition-all duration-300 pointer-events-auto"
                >
                  <span class="text-[8px] font-bold uppercase tracking-wider">Khám phá</span>
                  <Icon name="ph:arrow-up-right-bold" size="10" />
                </NuxtLink>
              </div>
            </slot>
          </div>
        </div>
        
        <!-- Glow effect for center phone -->
        <div v-if="index === phoneIndex" class="absolute -inset-10 bg-[#CCFF00]/10 blur-[100px] -z-10 rounded-full animate-pulse"></div>
      </div>
    </div>

    <!-- Carousel Indicators -->
    <div class="absolute bottom-24 flex gap-4 z-30">
      <div 
        v-for="(dot, idx) in items" 
        :key="'pdot-'+idx"
        class="w-12 h-1 rounded-full transition-all duration-500 cursor-pointer hover:bg-white/30"
        :class="idx === phoneIndex ? 'bg-[#CCFF00]' : 'bg-white/10'"
        @click="phoneIndex = idx"
      ></div>
    </div>

    <!-- Action Button (Red Style with Mouse Click) -->
    <div v-if="buttonText" class="absolute bottom-16 right-16 z-30">
      <button 
        class="group relative flex items-center justify-center px-14 py-5 bg-gradient-to-b from-[#FF4D4D] to-[#E60000] text-white rounded-2xl shadow-[0_15px_50px_rgba(230,0,0,0.4)] border-b-[6px] border-[#990000] animate-button-press transition-all hover:scale-105 active:border-b-0 active:translate-y-1"
        @click="emit('action')"
      >
        <span class="text-3xl font-black uppercase tracking-tight text-[#FFFF00] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">{{ buttonText }}</span>
        
        <!-- Click Ripple Effect -->
        <div class="absolute inset-0 bg-white/40 rounded-2xl opacity-0 animate-click-ripple"></div>

        <!-- Mouse Cursor Animation Overlay -->
        <div class="absolute -right-8 -bottom-8 pointer-events-none animate-mouse-click">
          <Icon name="ph:cursor-fill" class="text-white text-5xl rotate-[-20deg] drop-shadow-[0_0_15px_rgba(0,150,255,0.9)]" />
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
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
</style>
