<script setup lang="ts">
import { ref } from 'vue';
import { useAuthApi } from '~/api/auth';
import type { LoginDto } from '~/types/payload/auth';

definePageMeta({
  layout: false
});

const card = ref<HTMLElement | null>(null);
const rotateX = ref(0);
const rotateY = ref(0);
const shineX = ref(0);
const shineY = ref(0);
const isHovering = ref(false);

const handleMouseMove = (e: MouseEvent) => {
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

const handleMouseEnter = () => {
  isHovering.value = true;
};

const handleMouseLeave = () => {
  isHovering.value = false;
  rotateX.value = 0;
  rotateY.value = 0;
};

const showPassword = ref(false);
const userName = ref('');
const password = ref('');
const loginError = ref<string | null>(null);
const isLoading = ref(false);

// Sử dụng API service tự động
const authApi = useAuthApi();

const handleLogin = async () => {
  loginError.value = null;
  isLoading.value = true;
  try {
    const payload: LoginDto = {
      userName: userName.value,
      password: password.value
    };
    
    const response = await authApi.login(payload);
    
    // Store token in cookie
    const token = useCookie('auth_token', {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });
    token.value = response.accessToken;
    
    // Success redirect
    useRouter().push('/');
  } catch (err: any) {
    loginError.value = err?.data?.message || 'Đăng nhập thất bại';
    console.error('Login error:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="login-page min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
    <!-- Video Background -->
    <video
      class="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
      autoplay
      loop
      muted
      playsinline
    >
      <source
        src="/mp4/bggr1.mp4"
        type="video/mp4"
      />
    </video>

    <!-- Animated Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-[#FF1B6B]/10 via-transparent to-black/60 z-1"></div>

    <!-- Login Container -->
    <div 
      class="relative z-10 w-full max-w-md px-6 animate-fade-in perspective-1000"
      @mousemove="handleMouseMove"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div 
        ref="card"
        class="glass-card overflow-hidden rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 transition-transform duration-200 ease-out relative"
        :style="{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }"
      >
        <!-- Shine Effect -->
        <div 
          v-if="isHovering"
          class="absolute inset-0 pointer-events-none z-10 opacity-30 transition-opacity duration-300"
          :style="{
            background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.8) 0%, transparent 50%)`
          }"
        ></div>

        <!-- Brand Logo -->
        <div class="flex flex-col items-center mb-10">
          <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#FF1B6B] to-[#D4145A] flex items-center justify-center shadow-[0_0_30px_rgba(255,27,107,0.5)] mb-6 ring-4 ring-white/10 group-hover:scale-110 transition-transform duration-500">
            <Icon name="heroicons:heart-20-solid" class="text-white text-4xl" />
          </div>
          <h1 class="text-4xl font-black tracking-tighter text-white uppercase">
            BI<span class="text-[#FF416C]">NEX</span>
          </h1>
          <div class="h-1 w-12 bg-gradient-to-r from-[#FF1B6B] to-[#D4145A] rounded-full mt-2"></div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div v-if="loginError" class="bg-red-500/20 border border-red-500/50 text-red-100 text-xs py-3 px-4 rounded-xl text-center animate-shake">
            {{ loginError }}
          </div>

          <!-- Input Username -->
          <div class="space-y-2 group">
            <label class="text-[10px] uppercase font-bold tracking-[0.2em] text-white/50 ml-2">Tên đăng nhập</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#FF1B6B] transition-colors">
                <Icon name="heroicons:user-circle" class="text-xl" />
              </div>
              <input
                v-model="userName"
                type="text"
                required
                placeholder="Nhập tên đăng nhập"
                class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:bg-white/10 focus:border-[#FF1B6B]/50 focus:ring-4 focus:ring-[#FF1B6B]/10 transition-all duration-300"
              />
            </div>
          </div>

          <!-- Input Password -->
          <div class="space-y-2 group">
            <label class="text-[10px] uppercase font-bold tracking-[0.2em] text-white/50 ml-2">Mật khẩu</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#FF1B6B] transition-colors">
                <Icon name="heroicons:lock-closed" class="text-xl" />
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/20 outline-none focus:bg-white/10 focus:border-[#FF1B6B]/50 focus:ring-4 focus:ring-[#FF1B6B]/10 transition-all duration-300"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
              >
                <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" />
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between px-1">
            <label class="flex items-center space-x-2 cursor-pointer group">
              <input type="checkbox" class="accent-[#FF1B6B] w-4 h-4 rounded border-white/20 bg-white/10" />
              <span class="text-xs text-white/60 group-hover:text-white transition-colors">Ghi nhớ</span>
            </label>
            <a href="#" class="text-[10px] uppercase font-bold text-[#FF416C] hover:text-[#FF1B6B] tracking-wider transition-colors">Quên mật khẩu?</a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full relative group overflow-hidden bg-gradient-to-r from-[#FF1B6B] to-[#D4145A] py-4 rounded-2xl text-white font-bold text-sm uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(255,27,107,0.3)] hover:shadow-[0_15px_30px_rgba(255,27,107,0.5)] transition-all duration-300 active:scale-95 disabled:opacity-50"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <Icon name="svg-spinners:ring-resize" class="text-xl" />
              <span>Đang xử lý...</span>
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <span>Đăng nhập</span>
              <Icon name="heroicons:arrow-right-20-solid" class="group-hover:translate-x-1 transition-transform" />
            </span>
            <div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]"></div>
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-12 text-center">
          <p class="text-white/40 text-sm">
            Chưa có tài khoản?
            <NuxtLink to="/register" class="text-white font-bold hover:text-[#FF1B6B] transition-colors underline-offset-4 hover:underline decoration-[#FF1B6B]">Đăng ký ngay</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;900&display=swap');

.login-page {
  font-family: 'Outfit', sans-serif;
}

.perspective-1000 {
  perspective: 1000px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  transform-style: preserve-3d;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>