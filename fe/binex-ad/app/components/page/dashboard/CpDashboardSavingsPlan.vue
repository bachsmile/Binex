<script setup lang="ts">
import { ref } from 'vue';

const plans = ref([
  { 
    name: 'Investment Goal', 
    current: 15600, 
    target: 25000, 
    percentage: 62, 
    icon: 'heroicons:academic-cap', 
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/20', 
    iconColor: 'text-indigo-500' 
  },
  { 
    name: 'Emergency Fund', 
    current: 8400, 
    target: 12000, 
    percentage: 70, 
    icon: 'heroicons:shield-check', 
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20', 
    iconColor: 'text-emerald-500' 
  },
]);

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-base font-black text-zinc-800 dark:text-white">My Savings Plan</h3>
      <button class="w-8 h-8 rounded-full border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-650 transition-colors">
        <Icon name="heroicons:ellipsis-horizontal" class="text-sm" />
      </button>
    </div>

    <!-- Plans Cards -->
    <div class="space-y-3">
      <div 
        v-for="plan in plans" 
        :key="plan.name"
        class="p-5 border border-zinc-100/60 dark:border-zinc-800/40 bg-zinc-50/20 dark:bg-zinc-900/10 rounded-[1.75rem] space-y-4 hover:shadow-sm transition-all"
      >
        <!-- Title & Icon -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="[plan.bgColor, plan.iconColor]">
            <Icon :name="plan.icon" class="text-xl" />
          </div>
          <div class="flex-1 min-w-0">
            <span class="block text-xs font-bold text-zinc-800 dark:text-zinc-200">{{ plan.name }}</span>
            <span class="block text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 mt-0.5">
              {{ formatCurrency(plan.current) }} / {{ formatCurrency(plan.target) }}
            </span>
          </div>
          
          <span class="text-xs font-black text-zinc-800 dark:text-white">{{ plan.percentage }}%</span>
        </div>

        <!-- Progress Bar -->
        <CmProgress :value="plan.current" :max="plan.target" height="h-2.5" />
      </div>
    </div>
  </div>
</template>
