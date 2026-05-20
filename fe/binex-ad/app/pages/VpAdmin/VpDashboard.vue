<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  path: '',
  layout: 'admin'
});

// Search model
const searchQuery = ref('');
</script>

<template>
  <div class="flex-1 flex flex-col min-w-0">
    <!-- Top Utilities Utility Bar -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      
      <!-- Left: Search Input -->
      <div class="w-full max-w-md">
        <CmInput 
          v-model="searchQuery" 
          placeholder="Search transactions, savings, or settings..." 
          icon="heroicons:magnifying-glass"
          hint="⌘ K"
        />
      </div>

      <!-- Right: Utility Icons & User Avatar -->
      <div class="flex items-center justify-end gap-3.5 ml-auto">
        <!-- Help Button -->
        <CmButton 
          variant="outline" 
          icon="heroicons:question-mark-circle" 
          iconOnly 
          class="w-10 h-10 hover:bg-zinc-100/80 dark:hover:bg-zinc-900 border-zinc-100 dark:border-zinc-850 text-zinc-400 hover:text-zinc-650"
        />
        
        <!-- Inbox Button -->
        <div class="relative">
          <CmButton 
            variant="outline" 
            icon="heroicons:envelope" 
            iconOnly 
            class="w-10 h-10 hover:bg-zinc-100/80 dark:hover:bg-zinc-900 border-zinc-100 dark:border-zinc-855 text-zinc-400 hover:text-zinc-650"
          />
          <span class="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary ring-2 ring-white dark:ring-zinc-955 pointer-events-none"></span>
        </div>
        
        <!-- Notification Button -->
        <div class="relative">
          <CmButton 
            variant="outline" 
            icon="heroicons:bell" 
            iconOnly 
            class="w-10 h-10 hover:bg-zinc-100/80 dark:hover:bg-zinc-900 border-zinc-100 dark:border-zinc-855 text-zinc-400 hover:text-zinc-650"
          />
          <span class="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary ring-2 ring-white dark:ring-zinc-955 pointer-events-none"></span>
        </div>

        <!-- User Profile Dropdown -->
        <div class="h-10 border-l border-zinc-150 dark:border-zinc-800 mx-1"></div>
        
        <CmButton 
          variant="ghost" 
          class="flex items-center gap-2 hover:opacity-90 transition-opacity px-2 py-1"
        >
          <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-zinc-900 shadow-sm shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
              alt="Sajibur Rahman Avatar" 
              class="w-full h-full object-cover" 
            />
          </div>
          <Icon name="heroicons:chevron-down" class="text-[10px] text-zinc-400" />
        </CmButton>
      </div>
    </header>

    <!-- Welcome Banner Dashboard Title Section -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
          Welcome back Sajibur Rahman
        </h1>
        <p class="text-xs sm:text-sm text-zinc-400 dark:text-zinc-550 font-medium mt-2">
          Monitor and control what happens with your money today for financial health.
        </p>
      </div>
      
      <!-- Right Widgets -->
      <div class="flex items-center gap-3 shrink-0">
        <!-- Current Date badge -->
        <div class="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-4 py-2.5 rounded-full text-xs font-bold text-zinc-550 dark:text-zinc-350 shadow-sm">
          <Icon name="heroicons:calendar" class="text-sm text-zinc-400" />
          <span>Sun, 12 June 2026</span>
        </div>

        <!-- Export Button -->
        <CmButton variant="secondary" size="md" icon="heroicons:arrow-up-tray" class="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs px-4 py-2.5">
          Export
        </CmButton>
      </div>
    </section>

    <!-- The Perfectly Balanced Dashboard Grid System -->
    <main class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      
      <!-- LEFT COLUMN (col-span-5) -->
      <div class="xl:col-span-5 space-y-8 flex flex-col">
        
        <!-- Balance Card Widget -->
        <CpDashboardBalanceCard />

        <!-- My Wallet Card Block -->
        <CmCard class="p-7">
          <CpDashboardWallet />
        </CmCard>

        <!-- My Savings Plan Block -->
        <CmCard class="p-7">
          <CpDashboardSavingsPlan />
        </CmCard>

      </div>

      <!-- RIGHT COLUMN (col-span-7) -->
      <div class="xl:col-span-7 space-y-8 flex flex-col">
        
        <!-- Expenses & Savings Side-by-Side widgets -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CpDashboardExpensesCard />
          <CpDashboardSavingsCard />
        </div>

        <!-- Overview Earning Chart widget -->
        <CpDashboardOverviewChart />

        <!-- Recent Transactions list widget -->
        <CmCard class="p-7">
          <CpDashboardTransactions />
        </CmCard>

      </div>

    </main>
  </div>
</template>

<style scoped>
/* Page-specific dashboard stylings */
</style>
