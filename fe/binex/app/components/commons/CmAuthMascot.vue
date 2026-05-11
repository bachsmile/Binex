<script setup lang="ts">
defineProps<{
  mode: 'login' | 'register'
}>();
</script>

<template>
  <div class="relative flex items-center justify-center">
    <!-- Hào quang nền thay đổi theo mode -->
    <div 
      class="absolute inset-0 blur-[60px] opacity-30 transition-colors duration-700"
      :class="mode === 'login' ? 'bg-[#CCFF00]' : 'bg-blue-400'"
    ></div>

    <!-- Hình ảnh linh thú -->
    <div class="relative z-10 animate-float" :key="mode">
      <img 
        :src="mode === 'login' ? '/img/mascot_login.png?v=1' : '/img/mascot_register.png?v=1'" 
        class="w-32 md:w-48 h-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500" 
        @error="(e) => console.error('[Mascot] Load error:', e)"
        alt="Binex Mascot" 
      />
      
      <!-- Overlay biểu tượng nhỏ tùy theo mode -->
      <div 
        class="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-md transition-all duration-500"
        :class="mode === 'login' ? 'bg-[#CCFF00] text-black' : 'bg-blue-500 text-white'"
      >
        <Icon :name="mode === 'login' ? 'ph:key-fill' : 'ph:user-plus-fill'" size="20" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}
</style>
