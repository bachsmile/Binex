<script setup lang="ts">
definePageMeta({
  layout: false,
  path: '/mobile'
})

const token = useCookie('auth_token')
const activeTab = ref('home')

const navItems = [
  { id: 'home', icon: 'ph:house-fill', label: 'Trang chủ' },
  { id: 'wallet', icon: 'ph:wallet-fill', label: 'Ví tiền' },
  { id: 'notify', icon: 'ph:bell-fill', label: 'Thông báo' },
  { id: 'settings', icon: 'ph:gear-six-fill', label: 'Cài đặt' }
]

const modules = [
  { id: 'wedding', title: 'Wedding', icon: 'ph:heart-fill', color: 'bg-pink-500', route: '/modules/wedding/VpWeddHome' },
  { id: 'finance', title: 'Finance', icon: 'ph:chart-pie-slice-fill', color: 'bg-[#CCFF00]', textColor: 'text-black', route: '/finance' },
  { id: 'ecosystem', title: 'Ecosystem', icon: 'ph:cube-fill', color: 'bg-blue-500', route: '#' }
]
</script>

<template>
  <div class="mobile-pwa-container min-h-screen bg-black text-white pb-32">
    <!-- Top Header -->
    <header class="p-6 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-md z-50 border-b border-white/5">
      <div class="h-8">
        <img src="/img/1778046369521.png" class="h-full w-auto object-contain mix-blend-screen" />
      </div>
      <div class="flex gap-4 items-center">
        <button class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <Icon name="ph:magnifying-glass-bold" class="text-lg text-white/40" />
        </button>
        <div v-if="token" class="w-10 h-10 rounded-xl border border-[#CCFF00]/30 overflow-hidden bg-[#CCFF00]/10 flex items-center justify-center">
          <Icon name="ph:user-focus-fill" class="text-xl text-[#CCFF00]" />
        </div>
        <NuxtLink v-else to="/login" class="w-10 h-10 rounded-xl border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
          <Icon name="ph:user-bold" class="text-xl text-white/40" />
        </NuxtLink>
      </div>
    </header>

    <!-- Hero Card -->
    <section class="px-6 py-4">
      <div class="relative h-48 rounded-[2rem] overflow-hidden group">
        <img src="/img/hero_tropical.png" class="w-full h-full object-cover opacity-60" />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div class="absolute bottom-6 left-6">
          <h1 class="text-2xl font-black tracking-tight mb-1">BI<span class="text-[#CCFF00]">NEX</span> CENTER</h1>
          <p class="text-[10px] text-white/60 uppercase tracking-[0.3em] font-bold">Hệ sinh thái thông minh</p>
        </div>
      </div>
    </section>

    <!-- Quick Finance Summary (PWA Style) -->
    <section class="px-6 py-4">
      <div class="bg-white/5 border border-white/10 rounded-[2rem] p-6">
        <div class="flex justify-between items-center mb-6">
          <div class="text-xs font-bold text-white/40 uppercase tracking-widest">Tổng số dư</div>
          <Icon name="ph:eye-slash-bold" class="text-white/20" />
        </div>
        <div class="text-3xl font-black mb-2 tracking-tighter">128.450.000 <span class="text-sm font-medium text-white/40">VND</span></div>
        <div class="flex items-center gap-2 text-[#CCFF00] text-[10px] font-bold">
          <Icon name="ph:arrow-up-right-bold" />
          +12.5% tháng này
        </div>
      </div>
    </section>

    <!-- Modules Grid -->
    <section class="px-6 py-6">
      <h2 class="text-sm font-black uppercase tracking-widest text-white/40 mb-6 pl-2">Giải pháp của bạn</h2>
      <div class="grid grid-cols-2 gap-4">
        <NuxtLink v-for="mod in modules" :key="mod.id" :to="mod.route" class="flex flex-col gap-4 p-6 bg-white/5 border border-white/5 rounded-[2rem] active:scale-95 transition-all">
          <div :class="[mod.color, mod.textColor || 'text-white']" class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
            <Icon :name="mod.icon" class="text-2xl" />
          </div>
          <span class="font-black text-sm uppercase tracking-tighter">{{ mod.title }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Bottom Navigation Bar (PWA Navigation) -->
    <nav class="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-2xl border-t border-white/5 px-6 py-4 flex justify-between items-center z-[100]">
      <button 
        v-for="item in navItems" 
        :key="item.id"
        @click="activeTab = item.id"
        class="flex flex-col items-center gap-1.5 transition-all"
        :class="activeTab === item.id ? 'text-[#CCFF00]' : 'text-white/30'"
      >
        <div class="relative">
          <Icon :name="item.icon" class="text-2xl" />
          <div v-if="activeTab === item.id" class="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#CCFF00] rounded-full shadow-[0_0_10px_#CCFF00]"></div>
        </div>
        <span class="text-[9px] font-black uppercase tracking-widest">{{ item.label }}</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.mobile-pwa-container {
  font-family: 'Inter', sans-serif;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* Hiệu ứng kính cho thanh Nav */
nav {
  padding-bottom: env(safe-area-inset-bottom, 16px);
}
</style>
