<script setup lang="ts">
import { ref } from 'vue';

const wallets = ref([
  { code: 'USD', name: 'US Dollar', balance: '$22,678.00', status: 'Active', flag: 'circle-flags:us' },
  { code: 'EUR', name: 'Euro', balance: '€18,345.00', status: 'Active', flag: 'circle-flags:eu' },
  { code: 'BDT', name: 'Bangladeshi Taka', balance: '৳1,22,678.00', status: 'Active', flag: 'circle-flags:bd' },
  { code: 'GBP', name: 'British Pound', balance: '£15,000.00', status: 'Inactive', flag: 'circle-flags:gb' },
]);
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-base font-black text-zinc-800 dark:text-white">My Wallet</h3>
      <button 
        @click="navigateTo('/wallet/add')"
        class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-zinc-150 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <Icon name="heroicons:plus" class="text-xs" />
        <span>Add New</span>
      </button>
    </div>

    <!-- 2x2 Grid -->
    <div class="grid grid-cols-2 gap-4">
      <div 
        v-for="wallet in wallets" 
        :key="wallet.code"
        class="p-5 bg-zinc-50/50 hover:bg-zinc-50 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/60 border border-zinc-100/60 dark:border-zinc-800/40 rounded-[1.75rem] transition-all flex flex-col justify-between h-[125px] hover:shadow-sm"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-2">
            <!-- Flag -->
            <Icon :name="wallet.flag" class="text-xl shrink-0" />
            <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200">{{ wallet.code }}</span>
          </div>
          
          <!-- Options dot -->
          <button class="text-zinc-400 hover:text-zinc-600 transition-colors">
            <Icon name="heroicons:ellipsis-vertical" class="text-xs" />
          </button>
        </div>

        <div class="mt-2.5">
          <div class="text-[17px] font-black text-zinc-900 dark:text-white leading-none">
            {{ wallet.balance }}
          </div>
          
          <!-- Status -->
          <span 
            class="inline-block text-[9px] font-bold mt-2"
            :class="wallet.status === 'Active' ? 'text-emerald-500' : 'text-orange-400'"
          >
            {{ wallet.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
