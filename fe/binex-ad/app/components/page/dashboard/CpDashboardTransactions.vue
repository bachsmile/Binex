<script setup lang="ts">
import { ref } from 'vue';

const transactions = ref([
  {
    id: 1,
    activity: 'Mobile App Purchase',
    icon: 'heroicons:device-phone-mobile',
    iconBg: 'bg-blue-500/10 text-blue-500',
    date: 'Wed, 12 Jun 2026',
    price: '$806.50',
    status: 'Success',
  },
  {
    id: 2,
    activity: 'Software License',
    icon: 'heroicons:code-bracket',
    iconBg: 'bg-red-500/10 text-red-500',
    date: 'Tue, 11 Jun 2026',
    price: '$102.99',
    status: 'Success',
  },
  {
    id: 3,
    activity: 'Grocery Purchase',
    icon: 'heroicons:shopping-bag',
    iconBg: 'bg-amber-500/10 text-amber-500',
    date: 'Sun, 09 Jun 2026',
    price: '$2,500.00',
    status: 'Success',
  },
]);
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-base font-black text-zinc-800 dark:text-white">Recent Transaction</h3>
      
      <button 
        @click="navigateTo('/transactions')"
        class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-zinc-150 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <Icon name="heroicons:funnel" class="text-xs" />
        <span>Filter</span>
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-zinc-100/80 dark:border-zinc-850">
            <th class="pb-3 text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-550 uppercase">Activity</th>
            <th class="pb-3 text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-550 uppercase">Date</th>
            <th class="pb-3 text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-550 uppercase">Price</th>
            <th class="pb-3 text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-550 uppercase">Status</th>
            <th class="pb-3 text-right"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-50 dark:divide-zinc-850">
          <tr v-for="tx in transactions" :key="tx.id" class="group hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10 transition-colors">
            <!-- Activity Info -->
            <td class="py-3.5 pr-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" :class="tx.iconBg">
                  <Icon :name="tx.icon" class="text-lg" />
                </div>
                <span class="text-xs font-bold text-zinc-850 dark:text-zinc-100 truncate max-w-[150px]">{{ tx.activity }}</span>
              </div>
            </td>
            
            <!-- Date -->
            <td class="py-3.5 text-xs font-semibold text-zinc-400 dark:text-zinc-500 pr-4">
              {{ tx.date }}
            </td>
            
            <!-- Price -->
            <td class="py-3.5 text-xs font-black text-zinc-850 dark:text-zinc-100 pr-4 font-mono">
              {{ tx.price }}
            </td>
            
            <!-- Status Badge -->
            <td class="py-3.5 pr-4">
              <span class="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
                <span>{{ tx.status }}</span>
              </span>
            </td>
            
            <!-- Actions -->
            <td class="py-3.5 text-right">
              <button class="w-7 h-7 rounded-full border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-650 transition-all opacity-0 group-hover:opacity-100">
                <Icon name="heroicons:ellipsis-horizontal" class="text-sm" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>
