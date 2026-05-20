<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: false,
  path: '/register'
});

const card = ref(null);
const rotateX = ref(0);
const rotateY = ref(0);
const shineX = ref(0);
const shineY = ref(0);
const isHovering = ref(false);

const handleMouseMove = (e) => {
  if (!card.value) return;
  const rect = card.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  rotateY.value = ((x - centerX) / centerX) * 10;
  rotateX.value = ((centerY - y) / centerY) * 10;
  shineX.value = (x / rect.width) * 100;
  shineY.value = (y / rect.height) * 100;
};

const userName = ref('');
const password = ref('');
const code = ref('');
const loading = ref(false);
const status = ref({ type: '', message: '' });

const handleRegister = async () => {
  loading.value = true;
  status.value = { type: '', message: '' };
  
  try {
    // Simulated registration
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    status.value = { 
      type: 'success', 
      message: 'Đăng ký tài khoản thành công! Đang chuyển hướng...' 
    };
    
    setTimeout(() => {
      navigateTo('/login');
    }, 2000);
    
  } catch (err) {
    console.error('Registration error:', err);
    status.value = { 
      type: 'error', 
      message: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.' 
    };
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="fixed inset-0 min-h-screen flex items-center justify-center bg-surface overflow-hidden perspective-1000">
    <!-- Animated 3D Background Elements -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] animate-pulse" style="animation-delay: 2s"></div>
      
      <div v-for="n in 6" :key="n" 
        class="absolute w-24 h-24 border border-secondary/10 rounded-2xl animate-float-3d"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${15 + Math.random() * 10}s`,
          animationDelay: `${-Math.random() * 10}s`
        }"
      ></div>
    </div>

    <!-- 3D Register Card -->
    <div 
      ref="card"
      class="relative z-10 w-full max-w-md mx-4 transition-all duration-200 ease-out preserve-3d"
      :style="{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovering ? 1.02 : 1})`
      }"
      @mousemove="handleMouseMove"
      @mouseenter="isHovering = true"
      @mouseleave="() => { isHovering = false; rotateX = 0; rotateY = 0; }"
    >
      <div class="relative overflow-hidden rounded-[2.5rem] bg-surface/40 backdrop-blur-2xl border border-white/10 shadow-2xl p-8 md:p-12">
        <!-- Shine layer -->
        <div 
          class="absolute inset-0 pointer-events-none opacity-30 transition-opacity duration-300"
          :class="isHovering ? 'opacity-30' : 'opacity-0'"
          :style="{
            background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.4) 0%, transparent 50%)`
          }"
        ></div>

        <!-- Header -->
        <div class="flex flex-col items-center mb-8 translate-z-20">
          <div class="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/30 mb-6 animate-bounce-subtle">
            <Icon name="heroicons:user-plus" class="text-white text-3xl" />
          </div>
          <h1 class="text-3xl font-black tracking-tight uppercase mb-2">
            <span class="text-content">Tham gia</span><span class="text-secondary"> Binex</span><span class="text-content/40 text-sm ml-1 font-normal lowercase">admin</span>
          </h1>
          <p class="text-content/60 text-sm font-medium">Khởi đầu hành trình quản trị của bạn</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleRegister" class="space-y-5 translate-z-10">
          <!-- Status Message -->
          <Transition name="fade">
            <div v-if="status.message" 
              class="p-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all"
              :class="status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'"
            >
              {{ status.message }}
            </div>
          </Transition>

          <!-- Username -->
          <div class="space-y-1.5">
            <label class="block text-[10px] font-black uppercase tracking-widest text-content/40 ml-1">Tên đăng nhập</label>
            <div class="group relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-content/40 group-focus-within:text-secondary">
                <Icon name="heroicons:user" />
              </div>
              <input 
                v-model="userName"
                type="text" 
                required
                placeholder="Nhập tên đăng nhập..."
                class="w-full bg-surface/50 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-content placeholder:text-content/20 outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary/50 transition-all text-sm"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <label class="block text-[10px] font-black uppercase tracking-widest text-content/40 ml-1">Mật khẩu</label>
            <div class="group relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-content/40 group-focus-within:text-secondary">
                <Icon name="heroicons:lock-closed" />
              </div>
              <input 
                v-model="password"
                type="password" 
                required
                placeholder="••••••••"
                class="w-full bg-surface/50 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-content placeholder:text-content/20 outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary/50 transition-all text-sm"
              />
            </div>
          </div>

          <!-- Referral/Invitation Code -->
          <div class="space-y-1.5">
            <label class="block text-[10px] font-black uppercase tracking-widest text-content/40 ml-1">Mã mời (Referral Code)</label>
            <div class="group relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-content/40 group-focus-within:text-secondary">
                <Icon name="heroicons:qr-code" />
              </div>
              <input 
                v-model="code"
                type="text" 
                required
                placeholder="Nhập mã mời của bạn"
                class="w-full bg-surface/50 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-content placeholder:text-content/20 outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary/50 transition-all text-sm"
              />
            </div>
          </div>

          <!-- Register Button -->
          <button 
            type="submit"
            :disabled="loading"
            class="relative w-full overflow-hidden group mt-4 py-4 rounded-2xl bg-secondary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-secondary/20 transition-all active:scale-95 disabled:opacity-70"
          >
            <div v-if="loading" class="flex items-center justify-center gap-2">
              <Icon name="svg-spinners:ring-resize" class="text-xl" />
              <span>Đang đăng ký...</span>
            </div>
            <span v-else class="flex items-center justify-center gap-2">
              <span>Đăng ký ngay</span>
              <Icon name="heroicons:rocket-launch" class="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
            <div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg]"></div>
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-white/5 text-center translate-z-10">
          <p class="text-content/40 text-sm">
            Đã có tài khoản? 
            <NuxtLink to="/login" class="text-secondary font-bold hover:underline">Đăng nhập</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective-1000 { perspective: 1000px; }
.preserve-3d { transform-style: preserve-3d; }
.translate-z-10 { transform: translateZ(10px); }
.translate-z-20 { transform: translateZ(20px); }

@keyframes float-3d {
  0% { transform: translateZ(0) rotate(0deg) translateY(0); }
  33% { transform: translateZ(50px) rotate(120deg) translateY(-20px); }
  66% { transform: translateZ(-30px) rotate(240deg) translateY(20px); }
  100% { transform: translateZ(0) rotate(360deg) translateY(0); }
}

.animate-float-3d {
  animation: float-3d linear infinite;
  transform-style: preserve-3d;
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce-subtle {
  animation: bounce-subtle 4s ease-in-out infinite;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
