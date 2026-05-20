<script setup lang="ts">
import { ref } from 'vue';

const activeYear = ref('This Year');
const showYearDropdown = ref(false);

const monthsData = [
  { month: 'Jan', value: 35, formattedValue: '$35,210.00' },
  { month: 'Feb', value: 45, formattedValue: '$45,800.00' },
  { month: 'Mar', value: 65, formattedValue: '$65,400.00' },
  { month: 'Apr', value: 50, formattedValue: '$50,110.00' },
  { month: 'May', value: 38, formattedValue: '$38,200.00' },
  { month: 'Jun', value: 55, formattedValue: '$55,000.00' },
  { month: 'Jul', value: 20, formattedValue: '$20,120.00' },
  { month: 'Aug', value: 85, formattedValue: '$84,849.93', highlight: true }, // Highlighted Month from Image
  { month: 'Sep', value: 68, formattedValue: '$68,450.00' },
  { month: 'Oct', value: 42, formattedValue: '$42,900.00' },
  { month: 'Nov', value: 52, formattedValue: '$52,100.00' },
  { month: 'Dec', value: 48, formattedValue: '$48,320.05' },
];

const selectYear = (year: string) => {
  activeYear.value = year;
  showYearDropdown.value = false;
};
</script>

<template>
  <CmCard class="p-7 relative overflow-visible flex flex-col justify-between h-[360px]">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Icon name="heroicons:presentation-chart-line" class="text-xl" />
        </div>
        <span class="text-sm font-bold text-zinc-550 dark:text-zinc-400">Overview</span>
      </div>
      
      <!-- Legends and Selector -->
      <div class="flex items-center gap-6">
        <!-- Legend Indicator -->
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/10"></span>
          <span class="text-xs text-zinc-500 dark:text-zinc-400 font-bold">Earnings</span>
        </div>
        
        <!-- Dropdown Selector -->
        <div class="relative">
          <button 
            @click="showYearDropdown = !showYearDropdown"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-100 hover:border-zinc-200 dark:border-zinc-800 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs font-bold text-zinc-700 dark:text-zinc-350 transition-colors"
          >
            <span>{{ activeYear }}</span>
            <Icon name="heroicons:chevron-down" class="text-[10px] text-zinc-400" />
          </button>
          
          <div 
            v-if="showYearDropdown"
            class="absolute right-0 top-full mt-1.5 w-32 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-xl shadow-lg z-20 py-1"
          >
            <button @click="selectYear('This Year')" class="w-full text-left px-3 py-1.5 text-xs text-zinc-750 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-semibold">
              This Year
            </button>
            <button @click="selectYear('Last Year')" class="w-full text-left px-3 py-1.5 text-xs text-zinc-750 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-semibold">
              Last Year
            </button>
          </div>
        </div>
        
        <!-- Options dot -->
        <button class="w-8 h-8 rounded-full border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-650 transition-colors">
          <Icon name="heroicons:ellipsis-horizontal" class="text-sm" />
        </button>
      </div>
    </div>

    <!-- Chart Grid Container -->
    <div class="flex-1 flex gap-4 mt-2 overflow-visible relative">
      <!-- Y-Axis -->
      <div class="flex flex-col justify-between text-[10px] font-bold text-zinc-400 font-mono pr-2 pb-6 pt-1 select-none">
        <span>$40k</span>
        <span>$30k</span>
        <span>$20k</span>
        <span>$10k</span>
        <span>$0k</span>
      </div>

      <!-- Bars Container -->
      <div class="flex-1 flex justify-between items-end pb-6 relative overflow-visible">
        
        <!-- Grid lines behind -->
        <div class="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 pt-1.5 opacity-30">
          <div v-for="n in 5" :key="n" class="w-full border-t border-dashed border-zinc-200 dark:border-zinc-800"></div>
        </div>

        <!-- Monthly columns -->
        <div 
          v-for="item in monthsData" 
          :key="item.month"
          class="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
        >
          <!-- Glowing Tooltip for Highlighted Month (August) -->
          <div 
            v-if="item.highlight"
            class="absolute bottom-[92%] z-10 bg-zinc-900 text-white px-3.5 py-2 rounded-2xl shadow-xl border border-zinc-850 flex flex-col items-center pointer-events-none animate-bounce-subtle"
          >
            <span class="text-[9px] text-zinc-400 font-black uppercase tracking-wider leading-none mb-0.5">Earnings</span>
            <span class="text-[12px] font-black leading-none font-mono">{{ item.formattedValue }}</span>
            <!-- Arrow -->
            <div class="w-2.5 h-2.5 bg-zinc-900 border-r border-b border-zinc-850 rotate-45 absolute bottom-[-5px]"></div>
          </div>

          <!-- Hover Tooltip for other months -->
          <div 
            class="absolute bottom-[95%] z-10 bg-zinc-900 text-white px-3 py-1.5 rounded-xl shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center"
            :class="item.highlight ? 'hidden' : ''"
          >
            <span class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider leading-none mb-0.5">{{ item.month }}</span>
            <span class="text-xs font-black leading-none font-mono">{{ item.formattedValue }}</span>
            <!-- Arrow -->
            <div class="w-2 h-2 bg-zinc-900 rotate-45 absolute bottom-[-4px]"></div>
          </div>

          <!-- The Bar Pill -->
          <div 
            class="w-8 sm:w-9 md:w-10 rounded-full transition-all duration-500 relative"
            :style="{ height: `${item.value}%` }"
            :class="item.highlight 
              ? 'bg-primary shadow-lg shadow-primary/20 hover:brightness-105' 
              : 'bg-primary/10 hover:bg-primary/20 dark:bg-primary/10 dark:hover:bg-primary/15'"
          >
            <!-- Cap indicator circle for highlighted item -->
            <div 
              v-if="item.highlight"
              class="w-3.5 h-3.5 rounded-full bg-white border-[3.5px] border-primary absolute top-1.5 left-1/2 -translate-x-1/2 shadow-sm pointer-events-none"
            ></div>
          </div>

          <!-- Month Label -->
          <span class="absolute bottom-[-22px] text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase">
            {{ item.month }}
          </span>
        </div>

      </div>
    </div>
  </CmCard>
</template>

<style scoped>
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.animate-bounce-subtle {
  animation: bounce-subtle 3s ease-in-out infinite;
}
</style>
