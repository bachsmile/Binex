<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { User } from '~/types/user';

definePageMeta({
  path: '/supper/users',
  layout: 'supper',
});

const searchQuery = ref('');
const selectedRole = ref('');
const selectedDateRange = ref('');
const selectedDepartment = ref('');
const selectedStatus = ref('');
const page = ref(1);
const limit = ref(10);

const users = ref<User[]>([]);
const totalUsers = ref(0);
const loading = ref(false);

const userApi = useUserApi();

// Modal States
const isCreateOpen = ref(false);
const isDetailsOpen = ref(false);
const selectedUser = ref<User | null>(null);

// Toast States
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref<'success' | 'error'>('success');

const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 4000);
};

const handleClear = () => {
  searchQuery.value = '';
  selectedRole.value = '';
  selectedStatus.value = '';
  selectedDepartment.value = '';
  selectedDateRange.value = '';
  page.value = 1;
};

const handleExport = () => {
  alert('Đang xuất danh sách người dùng quản lý ra file CSV...');
};

const openDetailsModal = (user: User) => {
  selectedUser.value = user;
  isDetailsOpen.value = true;
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await userApi.findAll({
      page: page.value,
      limit: limit.value,
      status: selectedStatus.value || undefined,
      role: selectedRole.value || undefined,
      search: searchQuery.value || undefined,
    });
    
    if (response && response.status) {
      users.value = response.data || [];
      totalUsers.value = response.total || 0;
    } else {
      users.value = [];
      totalUsers.value = 0;
    }
  } catch (err) {
    console.error('Failed to fetch managed users:', err);
  } finally {
    loading.value = false;
  }
};

// Reset page when filters change
watch([searchQuery, selectedRole, selectedStatus, selectedDepartment], () => {
  page.value = 1;
});

// Reactively trigger fetch on any query/filter/pagination changes
watch([searchQuery, selectedRole, selectedStatus, page, limit], () => {
  fetchUsers();
});

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="flex-1 flex flex-col min-w-0">
    <!-- Header Section -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
          Nhóm Người dùng quản lý
        </h1>
        <p class="text-xs sm:text-sm text-zinc-455 dark:text-zinc-550 font-medium mt-2">
          Xem và kiểm soát toàn bộ danh sách tài khoản người dùng trực thuộc quyền quản lý của bạn.
        </p>
      </div>
      
      <!-- Add User Action Button -->
      <div class="flex items-center gap-3 shrink-0">
        <CmButton 
          variant="primary" 
          icon="heroicons:user-plus" 
          class="text-xs font-bold shadow-sm shadow-primary/10"
          @click="isCreateOpen = true"
        >
          Thêm người dùng
        </CmButton>
      </div>
    </section>

    <!-- Filters component -->
    <div class="mb-8">
      <CpSupperUsersFilter 
        v-model:search="searchQuery"
        v-model:role="selectedRole"
        v-model:dateRange="selectedDateRange"
        v-model:department="selectedDepartment"
        v-model:status="selectedStatus"
        @export="handleExport"
        @clear="handleClear"
      />
    </div>

    <!-- Table component -->
    <CpSupperUsersTable 
      v-model:page="page"
      v-model:limit="limit"
      :total="totalUsers"
      :items="users"
      :loading="loading"
      @clear-filters="handleClear"
      @view-details="openDetailsModal"
    />

    <!-- Create User Modal -->
    <CpSupperUsersCreateModal 
      v-model:isOpen="isCreateOpen"
      @success="fetchUsers"
      @toast="triggerToast"
    />

    <!-- User Details Modal -->
    <CpSupperUsersDetailsModal 
      v-model:isOpen="isDetailsOpen"
      :user="selectedUser"
      @updated="fetchUsers"
      @toast="triggerToast"
    />

    <!-- Beautiful Toast Notification Overlay -->
    <Transition name="slide">
      <div 
        v-if="showToast" 
        class="fixed top-6 right-6 z-[100] max-w-sm w-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border rounded-2xl p-4 shadow-lg flex items-start gap-3 transition-all duration-300"
        :class="toastType === 'success' ? 'border-emerald-150/80 dark:border-emerald-950/30' : 'border-red-150/80 dark:border-red-950/30'"
      >
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          :class="toastType === 'success' ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30' : 'bg-red-50 text-red-500 dark:bg-red-950/30'"
        >
          <Icon :name="toastType === 'success' ? 'heroicons:check-circle' : 'heroicons:x-circle'" class="text-xl" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-zinc-900 dark:text-white leading-tight select-none">
            {{ toastType === 'success' ? 'Thành công' : 'Thất bại' }}
          </p>
          <p class="text-[11px] text-zinc-550 dark:text-zinc-400 mt-1 font-medium leading-relaxed">
            {{ toastMessage }}
          </p>
        </div>
        <CmButtonBase 
          class="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200"
          @click="showToast = false"
        >
          <Icon name="heroicons:x-mark" class="text-sm" />
        </CmButtonBase>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Page-specific styling overrides */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
