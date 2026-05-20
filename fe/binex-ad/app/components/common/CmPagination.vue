<script setup lang="ts">
const page = defineModel<number>('page', { default: 1 });
const limit = defineModel<number>('limit', { default: 10 });

const props = withDefaults(defineProps<{
  total: number;
  itemsCount: number;
  label?: string;
}>(), {
  label: 'bản ghi',
});
</script>

<template>
  <!-- Pagination Footer -->
  <div class="px-10 py-4 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-950/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
    <span class="text-xs text-zinc-400 dark:text-zinc-550 font-bold">
      Hiển thị {{ itemsCount }} trong tổng số {{ total }} {{ label }}
    </span>

    <div class="flex items-center gap-3 self-end sm:self-auto">
      <!-- Page Limit Selector -->
      <div class="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-555 font-semibold">
        <span>Hiển thị</span>
        <select 
          v-model="limit" 
          class="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 text-xs font-bold rounded-lg px-2.5 py-1 text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </div>

      <div class="flex items-center gap-1.5">
        <CmButton 
          variant="outline"
          class="h-8 border-zinc-150 dark:border-zinc-850 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-50 text-xs text-zinc-600 dark:text-zinc-400 font-semibold rounded-lg flex items-center gap-1"
          :disabled="page === 1"
          @click="page--"
        >
          <Icon name="heroicons:chevron-left" class="text-sm" />
          <span>Trước</span>
        </CmButton>
        
        <span class="text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-150/40 dark:border-zinc-800">
          {{ page }}
        </span>

        <CmButton 
          variant="outline"
          class="h-8 border-zinc-150 dark:border-zinc-850 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-50 text-xs text-zinc-600 dark:text-zinc-400 font-semibold rounded-lg flex items-center gap-1"
          :disabled="page * limit >= total"
          @click="page++"
        >
          <span>Sau</span>
          <Icon name="heroicons:chevron-right" class="text-sm" />
        </CmButton>
      </div>
    </div>
  </div>
</template>
