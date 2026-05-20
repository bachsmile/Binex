<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useTheme } from '~/composables/useTheme';
import { useRoute } from 'vue-router';

const { initTheme, isSettingsOpen } = useTheme();
const route = useRoute();

const currentPathName = computed(() => {
  if (route.path === '/users') return 'Người dùng';
  return 'Dashboard';
});

onMounted(() => {
  initTheme();
});

const isSidebarCollapsed = ref(false);

const handleSidebarCollapse = (collapsed: boolean) => {
  isSidebarCollapsed.value = collapsed;
};
</script>

<template>
  <div class="h-screen overflow-hidden bg-zinc-50/50 dark:bg-zinc-950 font-sans flex text-zinc-800 dark:text-zinc-100 transition-colors duration-300">
    
    <!-- Sidebar Left Section -->
    <CpSideBar @toggle-collapse="handleSidebarCollapse" />

    <!-- Main Content Right Section -->
    <div class="flex-1 flex flex-col min-w-0 transition-all duration-300 h-full overflow-hidden">
      
      <!-- Top Navbar (Header Bar) -->
      <header class="h-16 px-6 md:px-8 border-b border-zinc-150/80 dark:border-zinc-900 bg-white/80 dark:bg-zinc-955/80 backdrop-blur-md flex items-center justify-between shrink-0 select-none z-10">
        <!-- Left: Search input or Page Path indicators -->
        <div class="flex items-center gap-4">
          <div class="hidden sm:flex items-center gap-2 text-xs font-semibold text-zinc-400 dark:text-zinc-505">
            <span>Pages</span>
            <Icon name="heroicons:chevron-right" class="text-[10px]" />
            <span class="text-zinc-700 dark:text-zinc-300 font-bold capitalize">{{ currentPathName }}</span>
          </div>
        </div>

        <!-- Right: Actions / Settings / Theme toggle / Profile -->
        <div class="flex items-center gap-4">
          <!-- Notification Button -->
          <button class="w-9 h-9 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 flex items-center justify-center text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors relative">
            <Icon name="heroicons:bell" class="text-lg" />
            <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white dark:ring-zinc-955"></span>
          </button>

          <!-- Settings Button -->
          <button 
            @click="isSettingsOpen = true"
            class="w-9 h-9 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 flex items-center justify-center text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            <Icon name="heroicons:cog-6-tooth" class="text-lg" />
          </button>

          <!-- Divider -->
          <div class="h-6 w-px bg-zinc-200/80 dark:bg-zinc-800"></div>

          <!-- User Profile Display -->
          <div class="flex items-center gap-3">
            <el-avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=128&auto=format&fit=crop"
              :size="28"
              class="border border-zinc-150 dark:border-zinc-800 shadow-sm shrink-0"
            />
            <div class="hidden md:flex flex-col text-left">
              <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-tight">Binex Admin</span>
              <span class="text-[10px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider leading-none mt-0.5">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Nested Page Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-6 md:p-8 bg-zinc-50/50 dark:bg-zinc-955/20">
        <slot />
      </div>

    </div>

    <!-- Theme Customizer Modal Dialog -->
    <CpDashboardSettingsModal />

  </div>
</template>

<style scoped>
/* Core layout styles */
</style>
