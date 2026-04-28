<script setup>
const colorMode = useColorMode();
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script>

<template>
  <div class="min-h-screen bg-surface text-content transition-colors duration-500">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-primary/5">
      <div class="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
            <Icon name="heroicons:sparkles" class="text-white text-2xl" />
          </div>
          <span class="font-black text-2xl tracking-tighter uppercase">Binex</span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-widest opacity-80">
          <NuxtLink to="/" active-class="text-primary opacity-100">Trang chủ</NuxtLink>
          <NuxtLink to="/setting/theme" active-class="text-primary opacity-100">Giao diện</NuxtLink>
          <NuxtLink to="/login" active-class="text-primary opacity-100">Đăng nhập</NuxtLink>
          <NuxtLink to="/register" active-class="text-primary opacity-100">Đăng ký</NuxtLink>
        </nav>

        <div class="flex items-center gap-4">
          <NuxtLink 
            to="/register"
            class="hidden md:flex px-6 py-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20 font-bold text-sm uppercase tracking-wider hover:bg-secondary hover:text-white active:scale-95 transition-all"
          >
            Đăng ký
          </NuxtLink>
          <NuxtLink 
            to="/login"
            class="hidden md:flex px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all"
          >
            Đăng nhập
          </NuxtLink>
          <button
            @click="toggleColorMode"
            class="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 shadow-sm group"
          >
            <Icon 
              :name="colorMode.value === 'dark' ? 'heroicons:sun' : 'heroicons:moon'" 
              class="text-xl group-hover:rotate-12 transition-transform"
            />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>
  </div>
</template>
