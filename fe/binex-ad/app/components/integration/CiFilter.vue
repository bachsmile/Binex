<script setup lang="ts">
import { ref } from 'vue';

interface FilterOption {
  label: string;
  value: string;
}

interface Props {
  roles?: FilterOption[];
  departments?: FilterOption[];
  statuses?: FilterOption[];
}

const props = withDefaults(defineProps<Props>(), {
  roles: () => [
    { label: 'Role: All', value: '' },
    { label: 'Super Admin', value: 'super_admin' },
    { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'manager' },
    { label: 'User', value: 'user' },
  ],
  departments: () => [
    { label: 'All Departments', value: '' },
    { label: 'Development', value: 'development' },
    { label: 'Sales & Marketing', value: 'sales_marketing' },
    { label: 'Operations', value: 'operations' },
    { label: 'Customer Success', value: 'customer_success' },
  ],
  statuses: () => [
    { label: 'All Statuses', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Inactive', value: 'inactive' },
  ]
});

// v-models using Vue 3.4 defineModel
const search = defineModel<string>('search', { default: '' });
const role = defineModel<string>('role', { default: '' });
const dateRange = defineModel<string>('dateRange', { default: '' });
const department = defineModel<string>('department', { default: '' });
const status = defineModel<string>('status', { default: '' });

// Local UI state
const isExpanded = ref(false);

const emit = defineEmits(['export', 'clear']);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const handleExport = () => {
  emit('export');
};

const handleClear = () => {
  search.value = '';
  role.value = '';
  dateRange.value = '';
  department.value = '';
  status.value = '';
  emit('clear');
};
</script>

<template>
  <div class="w-full bg-white dark:bg-zinc-950 border border-zinc-150/80 dark:border-zinc-850 rounded-3xl p-4 shadow-sm transition-all duration-300">
    <!-- Top Row -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      
      <!-- Search Box Section -->
      <div class="relative flex-1 max-w-lg">
        <CmInput 
          v-model="search"
          placeholder="Search anything..."
          icon="heroicons:magnifying-glass"
          class="w-full"
        />
        <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
          <Icon name="heroicons:adjustments-horizontal" class="text-lg" />
        </div>
      </div>

      <!-- Controls Right Section -->
      <div class="flex flex-wrap items-center gap-3 justify-start lg:justify-end shrink-0">
        
        <!-- Role Dropdown -->
        <div class="relative min-w-[130px]">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none flex items-center">
            <Icon name="heroicons:shield-check" class="text-base" />
          </span>
          <select 
            v-model="role" 
            class="w-full pl-9 pr-8 py-2 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-full text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:border-zinc-250 dark:hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all duration-200 cursor-pointer"
          >
            <option v-for="opt in roles" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-450 pointer-events-none flex items-center">
            <Icon name="heroicons:chevron-down" class="text-[10px]" />
          </span>
        </div>

        <!-- Date Range Filter -->
        <div class="relative min-w-[140px]">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none flex items-center">
            <Icon name="heroicons:calendar" class="text-base" />
          </span>
          <select 
            v-model="dateRange" 
            class="w-full pl-9 pr-8 py-2 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-full text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:border-zinc-250 dark:hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all duration-200 cursor-pointer"
          >
            <option value="">Date range</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="this_month">This month</option>
          </select>
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-450 pointer-events-none flex items-center">
            <Icon name="heroicons:chevron-down" class="text-[10px]" />
          </span>
        </div>

        <!-- Export Button -->
        <CmButton 
          variant="outline" 
          size="md" 
          icon="heroicons:arrow-down-tray" 
          class="border-zinc-150 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-semibold px-4 py-2 rounded-full h-auto text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5"
          @click="handleExport"
        >
          Export
        </CmButton>

        <!-- More Filters Button -->
        <CmButton 
          variant="ghost"
          size="md"
          class="text-xs font-semibold px-4 py-2 rounded-full h-auto flex items-center gap-1.5 transition-all duration-300"
          :class="isExpanded 
            ? 'bg-primary/10 text-primary hover:bg-primary/15' 
            : 'border border-zinc-150 dark:border-zinc-800 text-zinc-650 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900'"
          @click="toggleExpand"
        >
          <Icon name="heroicons:adjustments-vertical" class="text-base" />
          <span>More filters</span>
          <Icon :name="isExpanded ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" class="text-[10px]" />
        </CmButton>

      </div>
    </div>

    <!-- Collapsible More Filters Section -->
    <div 
      class="overflow-hidden transition-all duration-300 ease-in-out"
      :class="isExpanded ? 'max-h-[250px] opacity-100 mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-900' : 'max-h-0 opacity-0'"
    >
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
        
        <!-- Team / Department Dropdown -->
        <div class="md:col-span-5 flex flex-col gap-2">
          <label class="text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-550 uppercase">
            Team / Department
          </label>
          <div class="relative">
            <select 
              v-model="department" 
              class="w-full pl-4 pr-8 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl text-xs font-semibold text-zinc-600 dark:text-zinc-350 hover:border-zinc-250 dark:hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all duration-200 cursor-pointer"
            >
              <option v-for="opt in departments" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-450 pointer-events-none flex items-center">
              <Icon name="heroicons:chevron-down" class="text-[10px]" />
            </span>
          </div>
        </div>

        <!-- Status Dropdown -->
        <div class="md:col-span-5 flex flex-col gap-2">
          <label class="text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-550 uppercase">
            Status
          </label>
          <div class="relative">
            <select 
              v-model="status" 
              class="w-full pl-4 pr-8 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl text-xs font-semibold text-zinc-600 dark:text-zinc-350 hover:border-zinc-250 dark:hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all duration-200 cursor-pointer"
            >
              <option v-for="opt in statuses" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-450 pointer-events-none flex items-center">
              <Icon name="heroicons:chevron-down" class="text-[10px]" />
            </span>
          </div>
        </div>

        <!-- Clear Button -->
        <div class="md:col-span-2">
          <CmButton 
            variant="outline" 
            size="md" 
            icon="heroicons:arrow-path" 
            class="w-full border-zinc-150 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-bold py-2.5 rounded-2xl h-auto text-zinc-600 dark:text-zinc-350 flex items-center justify-center gap-1.5"
            @click="handleClear"
          >
            Clear All Filters
          </CmButton>
        </div>

      </div>
    </div>
  </div>
</template>
