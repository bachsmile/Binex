<script setup lang="ts">
interface TableHeader {
  key: string;
  label: string;
  class?: string;
  cellClass?: string;
}

const page = defineModel<number>('page');
const limit = defineModel<number>('limit');

const props = withDefaults(defineProps<{
  headers: TableHeader[];
  items?: any[];
  loading?: boolean;
  emptyText?: string;
  emptySubtext?: string;
  total?: number;
  label?: string;
}>(), {
  items: () => [],
  loading: false,
  emptyText: 'Không tìm thấy kết quả nào',
  emptySubtext: 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.',
  label: 'bản ghi',
});

const emit = defineEmits(['clear-filters']);
</script>

<template>
  <CmCard class="overflow-hidden border border-zinc-150/80 dark:border-zinc-855 bg-white dark:bg-zinc-950 shadow-sm transition-all duration-300">
    <div class="w-full">
      <!-- Loading Skeleton State -->
      <div v-if="loading" class="divide-y divide-zinc-100 dark:divide-zinc-900 animate-pulse">
        <div v-for="n in 5" :key="n" class="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4 w-1/3">
            <div class="w-11 h-11 bg-zinc-100 dark:bg-zinc-900 rounded-full shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-zinc-100 dark:bg-zinc-900 rounded w-3/4"></div>
              <div class="h-3 bg-zinc-100 dark:bg-zinc-900 rounded w-1/2"></div>
            </div>
          </div>
          <div class="h-4 bg-zinc-100 dark:bg-zinc-900 rounded w-1/6"></div>
          <div class="h-4 bg-zinc-100 dark:bg-zinc-900 rounded w-1/6"></div>
          <div class="h-4 bg-zinc-100 dark:bg-zinc-900 rounded w-1/12"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!items || items.length === 0" class="p-16 flex flex-col items-center justify-center text-center">
        <div class="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-650 mb-4 border border-zinc-100 dark:border-zinc-850 animate-bounce">
          <Icon name="heroicons:face-frown" class="text-3xl text-zinc-400 dark:text-zinc-550" />
        </div>
        <h3 class="font-bold text-zinc-800 dark:text-zinc-200">{{ emptyText }}</h3>
        <p class="text-xs text-zinc-400 dark:text-zinc-555 max-w-sm mt-1.5 leading-relaxed">
          {{ emptySubtext }}
        </p>
        <slot name="empty-actions">
          <CmButton 
            variant="outline" 
            size="md" 
            class="mt-6 border-zinc-200 dark:border-zinc-800 text-xs px-4" 
            @click="emit('clear-filters')"
          >
            Xóa bộ lọc
          </CmButton>
        </slot>
      </div>

      <!-- Live Table -->
      <div v-else class="w-full overflow-x-auto">
        <table class="w-full border-collapse text-left">
          <thead>
            <tr class="border-b border-zinc-150/80 dark:border-zinc-855 bg-primary/20 dark:bg-primary/10 text-zinc-500 dark:text-zinc-400 text-xs font-bold tracking-wider uppercase select-none">
              <th 
                v-for="header in headers" 
                :key="header.key" 
                class="py-5 px-6 animate-fade-in"
                :class="header.class"
              >
                {{ header.label }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 dark:divide-zinc-900">
            <tr 
              v-for="(item, index) in items" 
              :key="item.id || index"
              class="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors duration-150 group"
            >
              <td 
                v-for="header in headers" 
                :key="header.key" 
                class="py-4 px-6 whitespace-nowrap"
                :class="header.cellClass"
              >
                <slot :name="header.key" :item="item" :index="index">
                  <span class="text-xs text-zinc-700 dark:text-zinc-300">{{ item[header.key] }}</span>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Built-in CmPagination Footer (Only shown if page, limit, and total are provided) -->
      <CmPagination
        v-if="total !== undefined && page !== undefined && limit !== undefined"
        v-model:page="page"
        v-model:limit="limit"
        :total="total"
        :items-count="items?.length || 0"
        :label="label"
      />
    </div>
  </CmCard>
</template>
