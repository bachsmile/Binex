<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  statuses?: { label: string; value: string }[];
}

withDefaults(defineProps<Props>(), {
  statuses: () => [
    { label: 'Tất cả trạng thái', value: '' },
    { label: 'Đang chờ duyệt (Pending)', value: 'pending' },
    { label: 'Đã phê duyệt (Approved)', value: 'approved' },
    { label: 'Đã từ chối (Rejected)', value: 'rejected' },
  ]
});

const search = defineModel<string>('search', { default: '' });
const status = defineModel<string>('status', { default: '' });

const emit = defineEmits<{
  (e: 'clear'): void;
  (e: 'export'): void;
}>();

const handleClear = () => {
  search.value = '';
  status.value = '';
  emit('clear');
};
</script>

<template>
  <div class="w-full bg-white dark:bg-zinc-950 border border-zinc-150/80 dark:border-zinc-850 rounded-3xl p-4 shadow-sm transition-all duration-300">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <!-- Search Input -->
      <div class="relative flex-1 max-w-lg">
        <CmInput 
          v-model="search"
          placeholder="Tìm kiếm theo mã giao dịch hoặc khách hàng..."
          icon="heroicons:magnifying-glass"
          class="w-full"
        />
      </div>

      <!-- Filters Section -->
      <div class="flex flex-wrap items-center gap-3 justify-start lg:justify-end shrink-0">
        <!-- Status Filter -->
        <div class="relative min-w-[170px]">
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none flex items-center">
            <Icon name="heroicons:tag" class="text-sm" />
          </span>
          <select 
            v-model="status" 
            class="w-full pl-9 pr-8 py-2 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-full text-xs font-semibold text-zinc-650 dark:text-zinc-350 hover:border-zinc-250 dark:hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all duration-200 cursor-pointer"
          >
            <option v-for="opt in statuses" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-450 pointer-events-none flex items-center">
            <Icon name="heroicons:chevron-down" class="text-[10px]" />
          </span>
        </div>

        <!-- Export Button -->
        <CmButton 
          variant="outline" 
          size="md" 
          icon="heroicons:arrow-down-tray" 
          class="border-zinc-150 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-semibold px-4 py-2 rounded-full h-auto text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5"
          @click="emit('export')"
        >
          Xuất file
        </CmButton>

        <!-- Reset Button -->
        <CmButton 
          variant="ghost" 
          size="md" 
          icon="heroicons:arrow-path" 
          class="border border-zinc-150 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-semibold px-4 py-2 rounded-full h-auto text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5"
          @click="handleClear"
        >
          Làm mới
        </CmButton>
      </div>
    </div>
  </div>
</template>
