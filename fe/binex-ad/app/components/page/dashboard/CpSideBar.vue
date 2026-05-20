<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useTheme } from '~/composables/useTheme';
import { useRoute } from 'vue-router';

const { isSettingsOpen } = useTheme();
const route = useRoute();

const isCollapsed = ref(false);
const activeTab = ref('Dashboard');
const isSystemMenuOpen = ref(false);

const isSupper = computed(() => route.path.startsWith('/supper'));

watch(() => route.path, (newPath) => {
  if (newPath.endsWith('/users')) {
    activeTab.value = 'Người dùng';
  } else if (newPath.endsWith('/systems')) {
    activeTab.value = 'Hệ thống';
  } else if (newPath.includes('/finance/binex-wallet')) {
    activeTab.value = 'Ví Binex';
  } else if (newPath.includes('/finance/transactions')) {
    activeTab.value = 'Transaction';
  } else if (newPath.includes('/finance/wallet')) {
    activeTab.value = 'Wallet';
  } else if (newPath.includes('/finance/banking')) {
    activeTab.value = 'Banking';
  } else if (newPath === '/' || newPath === '/supper') {
    activeTab.value = 'Dashboard';
  }
}, { immediate: true });

const emit = defineEmits(['toggle-collapse']);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  emit('toggle-collapse', isCollapsed.value);
};

const mainMenu = computed(() => [
  { name: 'Dashboard', icon: 'heroicons:squares-2x2', active: true, to: isSupper.value ? '/supper' : '/' },
  { name: 'Analytics', icon: 'heroicons:chart-bar', badge: 20 },
  { name: 'Transactions', icon: 'heroicons:credit-card' },
  { name: 'Invoices', icon: 'heroicons:document-text' },
]);

const managementMenu = computed(() => {
  const items = [
    { name: 'Người dùng', icon: 'heroicons:user-group', to: isSupper.value ? '/supper/users' : '/users' },
  ];
  if (isSupper.value) {
    items.push({ name: 'Hệ thống', icon: 'heroicons:server-stack', to: '/supper/systems' });
  }
  return items;
});

const financeMenu = computed(() => [
  { name: 'Ví Binex', icon: 'heroicons:shield-check', to: isSupper.value ? '/supper/finance/binex-wallet' : '/finance/binex-wallet' },
  { name: 'Transaction', icon: 'heroicons:arrow-path', to: isSupper.value ? '/supper/finance/transactions' : '/finance/transactions' },
  { name: 'Wallet', icon: 'heroicons:wallet', to: isSupper.value ? '/supper/finance/wallet' : '/finance/wallet' },
  { name: 'Banking', icon: 'heroicons:building-library', to: isSupper.value ? '/supper/finance/banking' : '/finance/banking' },
]);

const featuresMenu = [
  { name: 'Recurring', icon: 'heroicons:arrow-path', badge: 16 },
  { name: 'Subscriptions', icon: 'heroicons:user-group' },
  { name: 'Feedback', icon: 'heroicons:chat-bubble-left-right' },
];

const generalMenu = [
  { name: 'Settings', icon: 'heroicons:cog-6-tooth', action: () => isSettingsOpen.value = true },
  { name: 'Help Desk', icon: 'heroicons:question-mark-circle' },
  { name: 'Log out', icon: 'heroicons:arrow-left-on-rectangle', to: '/login' },
];

const selectTab = (item: any) => {
  if (item.action) {
    item.action();
    return;
  }
  if (item.to) {
    navigateTo(item.to);
    activeTab.value = item.name;
    return;
  }
  activeTab.value = item.name;
};
</script>

<template>
  <div 
    class="flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-zinc-100/80 dark:border-zinc-900 transition-all duration-300 py-6 px-4 select-none relative"
    :class="isCollapsed ? 'w-20' : 'w-64'"
  >
    <!-- Brand Logo Section -->
    <div class="flex items-center justify-between mb-8 px-2">
      <div v-if="!isCollapsed" class="flex items-center gap-3.5">
        <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-300">
          <!-- Premium Origami Logo Icon -->
          <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
            <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="currentColor" fill-opacity="0.8" />
          </svg>
        </div>
        <span class="text-xl font-bold tracking-tight text-zinc-800 dark:text-white capitalize">
          Bi<span class="text-primary">nex</span>
        </span>
      </div>
      
      <div v-else class="mx-auto">
        <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
            <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="currentColor" fill-opacity="0.8" />
          </svg>
        </div>
      </div>
      
      <!-- Collapse toggle button -->
      <button 
        @click="toggleCollapse"
        class="w-6 h-6 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors"
        :class="isCollapsed ? 'absolute -right-3 top-8 bg-white dark:bg-zinc-900 shadow-md border border-zinc-200 dark:border-zinc-800' : ''"
      >
        <Icon :name="isCollapsed ? 'heroicons:chevron-right' : 'heroicons:chevron-left-20-solid'" class="text-xs" />
      </button>
    </div>

    <!-- Navigation Scroll -->
    <div class="flex-1 overflow-y-auto space-y-7 no-scrollbar">
      <!-- MAIN MENU -->
      <div>
        <h4 v-if="!isCollapsed" class="text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-3.5 px-3">
          Main Menu
        </h4>
        <div class="space-y-1">
          <button 
            v-for="item in mainMenu" 
            :key="item.name"
            @click="selectTab(item)"
            class="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl transition-all text-sm font-semibold group relative"
            :class="activeTab === item.name 
              ? 'text-primary bg-primary/5 dark:bg-primary/10' 
              : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-200'"
          >
            <!-- Vertical Indicator Pill -->
            <div 
              v-if="activeTab === item.name && !isCollapsed" 
              class="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full"
            ></div>
            
            <Icon 
              :name="item.icon" 
              class="text-lg transition-transform group-hover:scale-110"
              :class="activeTab === item.name ? 'text-primary' : 'text-zinc-400 dark:text-zinc-500'" 
            />
            <span v-if="!isCollapsed" class="flex-1 text-left text-[13px] font-medium leading-none">{{ item.name }}</span>
            <span 
              v-if="item.badge && !isCollapsed" 
              class="bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full"
            >
              {{ item.badge }}
            </span>
          </button>
        </div>
      </div>

      <!-- NHÓM QUẢN LÝ -->
      <div>
        <h4 v-if="!isCollapsed" class="text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-3.5 px-3">
          Nhóm quản lý
        </h4>
        <div class="space-y-1">
          <button 
            v-for="item in managementMenu" 
            :key="item.name"
            @click="selectTab(item)"
            class="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl transition-all text-sm font-semibold group relative"
            :class="activeTab === item.name 
              ? 'text-primary bg-primary/5 dark:bg-primary/10' 
              : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-200'"
          >
            <!-- Vertical Indicator Pill -->
            <div 
              v-if="activeTab === item.name && !isCollapsed" 
              class="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full"
            ></div>
            
            <Icon 
              :name="item.icon" 
              class="text-lg transition-transform group-hover:scale-110"
              :class="activeTab === item.name ? 'text-primary' : 'text-zinc-400 dark:text-zinc-500'" 
            />
            <span v-if="!isCollapsed" class="flex-1 text-left text-[13px] font-medium leading-none">{{ item.name }}</span>
          </button>


        </div>
      </div>

      <!-- TÀI CHÍNH (FINANCE MENU GROUP) -->
      <div>
        <h4 v-if="!isCollapsed" class="text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-3.5 px-3">
          Tài chính
        </h4>
        <div class="space-y-1">
          <button 
            v-for="item in financeMenu" 
            :key="item.name"
            @click="selectTab(item)"
            class="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl transition-all text-sm font-semibold group relative"
            :class="activeTab === item.name 
              ? 'text-primary bg-primary/5 dark:bg-primary/10' 
              : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-200'"
          >
            <!-- Vertical Indicator Pill -->
            <div 
              v-if="activeTab === item.name && !isCollapsed" 
              class="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full"
            ></div>
            
            <Icon 
              :name="item.icon" 
              class="text-lg transition-transform group-hover:scale-110"
              :class="activeTab === item.name ? 'text-primary' : 'text-zinc-400 dark:text-zinc-500'" 
            />
            <span v-if="!isCollapsed" class="flex-1 text-left text-[13px] font-medium leading-none">{{ item.name }}</span>
          </button>
        </div>
      </div>

      <!-- FEATURES -->
      <div>
        <h4 v-if="!isCollapsed" class="text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-3.5 px-3">
          Features
        </h4>
        <div class="space-y-1">
          <button 
            v-for="item in featuresMenu" 
            :key="item.name"
            @click="selectTab(item)"
            class="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl transition-all text-sm font-semibold group"
            :class="activeTab === item.name 
              ? 'text-primary bg-primary/5 dark:bg-primary/10' 
              : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-200'"
          >
            <Icon 
              :name="item.icon" 
              class="text-lg transition-transform group-hover:scale-110"
              :class="activeTab === item.name ? 'text-primary' : 'text-zinc-400 dark:text-zinc-500'" 
            />
            <span v-if="!isCollapsed" class="flex-1 text-left text-[13px] font-medium leading-none">{{ item.name }}</span>
            <span 
              v-if="item.badge && !isCollapsed" 
              class="bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full"
            >
              {{ item.badge }}
            </span>
          </button>
        </div>
      </div>

      <!-- GENERAL -->
      <div>
        <h4 v-if="!isCollapsed" class="text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-3.5 px-3">
          General
        </h4>
        <div class="space-y-1">
          <button 
            v-for="item in generalMenu" 
            :key="item.name"
            @click="selectTab(item)"
            class="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl transition-all text-sm font-semibold group"
            :class="activeTab === item.name 
              ? 'text-primary bg-primary/5 dark:bg-primary/10' 
              : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-200'"
          >
            <Icon 
              :name="item.icon" 
              class="text-lg transition-transform group-hover:scale-110"
              :class="activeTab === item.name ? 'text-primary' : 'text-zinc-400 dark:text-zinc-500'" 
            />
            <span v-if="!isCollapsed" class="flex-1 text-left text-[13px] font-medium leading-none">{{ item.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Upgrade Box -->
    <div v-if="!isCollapsed" class="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900">
      <div class="bg-gradient-to-br from-primary via-primary to-emerald-700 text-white rounded-3xl p-5 relative overflow-hidden shadow-lg shadow-primary/20">
        <!-- Floating shapes inside the box for high-end look -->
        <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <div class="absolute -left-6 -top-6 w-16 h-16 bg-emerald-500/20 rounded-full blur-lg pointer-events-none"></div>
        
        <h5 class="font-bold text-sm leading-tight flex items-center gap-1.5 mb-1.5">
          Upgrade Pro! 🚀
        </h5>
        <p class="text-[10px] text-white/80 leading-relaxed font-medium mb-4">
          Higher productivity with better organization
        </p>
        
        <button 
          @click="navigateTo('/upgrade')"
          class="w-full bg-white text-zinc-900 font-bold hover:bg-zinc-50 text-xs py-2.5 rounded-2xl transition-transform hover:scale-[1.02] shadow-sm flex items-center justify-center gap-1.5"
        >
          <Icon name="heroicons:sparkles-20-solid" class="text-primary" />
          <span>Upgrade</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
