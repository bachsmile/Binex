<script setup lang="ts">
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Hệ sinh thái đang được cập nhật dữ liệu'
})
</script>

<template>
  <div class="flex flex-col items-center justify-center p-20 text-center animate-fade-in relative">
    <!-- Orbital Background Decoration -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-20">
      <div class="absolute inset-0 border border-white/10 rounded-full animate-[spin_30s_linear_infinite]"></div>
      <div class="absolute inset-20 border border-[#CCFF00]/10 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
    </div>

    <!-- Mascot Image -->
    <div class="relative mb-8 group">
      <div class="absolute inset-0 bg-[#CCFF00] blur-[150px] opacity-10"></div>
      <div class="relative z-10 animate-float">
        <img 
          src="/img/mascot_empty.png" 
          alt="Ecosystem Mascot Empty State"
          class="w-80 h-auto rounded-[3rem] shadow-2xl border border-white/5 relative z-10"
        />
      </div>
    </div>

    <!-- Message Content -->
    <div class="relative z-10">
      <h3 class="text-3xl font-black text-white uppercase tracking-[0.3em] mb-6">
        <span class="text-[#CCFF00]">Trống!</span> <br/>
        <span class="text-white/40 text-xl">{{ message }}</span>
      </h3>
      <div class="flex justify-center items-center gap-4">
        <div class="h-px w-12 bg-gradient-to-r from-transparent to-[#CCFF00]/40"></div>
        <div class="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></div>
        <div class="h-px w-12 bg-gradient-to-l from-transparent to-[#CCFF00]/40"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-15px) scale(1.02); }
}

.animate-fade-in {
  animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
