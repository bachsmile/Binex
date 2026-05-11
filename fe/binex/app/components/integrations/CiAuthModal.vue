<script setup lang="ts">
import { watch, ref } from 'vue';
import { useAuthApi } from '~/api/auth';
import mascotLogin from '/img/mascot_login.png'
import mascotRegister from '/img/mascot_register.png'

const { isOpen, mode, message, close } = useAuthModal();
const authApi = useAuthApi();
const authToken = useCookie('auth_token', { path: '/' });
const userIdCookie = useCookie('user_id', { path: '/' });
const { setUser } = useUser();

// Debug trạng thái
watch(isOpen, (val) => {
  if (val) {
    authApi.error.value = null;
    console.log('[AuthModal] Opened in mode:', mode.value);
  }
});

const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login';
  authApi.error.value = null;
};

// Form states
const form = ref({
  userName: '',
  password: '',
  confirmPassword: '',
  name: ''
});

const handleAuth = async () => {
  if (authApi.loading.value) return;
  
  authApi.error.value = null;

  try {
    if (mode.value === 'login') {
      const response = await authApi.login({
        userName: form.value.userName,
        password: form.value.password
      });

      if (response?.data?.accessToken) {
        authToken.value = response.data.accessToken;
        userIdCookie.value = response.data.user.id;
        setUser(response.data.user);
        close();
        window.location.reload();
      }
    } else {
      // Register
      if (form.value.password !== form.value.confirmPassword) {
        authApi.error.value = { message: 'Mật khẩu xác nhận không khớp.' } as any;
        return;
      }

      const response = await authApi.register({
        userName: form.value.userName,
        password: form.value.password
      });

      if (response) {
        mode.value = 'login';
        message.value = 'Đăng ký thành công! Bạn có thể đăng nhập ngay.';
        form.value.password = '';
        form.value.confirmPassword = '';
      }
    }
  } catch (err) {
    console.error('Auth error:', err);
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="auth-fade">
      <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/90 backdrop-blur-xl" @click="close"></div>

        <!-- Modal Content -->
        <div class="relative w-full max-w-5xl max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] animate-auth-in flex flex-col md:flex-row">
          
          <!-- LEFT SIDE -->
          <div class="relative w-full md:w-5/12 bg-zinc-900/50 flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
            <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#CCFF00]/5 to-transparent"></div>
            <div class="absolute -top-24 -left-24 w-64 h-64 bg-[#CCFF00] blur-[120px] opacity-10"></div>
            
            <div class="relative z-10 w-full flex flex-col items-center">
              <div class="mb-4 animate-float w-full flex justify-center" :key="mode">
                <img 
                  :src="mode === 'login' ? mascotLogin : mascotRegister" 
                  class="w-56 md:w-72 h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-all duration-700 hover:scale-105" 
                  alt="Binex Mascot" 
                />
              </div>
              <h3 class="text-xl md:text-2xl font-black uppercase tracking-tighter mb-3 text-white">
                {{ mode === 'login' ? 'Chào mừng trở lại' : 'Bắt đầu hành trình' }}
              </h3>
              <p class="text-white/40 text-[10px] font-bold leading-relaxed max-w-[240px] mx-auto uppercase tracking-[0.2em]">
                {{ mode === 'login' ? 'Đăng nhập để quản lý hệ sinh thái của bạn' : 'Tạo tài khoản để khám phá các giải pháp công nghệ số hàng đầu' }}
              </p>
            </div>
          </div>

          <!-- RIGHT SIDE -->
          <div class="relative w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
            <button @click="close" class="absolute top-6 right-6 text-white/20 hover:text-white transition-colors z-50">
              <Icon name="ph:x-bold" size="20" />
            </button>

            <div class="max-w-md mx-auto w-full py-4">
              <div class="mb-8">
                <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3 text-white">
                  {{ mode === 'login' ? 'Đăng nhập' : 'Đăng ký' }}
                </h2>
                
                <div v-if="authApi.error.value || message" 
                     class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest mb-4 animate-shake"
                     :class="authApi.error.value ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-[#CCFF00]'">
                  <Icon :name="authApi.error.value ? 'ph:warning-circle-bold' : 'ph:info-bold'" />
                  {{ authApi.error.value?.message || message }}
                </div>
                <p v-else class="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">Hệ sinh thái công nghệ số Binex</p>
              </div>

              <form @submit.prevent="handleAuth" class="space-y-4">
                <div class="group">
                  <label class="block text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-1.5 ml-1 transition-colors group-focus-within:text-[#CCFF00]">Username</label>
                  <div class="relative">
                    <Icon name="ph:user-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#CCFF00] transition-colors z-10" />
                    <input v-model="form.userName" type="text" placeholder="Tên đăng nhập" required class="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/20 focus:border-[#CCFF00]/50 focus:bg-[#CCFF00]/5 transition-all outline-none text-xs font-medium" />
                  </div>
                </div>

                <div class="group">
                  <label class="block text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-1.5 ml-1 transition-colors group-focus-within:text-[#CCFF00]">Password</label>
                  <div class="relative">
                    <Icon name="ph:lock-key-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#CCFF00] transition-colors z-10" />
                    <input v-model="form.password" type="password" placeholder="••••••••" required class="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/20 focus:border-[#CCFF00]/50 focus:bg-[#CCFF00]/5 transition-all outline-none text-xs font-medium" />
                  </div>
                </div>

                <div v-if="mode === 'register'" class="group">
                  <label class="block text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-1.5 ml-1 transition-colors group-focus-within:text-[#CCFF00]">Confirm Password</label>
                  <div class="relative">
                    <Icon name="ph:shield-check-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#CCFF00] transition-colors z-10" />
                    <input v-model="form.confirmPassword" type="password" placeholder="••••••••" required class="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/20 focus:border-[#CCFF00]/50 focus:bg-[#CCFF00]/5 transition-all outline-none text-xs font-medium" />
                  </div>
                </div>

                <button type="submit" 
                        :disabled="authApi.loading.value"
                        class="w-full py-4 bg-[#CCFF00] text-black font-black uppercase tracking-[0.2em] text-[9px] rounded-xl shadow-[0_15px_30px_rgba(204,255,0,0.1)] hover:scale-[1.01] active:scale-[0.99] transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <Icon v-if="authApi.loading.value" name="ph:circle-notch-bold" class="animate-spin text-lg" />
                  {{ mode === 'login' ? 'Đăng nhập hệ thống' : 'Tạo tài khoản ngay' }}
                </button>
              </form>

              <div class="mt-8 pt-6 border-t border-white/5 flex flex-col items-center">
                <p class="text-white/20 text-[9px] font-black uppercase tracking-widest mb-3">
                  {{ mode === 'login' ? 'Bạn mới sử dụng Binex?' : 'Đã có tài khoản Binex?' }}
                </p>
                <button @click="toggleMode" class="group flex items-center gap-3 text-[#CCFF00] font-black uppercase tracking-[0.2em] text-[9px] hover:text-white transition-all">
                  <span>{{ mode === 'login' ? 'Đăng ký tài khoản' : 'Quay lại đăng nhập' }}</span>
                  <Icon :name="mode === 'login' ? 'ph:arrow-right-bold' : 'ph:arrow-left-bold'" class="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus {
  -webkit-text-fill-color: white !important;
  -webkit-box-shadow: 0 0 0px 1000px #1a1a1a inset !important;
  transition: background-color 5000s ease-in-out 0s;
}

.auth-fade-enter-active,
.auth-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.auth-fade-enter-from,
.auth-fade-leave-to {
  opacity: 0;
}

@keyframes auth-in {
  from { opacity: 0; transform: scale(0.95) translateY(40px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-auth-in {
  animation: auth-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
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
