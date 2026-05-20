<script setup lang="ts">
import { ref } from 'vue';

const showOptions = ref(false);
</script>

<template>
  <CmCard class="p-7 flex flex-col justify-between h-[210px] relative">
    
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
          <Icon name="heroicons:sparkles" class="text-xl" />
        </div>
        <span class="text-sm font-bold text-zinc-500 dark:text-zinc-400">Total Savings</span>
      </div>
      
      <!-- Option Trigger -->
      <div class="relative">
        <button 
          @click="showOptions = !showOptions"
          class="w-8 h-8 rounded-full border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-655 transition-colors"
        >
          <Icon name="heroicons:ellipsis-horizontal" class="text-sm" />
        </button>
        
        <div 
          v-if="showOptions"
          class="absolute right-0 top-full mt-1.5 w-32 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-xl shadow-lg z-20 py-1"
        >
          <button @click="showOptions = false" class="w-full text-left px-3.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">
            View Details
          </button>
          <button @click="showOptions = false" class="w-full text-left px-3.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">
            Export Report
          </button>
        </div>
      </div>
    </div>

    <!-- Amount -->
    <div class="mt-4">
      <div class="text-[30px] font-black tracking-tight text-zinc-900 dark:text-white leading-none">
        $18,420.75
      </div>
      
      <!-- Statistics Badge -->
      <div class="flex items-center gap-2 mt-3">
        <div class="inline-flex items-center gap-1 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
          <Icon name="heroicons:arrow-up-right" class="text-xs font-black" />
          <span>+4.5%</span>
        </div>
        <span class="text-xs text-zinc-400 dark:text-zinc-500 font-medium">from last month</span>
      </div>
    </div>

  </CmCard>
</template>
