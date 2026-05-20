<script setup lang="ts">
import { ref } from 'vue';

const showCurrencyDropdown = ref(false);
const selectedCurrency = ref({ code: 'USD', name: 'US Dollar', flag: 'circle-flags:us' });

const currencies = [
  { code: 'USD', name: 'US Dollar', flag: 'circle-flags:us' },
  { code: 'EUR', name: 'Euro', flag: 'circle-flags:eu' },
  { code: 'GBP', name: 'British Pound', flag: 'circle-flags:gb' },
];

const toggleCurrency = () => {
  showCurrencyDropdown.value = !showCurrencyDropdown.value;
};

const selectCurrency = (curr: any) => {
  selectedCurrency.value = curr;
  showCurrencyDropdown.value = false;
};
</script>

<template>
  <CmCard class="p-7 relative overflow-visible flex flex-col justify-between h-[300px]">
    
    <!-- Balance Header row -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Icon name="heroicons:wallet" class="text-xl" />
        </div>
        <span class="text-sm font-bold text-zinc-500 dark:text-zinc-400">Account Balance</span>
      </div>
      
      <!-- Currency Switcher Dropdown -->
      <div class="relative">
        <button 
          @click="toggleCurrency"
          class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-100 hover:border-zinc-200 dark:border-zinc-800 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs font-bold text-zinc-700 dark:text-zinc-350 transition-colors"
        >
          <Icon :name="selectedCurrency.flag" class="text-sm shrink-0" />
          <span>{{ selectedCurrency.code }}</span>
          <Icon name="heroicons:chevron-down" class="text-[10px] text-zinc-400 dark:text-zinc-500" />
        </button>
        
        <!-- Dropdown Menu -->
        <div 
          v-if="showCurrencyDropdown"
          class="absolute right-0 top-full mt-1.5 w-32 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-xl shadow-lg z-20 py-1"
        >
          <button 
            v-for="curr in currencies" 
            :key="curr.code"
            @click="selectCurrency(curr)"
            class="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <Icon :name="curr.flag" class="text-sm" />
            <span>{{ curr.code }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Balance Value display -->
    <div class="my-auto">
      <div class="text-[36px] font-black tracking-tight text-zinc-900 dark:text-white leading-none">
        $35,340.89
      </div>
      
      <!-- Monthly change indicator -->
      <div class="flex items-center gap-2 mt-3">
        <div class="inline-flex items-center gap-1 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
          <Icon name="heroicons:arrow-up-right" class="text-xs font-black" />
          <span>+3.2%</span>
        </div>
        <span class="text-xs text-zinc-400 dark:text-zinc-500 font-medium">from last month</span>
      </div>
    </div>

    <!-- Call to Actions buttons -->
    <div class="grid grid-cols-2 gap-3 mt-4 pt-2">
      <CmButton variant="primary" size="md" icon="heroicons:arrow-up-tray" class="text-xs py-3 font-bold">
        Send Money
      </CmButton>
      <CmButton variant="outline" size="md" icon="heroicons:arrow-down-tray" class="text-xs py-3 font-bold">
        Request Money
      </CmButton>
    </div>

  </CmCard>
</template>
