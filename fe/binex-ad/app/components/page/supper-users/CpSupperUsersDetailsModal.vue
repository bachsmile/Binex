<script setup lang="ts">
import { ref, watch } from 'vue';
import type { User } from '~/types/user';
import CpDetailsInfoTab from './tabs/CpDetailsInfoTab.vue';
import CpDetailsPermissionsTab from './tabs/CpDetailsPermissionsTab.vue';
import CpDetailsBanksTab from './tabs/CpDetailsBanksTab.vue';
import CpDetailsWalletTab from './tabs/CpDetailsWalletTab.vue';
import CpDetailsTransactionsTab from './tabs/CpDetailsTransactionsTab.vue';

const isOpen = defineModel<boolean>('isOpen', { default: false });

const props = defineProps<{
  user: User | null;
}>();

const emit = defineEmits<{
  (e: 'toast', message: string, type?: 'success' | 'error'): void;
  (e: 'updated'): void; // triggers user list fetch
}>();

const activeTab = ref<'info' | 'permissions' | 'banks' | 'wallet' | 'transactions'>('info');
const transactionsTabRef = ref<InstanceType<typeof CpDetailsTransactionsTab> | null>(null);

const tabs = [
  { id: 'info', label: 'Thông tin tài khoản', icon: 'heroicons:user-circle' },
  { id: 'permissions', label: 'Nhóm quyền', icon: 'heroicons:shield-check' },
  { id: 'banks', label: 'Phương thức thanh toán', icon: 'heroicons:credit-card' },
  { id: 'wallet', label: 'Ví tài khoản', icon: 'heroicons:wallet' },
  { id: 'transactions', label: 'Lịch sử giao dịch', icon: 'heroicons:arrow-path' }
] as const;

watch(isOpen, (newVal) => {
  if (newVal) {
    activeTab.value = 'info';
  }
});

const onToast = (message: string, type?: 'success' | 'error') => {
  emit('toast', message, type);
};

const onWalletUpdated = () => {
  emit('updated');
  // If transaction tab is mounted, refresh its transactions
  if (transactionsTabRef.value) {
    transactionsTabRef.value.fetchUserTransactions();
  }
};
</script>

<template>
  <CmDialog
    v-model:isOpen="isOpen"
    :title="`Chi tiết tài khoản: ${user?.userName || ''}`"
    size="xl"
  >
    <div v-if="user" class="space-y-6">
      <!-- Tab Navigation Header -->
      <div class="flex items-center gap-1 border-b border-zinc-100 dark:border-zinc-800 pb-3 overflow-x-auto select-none no-scrollbar">
        <CmButtonBase 
          v-for="tab in tabs" 
          :key="tab.id"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap"
          :class="activeTab === tab.id 
            ? 'bg-primary/10 text-primary dark:bg-primary/20' 
            : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'"
          @click="activeTab = tab.id"
        >
          <Icon :name="tab.icon" class="text-sm" />
          <span>{{ tab.label }}</span>
        </CmButtonBase>
      </div>

      <!-- Tab Content Area -->
      <div class="transition-all duration-300">
        <!-- Tab 1: Account Information -->
        <CpDetailsInfoTab 
          v-if="activeTab === 'info'" 
          :user="user" 
        />

        <!-- Tab 2: Role Groups & Permissions -->
        <CpDetailsPermissionsTab 
          v-else-if="activeTab === 'permissions'" 
          :user="user" 
        />

        <!-- Tab 3: Payment Methods (Bank) -->
        <CpDetailsBanksTab 
          v-else-if="activeTab === 'banks'" 
          :user="user" 
          @toast="onToast" 
        />

        <!-- Tab 4: Account Wallets -->
        <CpDetailsWalletTab 
          v-else-if="activeTab === 'wallet'" 
          :user="user" 
          @toast="onToast"
          @updated="onWalletUpdated"
        />

        <!-- Tab 5: Recent Transactions -->
        <CpDetailsTransactionsTab 
          ref="transactionsTabRef"
          v-else-if="activeTab === 'transactions'" 
          :user="user" 
        />
      </div>
    </div>

    <template #footer>
      <CmButton 
        variant="outline" 
        size="md" 
        class="text-xs font-bold border-zinc-150 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 px-5" 
        @click="isOpen = false"
      >
        Đóng chi tiết
      </CmButton>
    </template>
  </CmDialog>
</template>
