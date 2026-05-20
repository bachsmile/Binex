<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: false,
  path: '/login'
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
const loading = ref(false);
const error = ref('');

// Declare cookies synchronously at the top level of script setup
const tokenCookie = useCookie('auth_token', { maxAge: 604800, path: '/' });
const roleCookie = useCookie('user_role', { maxAge: 604800, path: '/' });
const codeCookie = useCookie('user_code', { maxAge: 604800, path: '/' });

const authApi = useAuthApi();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  const response = await authApi.login({
    userName: userName.value,
    password: password.value
  });
  
  loading.value = false;
 
  if (!response || !response.status) {
    const errMsg = authApi.error.value?.message;
    error.value = Array.isArray(errMsg)
      ? errMsg[0]
      : (errMsg || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    return;
  }
  
  const loginData = response.data;
  tokenCookie.value = loginData.accessToken;
  roleCookie.value = loginData.user?.role;
  codeCookie.value = loginData.user?.code;
  
  if (process.client) {
    document.cookie = `auth_token=${loginData.accessToken}; max-age=604800; path=/; SameSite=Lax`;
    document.cookie = `user_role=${loginData.user?.role}; max-age=604800; path=/; SameSite=Lax`;
    document.cookie = `user_code=${loginData.user?.code || ''}; max-age=604800; path=/; SameSite=Lax`;
  }
  
  // Success redirect
  navigateTo('/');
};
</script>

<template>
  <div class="fixed inset-0 min-h-screen flex items-center justify-center bg-surface overflow-hidden perspective-1000">
    <!-- Animated 3D Background Elements -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] animate-pulse" style="animation-delay: 2s"></div>
      
      <!-- Floating 3D-like particles -->
      <div v-for="n in 6" :key="n" 
        class="absolute w-24 h-24 border border-primary/10 rounded-2xl animate-float-3d"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${15 + Math.random() * 10}s`,
          animationDelay: `${-Math.random() * 10}s`
        }"
      ></div>
    </div>

    <!-- 3D Login Card -->
    <div 
      ref="card"
      class="relative z-10 w-full max-w-md mx-4 transition-all duration-200 ease-out preserve-3d"
      :style="{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovering ? 1.02 : 1})`
      }"
      @mousemove="handleMouseMove"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- Glassmorphic Card Content -->
      <div class="relative overflow-hidden rounded-[2.5rem] bg-surface/40 backdrop-blur-2xl border border-white/10 shadow-2xl p-8 md:p-12">
        <!-- Shine effect layer -->
        <div 
          class="absolute inset-0 pointer-events-none opacity-30 transition-opacity duration-300"
          :class="isHovering ? 'opacity-30' : 'opacity-0'"
          :style="{
            background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.4) 0%, transparent 50%)`
          }"
        ></div>

        <!-- Logo/Icon Section -->
        <div class="flex flex-col items-center mb-10 translate-z-20">
          <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-6 animate-bounce-subtle">
            <Icon name="heroicons:sparkles" class="text-white text-3xl" />
          </div>
          <h1 class="text-3xl font-black tracking-tight uppercase mb-2">
            <span class="text-content">Bi</span><span class="text-primary">nex</span><span class="text-content/40 text-sm ml-1 font-normal lowercase">admin</span>
          </h1>
          <p class="text-content/60 text-sm font-medium">Chào mừng bạn quay trở lại</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider text-center">
          {{ error }}
        </div>

        <!-- Form Section -->
        <form @submit.prevent="handleLogin" class="space-y-6 translate-z-10">
          <!-- Username Input -->
          <div class="space-y-2">
            <label class="block text-xs font-bold uppercase tracking-widest text-content/40 ml-1">Tên đăng nhập</label>
            <div class="group relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-content/40 group-focus-within:text-primary transition-colors">
                <Icon name="heroicons:user" />
              </div>
              <input 
                v-model="userName"
                type="text" 
                required
                placeholder="Nhập tên đăng nhập..."
                class="w-full bg-surface/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-content placeholder:text-content/20 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="space-y-2">
            <div class="flex justify-between items-center px-1">
              <label class="block text-xs font-bold uppercase tracking-widest text-content/40">Mật khẩu</label>
              <a href="#" class="text-[10px] uppercase font-bold text-primary hover:underline">Quên mật khẩu?</a>
            </div>
            <div class="group relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-content/40 group-focus-within:text-primary transition-colors">
                <Icon name="heroicons:lock-closed" />
              </div>
              <input 
                v-model="password"
                :type="showPassword ? 'text' : 'password'" 
                required
                placeholder="••••••••"
                class="w-full bg-surface/50 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-content placeholder:text-content/20 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-content/40 hover:text-primary transition-colors"
              >
                <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" />
              </button>
            </div>
          </div>

          <!-- Login Button -->
          <button 
            type="submit"
            :disabled="loading"
            class="relative w-full overflow-hidden group py-4 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-70"
          >
            <div v-if="loading" class="flex items-center justify-center gap-2">
              <Icon name="svg-spinners:ring-resize" class="text-xl" />
              <span>Đang xử lý...</span>
            </div>
            <span v-else class="flex items-center justify-center gap-2">
              <span>Đăng nhập</span>
              <Icon name="heroicons:arrow-right" class="group-hover:translate-x-1 transition-transform" />
            </span>
            
            <!-- Hover highlight -->
            <div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg]"></div>
          </button>
        </form>

        <!-- Footer Section -->
        <div class="mt-10 pt-8 border-t border-white/5 text-center translate-z-10">
          <p class="text-content/40 text-sm">
            Chưa có tài khoản? 
            <NuxtLink to="/register" class="text-primary font-bold hover:underline">Đăng ký ngay</NuxtLink>
          </p>
        </div>
      </div>
      
      <!-- 3D Shadow layer -->
      <div 
        class="absolute -inset-4 bg-primary/20 blur-3xl -z-10 transition-opacity duration-300"
        :class="isHovering ? 'opacity-40' : 'opacity-0'"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.translate-z-10 {
  transform: translateZ(10px);
}

.translate-z-20 {
  transform: translateZ(20px);
}

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

/* Chrome fix for blur and backdrop filter */
.backdrop-blur-2xl {
  -webkit-backdrop-filter: blur(40px);
  backdrop-filter: blur(40px);
}
</style>
