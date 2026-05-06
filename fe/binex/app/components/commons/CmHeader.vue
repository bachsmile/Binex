<script setup lang="ts">
const token = useCookie('auth_token')
const router = useRouter()
const isScrolled = ref(false)

const logout = () => {
  token.value = null
  router.push('/login')
}

// Xử lý hiệu ứng khi cuộn trang
if (import.meta.client) {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
}
</script>

<template>
  <header 
    class="fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 md:px-12"
    :class="[isScrolled ? 'py-4 bg-black/60 backdrop-blur-xl border-b border-white/5' : 'py-8 bg-transparent']"
  >
    <div class="max-w-8xl mx-auto flex justify-between items-center">
      <!-- Left: Logo -->
      <NuxtLink to="/" class="h-10 md:h-12 mix-blend-screen transition-transform hover:scale-105">
        <img src="/img/logo_binex_final.png" class="h-full w-auto object-contain" alt="Binex Logo" />
      </NuxtLink>
      
      <!-- Center: Navigation -->
      <nav class="hidden lg:flex gap-10 text-[11px] font-black uppercase tracking-[0.25em] text-white/50 items-center">
        <NuxtLink to="/" class="hover:text-[#CCFF00] transition-colors" active-class="text-[#CCFF00]">Hệ sinh thái</NuxtLink>
        <NuxtLink to="/finance" class="hover:text-[#CCFF00] transition-colors" active-class="text-[#CCFF00]">Giải pháp</NuxtLink>
        <NuxtLink to="/enterprise" class="hover:text-[#CCFF00] transition-colors" active-class="text-[#CCFF00]">Doanh nghiệp</NuxtLink>
        <NuxtLink to="/news" class="hover:text-[#CCFF00] transition-colors" active-class="text-[#CCFF00]">Tin tức</NuxtLink>
      </nav>

      <!-- Right: Functional Actions -->
      <div class="flex items-center gap-4 md:gap-8">
        <!-- Search Tool -->
        <button class="text-white/40 hover:text-[#CCFF00] transition-colors hidden md:block">
          <Icon name="ph:magnifying-glass-bold" class="text-xl" />
        </button>

        <!-- Language Switcher -->
        <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[9px] font-black text-white/40 uppercase tracking-widest">
          <span class="text-[#CCFF00]">VN</span>
          <span class="w-px h-2 bg-white/10"></span>
          <span class="hover:text-white cursor-pointer transition-colors">EN</span>
        </div>

        <!-- Auth Actions -->
        <div v-if="token" class="relative group">
          <button class="w-10 h-10 rounded-xl border border-[#CCFF00]/30 overflow-hidden hover:border-[#CCFF00] transition-all flex items-center justify-center bg-[#CCFF00]/5">
            <Icon name="ph:user-focus-fill" class="text-2xl text-[#CCFF00]" />
          </button>
          <!-- Dropdown -->
          <div class="absolute right-0 top-full mt-4 w-56 bg-black/95 backdrop-blur-3xl border border-white/10 rounded-2xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110]">
            <div class="px-6 py-4 border-b border-white/5 mb-2">
              <div class="text-[9px] text-white/30 uppercase font-black tracking-[0.2em] mb-1">Cá nhân</div>
              <div class="text-sm text-white font-bold truncate">Member #1234</div>
            </div>
            <div class="py-2">
              <button class="w-full px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-[#CCFF00] hover:bg-white/5 transition-all flex items-center gap-3">
                <Icon name="ph:layout-fill" /> Dashboard
              </button>
              <button class="w-full px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-[#CCFF00] hover:bg-white/5 transition-all flex items-center gap-3">
                <Icon name="ph:shield-check-fill" /> Bảo mật
              </button>
            </div>
            <div class="mt-2 pt-2 border-t border-white/5">
              <button @click="logout" class="w-full px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-3">
                <Icon name="ph:power-bold" /> Đăng xuất
              </button>
            </div>
          </div>
        </div>

        <div v-else class="flex items-center gap-3">
          <NuxtLink to="/login" class="px-6 py-2.5 text-white/50 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors">Login</NuxtLink>
          <NuxtLink to="/register" class="px-6 py-2.5 bg-[#CCFF00] text-black rounded-lg font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#CCFF00]/20 text-[10px] uppercase tracking-widest">Join Plus</NuxtLink>
        </div>

        <!-- Mobile Toggle -->
        <button class="lg:hidden text-white/60 hover:text-[#CCFF00]">
          <Icon name="ph:list-bold" class="text-2xl" />
        </button>
      </div>
    </div>
  </header>
</template>
