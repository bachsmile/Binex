<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { User } from '~/types/user';

definePageMeta({
  path: '/supper/users',
  layout: 'supper'
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

// Modal creation & toast notification states
const isCreateOpen = ref(false);
const createLoading = ref(false);
const createError = ref('');

const createForm = ref({
  userName: '',
  password: '',
  code: useCookie('user_code').value || '',
});

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

const openCreateModal = () => {
  createForm.value = {
    userName: '',
    password: '',
    code: useCookie('user_code').value || '',
  };
  createError.value = '';
  isCreateOpen.value = true;
};

const handleCreateUser = async () => {
  if (!createForm.value.userName.trim()) {
    createError.value = 'Vui lòng nhập tên đăng nhập';
    return;
  }
  if (createForm.value.userName.trim().length < 3) {
    createError.value = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    return;
  }
  if (!createForm.value.password) {
    createError.value = 'Vui lòng nhập mật khẩu';
    return;
  }
  if (createForm.value.password.length < 6) {
    createError.value = 'Mật khẩu phải có ít nhất 6 ký tự';
    return;
  }

  createLoading.value = true;
  createError.value = '';

  try {
    const response = await userApi.create({
      userName: createForm.value.userName.trim(),
      password: createForm.value.password,
      code: createForm.value.code || undefined,
    });

    if (response && response.status) {
      triggerToast('Thêm tài khoản người dùng mới thành công!');
      isCreateOpen.value = false;
      await fetchUsers(); // Refresh list!
    } else {
      const errMsg = userApi.error.value?.message;
      createError.value = Array.isArray(errMsg)
        ? errMsg[0]
        : (errMsg || 'Tạo người dùng thất bại. Vui lòng kiểm tra lại.');
    }
  } catch (err: any) {
    createError.value = err.message || 'Có lỗi hệ thống xảy ra.';
  } finally {
    createLoading.value = false;
  }
};

const tableHeaders = [
  { key: 'profile', label: 'Hồ sơ người dùng' },
  { key: 'role', label: 'Vai trò' },
  { key: 'contact', label: 'Liên hệ' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'permissions', label: 'Quyền hạn' },
  { key: 'createdAt', label: 'Ngày tham gia' },
  { key: 'actions', label: 'Hành động', class: 'text-right', cellClass: 'text-right' }
];

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

// Format date helper
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const handleExport = () => {
  // A premium toast message simulation
  alert('Exporting managed users list to CSV file...');
};

const handleClear = () => {
  searchQuery.value = '';
  selectedRole.value = '';
  selectedStatus.value = '';
  selectedDepartment.value = '';
  selectedDateRange.value = '';
  page.value = 1;
};

// Details Modal State
const selectedUser = ref<User | null>(null);
const isDetailsOpen = ref(false);
const activeTab = ref<'info' | 'permissions' | 'banks' | 'wallet' | 'transactions'>('info');

const tabs = [
  { id: 'info', label: 'Thông tin tài khoản', icon: 'heroicons:user-circle' },
  { id: 'permissions', label: 'Nhóm quyền', icon: 'heroicons:shield-check' },
  { id: 'banks', label: 'Phương thức thanh toán', icon: 'heroicons:credit-card' },
  { id: 'wallet', label: 'Ví tài khoản', icon: 'heroicons:wallet' },
  { id: 'transactions', label: 'Lịch sử giao dịch', icon: 'heroicons:arrow-path' }
];

const userBanks = ref<any[]>([]);
const userWallets = ref<any[]>([]);
const userTransactions = ref<any[]>([]);
const loadingTabDetails = ref(false);

const openDetailsModal = async (user: User) => {
  selectedUser.value = user;
  activeTab.value = 'info';
  isDetailsOpen.value = true;
  
  loadingTabDetails.value = true;
  try {
    // Generate realistic, user-scoped mock datasets for advanced demonstration
    userBanks.value = [
      { id: '1', bankName: 'Vietcombank (VCB)', accountNo: '1023948576', accountName: user.fullName || user.userName.toUpperCase(), isDefault: true, branch: 'Chi nhánh Hà Nội' },
      { id: '2', bankName: 'Techcombank (TCB)', accountNo: '19034875629012', accountName: user.fullName || user.userName.toUpperCase(), isDefault: false, branch: 'Chi nhánh Hồ Chí Minh' }
    ];

    userWallets.value = [
      { id: 'w1', name: 'Ví Chính (VND)', code: 'VND', balance: 45290000, flag: 'circle-flags:vn', status: 'Active' },
      { id: 'w2', name: 'Ví Quảng Cáo (USD)', code: 'USD', balance: 1250, flag: 'circle-flags:us', status: 'Active' },
      { id: 'w3', name: 'Ví Khuyến Mãi (VND)', code: 'PROMO', balance: 500000, flag: 'circle-flags:vn', status: 'Active' }
    ];

    userTransactions.value = [
      { id: 'TX9082', type: 'deposit', amount: 5000000, status: 'success', date: '2026-05-18T10:30:00Z', description: 'Nạp tiền qua Techcombank' },
      { id: 'TX8941', type: 'upgrade', amount: -2990000, status: 'success', date: '2026-05-15T14:20:00Z', description: 'Mua gói dịch vụ mnfinance' },
      { id: 'TX8810', type: 'withdraw', amount: 10000000, status: 'pending', date: '2026-05-19T08:15:00Z', description: 'Rút tiền về Vietcombank' }
    ];
  } catch (err) {
    console.error('Failed to load tab details', err);
  } finally {
    loadingTabDetails.value = false;
  }
};
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
          @click="openCreateModal"
        >
          Thêm người dùng
        </CmButton>
      </div>
    </section>

    <!-- CiFilter Reusable Filter Toolbar Component -->
    <div class="mb-8">
      <CiFilter 
        v-model:search="searchQuery"
        v-model:role="selectedRole"
        v-model:dateRange="selectedDateRange"
        v-model:department="selectedDepartment"
        v-model:status="selectedStatus"
        @export="handleExport"
        @clear="handleClear"
      />
    </div>

    <!-- Reusable Smart Table Component -->
    <CmTable
      v-model:page="page"
      v-model:limit="limit"
      :total="totalUsers"
      :headers="tableHeaders"
      :items="users"
      :loading="loading"
      label="tài khoản"
      empty-text="Không tìm thấy người dùng nào"
      empty-subtext="Thử thay đổi từ khóa tìm kiếm hoặc lọc các bộ phận và trạng thái khác để tìm kết quả."
      @clear-filters="handleClear"
    >
        <!-- Custom slot: profile -->
        <template #profile="{ item: user }">
          <div class="flex items-center gap-3.5 cursor-pointer group/profile" @click="openDetailsModal(user)">
            <el-avatar
              :src="user.avatar || 'https://api.dicebear.com/9.x/avataaars/svg?seed=' + user.id"
              :size="36"
              class="shrink-0 font-bold bg-primary/10 text-primary border border-zinc-150/80 dark:border-zinc-800 shadow-sm transition-transform group-hover/profile:scale-105"
            />
            <div class="flex flex-col">
              <span class="text-[13px] font-bold text-zinc-850 dark:text-zinc-100 group-hover/profile:text-primary transition-colors">
                {{ user.userName || 'Chưa cập nhật' }}
              </span>
              <span v-if="user.fullName" class="text-xs text-zinc-400 dark:text-zinc-555 font-medium">
                @{{ user.fullName }}
              </span>
            </div>
          </div>
        </template>

        <!-- Custom slot: role -->
        <template #role="{ item: user }">
          <span 
            class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase select-none tracking-wide"
            :class="{
              'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-100/50 dark:border-emerald-900/30': user.role === 'super_admin',
              'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-405 border border-blue-100/50 dark:border-blue-900/30': user.role === 'admin',
              'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-405 border border-indigo-100/50 dark:border-indigo-900/30': user.role === 'manager',
              'bg-zinc-50 text-zinc-550 dark:bg-zinc-900 dark:text-zinc-400 border border-zinc-150 dark:border-zinc-800': user.role === 'user'
            }"
          >
            {{ user.role }}
          </span>
        </template>

        <!-- Custom slot: contact -->
        <template #contact="{ item: user }">
          <div class="flex flex-col text-xs font-semibold">
            <span class="text-zinc-700 dark:text-zinc-300">{{ user.email || 'N/A' }}</span>
            <span class="text-zinc-400 dark:text-zinc-550 text-[10px] mt-0.5 font-medium">{{ user.phone || 'N/A' }}</span>
          </div>
        </template>

        <!-- Custom slot: status -->
        <template #status="{ item: user }">
          <div class="flex items-center gap-1.5 select-none">
            <span 
              class="w-1.5 h-1.5 rounded-full animate-pulse"
              :class="{
                'bg-primary': user.status === 'active',
                'bg-amber-500': user.status === 'pending',
                'bg-red-500': user.status === 'inactive'
              }"
            ></span>
            <span 
              class="text-[11px] font-bold capitalize"
              :class="{
                'text-primary': user.status === 'active',
                'text-amber-500 dark:text-amber-400': user.status === 'pending',
                'text-red-500 dark:text-red-400': user.status === 'inactive'
              }"
            >
              {{ user.status }}
            </span>
          </div>
        </template>

        <!-- Custom slot: permissions -->
        <template #permissions="{ item: user }">
          <div class="flex flex-wrap gap-1.5 max-w-[200px]">
            <span 
              v-for="perm in user.userPermissions" 
              :key="perm.id"
              class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase select-none border"
              :class="perm.packName 
                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-450 border-amber-100/50 dark:border-amber-900/30' 
                : 'bg-primary/5 text-primary dark:bg-primary/10 border-primary/20'"
              :title="perm.expiredAt ? `Hết hạn: ${formatDate(perm.expiredAt)}` : 'Vĩnh viễn'"
            >
              {{ perm.packName || perm.serName || 'Quyền hạn' }}
            </span>
            <span 
              v-if="!user.userPermissions || user.userPermissions.length === 0"
              class="text-[11px] text-zinc-400 dark:text-zinc-550 font-medium italic"
            >
              Chưa phân quyền
            </span>
          </div>
        </template>

        <!-- Custom slot: createdAt -->
        <template #createdAt="{ item: user }">
          <span class="text-xs text-zinc-450 dark:text-zinc-550 font-semibold">
            {{ formatDate(user.createdAt) }}
          </span>
        </template>

        <!-- Custom slot: actions -->
        <template #actions="{ item: user }">
          <div class="inline-flex items-center gap-2">
            <CmButton 
              variant="outline" 
              icon="heroicons:eye" 
              class="h-8 text-[11px] border-zinc-150 dark:border-zinc-800 font-bold px-3 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-655 dark:text-zinc-300"
              title="Chi tiết tài khoản"
              @click="openDetailsModal(user)"
            >
              Chi tiết
            </CmButton>
            <CmButton 
              variant="ghost" 
              icon="heroicons:ellipsis-horizontal" 
              iconOnly 
              class="w-8 h-8 rounded-full text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200"
            />
          </div>
        </template>
    </CmTable>

    <!-- Create User Modal Dialog -->
    <CmDialog
      v-model:isOpen="isCreateOpen"
      title="Thêm tài khoản người dùng mới"
      size="md"
    >
      <div class="space-y-5">
        <!-- Error alert if any -->
        <div 
          v-if="createError" 
          class="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-900/30 rounded-xl text-xs font-bold text-red-500 flex items-center gap-2 select-none"
        >
          <Icon name="heroicons:information-circle" class="text-base shrink-0" />
          <span>{{ createError }}</span>
        </div>

        <div class="space-y-4">
          <!-- Username Input -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
              Tên đăng nhập <span class="text-red-500">*</span>
            </label>
            <CmInput 
              v-model="createForm.userName"
              placeholder="Nhập tên đăng nhập của tài khoản mới"
              icon="heroicons:user"
            />
          </div>

          <!-- Password Input -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-555 select-none">
              Mật khẩu <span class="text-red-500">*</span>
            </label>
            <CmInput 
              v-model="createForm.password"
              type="password"
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              icon="heroicons:lock-closed"
            />
          </div>

          <!-- Referral / Manager Code Input -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-555 select-none">
              Mã người giới thiệu / quản lý
            </label>
            <CmInput 
              v-model="createForm.code"
              placeholder="Nhập mã code giới thiệu hoặc mã để gán nhóm"
              icon="heroicons:ticket"
            />
            <p class="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed select-none">
              Mặc định mã giới thiệu của bạn được tự động điền để gán tài khoản mới trực thuộc bạn quản lý.
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <CmButton 
          variant="ghost" 
          size="md" 
          class="text-xs font-semibold px-5" 
          :disabled="createLoading"
          @click="isCreateOpen = false"
        >
          Hủy bỏ
        </CmButton>
        <CmButton 
          variant="primary" 
          size="md" 
          class="text-xs font-bold px-5 shadow-sm shadow-primary/10" 
          :loading="createLoading"
          @click="handleCreateUser"
        >
          Tạo tài khoản
        </CmButton>
      </template>
    </CmDialog>

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
            Thành công
          </p>
          <p class="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-medium leading-relaxed">
            {{ toastMessage }}
          </p>
        </div>
        <button 
          class="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200"
          @click="showToast = false"
        >
          <Icon name="heroicons:x-mark" class="text-sm" />
        </button>
      </div>
    </Transition>

    <!-- Advanced User Details Dialog Modal (Sleek tabbed view) -->
    <CmDialog
      v-model:isOpen="isDetailsOpen"
      :title="`Chi tiết tài khoản: ${selectedUser?.userName || ''}`"
      size="xl"
    >
      <div v-if="selectedUser" class="space-y-6">
        <!-- Tab Navigation Header -->
        <div class="flex items-center gap-1 border-b border-zinc-100 dark:border-zinc-800 pb-3 overflow-x-auto select-none no-scrollbar">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap"
            :class="activeTab === tab.id 
              ? 'bg-primary/10 text-primary dark:bg-primary/20' 
              : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'"
            @click="activeTab = tab.id"
          >
            <Icon :name="tab.icon" class="text-sm" />
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <!-- Tab 1: Account Information -->
        <div v-if="activeTab === 'info'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Profile Card -->
          <div class="p-6 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-150/60 dark:border-zinc-800/40 rounded-[2rem] flex flex-col items-center text-center">
            <el-avatar
              :src="selectedUser.avatar || 'https://api.dicebear.com/9.x/avataaars/svg?seed=' + selectedUser.id"
              :size="80"
              class="font-bold bg-primary/10 text-primary border border-zinc-200 dark:border-zinc-800 shadow-md mb-4"
            />
            <h3 class="text-base font-black text-zinc-900 dark:text-white leading-tight">
              {{ selectedUser.userName }}
            </h3>
            <p v-if="selectedUser.fullName" class="text-xs text-zinc-450 dark:text-zinc-500 font-bold mt-1">
              @{{ selectedUser.fullName }}
            </p>
            <span 
              class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase select-none tracking-wide mt-3"
              :class="{
                'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-100/50 dark:border-emerald-900/30': selectedUser.role === 'super_admin',
                'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-405 border border-blue-100/50 dark:border-blue-900/30': selectedUser.role === 'admin',
                'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-405 border border-indigo-100/50 dark:border-indigo-900/30': selectedUser.role === 'manager',
                'bg-zinc-50 text-zinc-550 dark:bg-zinc-900 dark:text-zinc-400 border border-zinc-150 dark:border-zinc-800': selectedUser.role === 'user'
              }"
            >
              {{ selectedUser.role }}
            </span>

            <div class="w-full border-t border-zinc-100 dark:border-zinc-850 mt-6 pt-5 space-y-3.5 text-xs text-left">
              <div class="flex items-center justify-between">
                <span class="text-zinc-400 font-semibold">Trạng thái:</span>
                <span class="font-extrabold capitalize text-primary">{{ selectedUser.status }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-zinc-400 font-semibold">Ngày tham gia:</span>
                <span class="font-bold text-zinc-650 dark:text-zinc-300">{{ formatDate(selectedUser.createdAt) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-zinc-400 font-semibold">Mã quản lý:</span>
                <span class="font-bold text-zinc-655 dark:text-zinc-300 font-mono text-[10px]">{{ selectedUser.code || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <!-- Detailed Information Grid -->
          <div class="lg:col-span-2 p-6 border border-zinc-150/80 dark:border-zinc-850 rounded-[2rem] space-y-6">
            <div>
              <h4 class="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 select-none">Thông tin liên hệ</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100/60 dark:border-zinc-800/40 rounded-2xl">
                  <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Địa chỉ Email</p>
                  <p class="text-xs font-bold text-zinc-850 dark:text-zinc-200 mt-1 select-all">{{ selectedUser.email || 'Chưa liên kết' }}</p>
                </div>
                <div class="p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100/60 dark:border-zinc-800/40 rounded-2xl">
                  <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Số điện thoại</p>
                  <p class="text-xs font-bold text-zinc-850 dark:text-zinc-200 mt-1 select-all">{{ selectedUser.phone || 'Chưa liên kết' }}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 select-none">Địa chỉ & Vùng miền</h4>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100/60 dark:border-zinc-800/40 rounded-2xl">
                  <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Thành phố / Tỉnh</p>
                  <p class="text-xs font-bold text-zinc-850 dark:text-zinc-200 mt-1">{{ selectedUser.city || 'N/A' }}</p>
                </div>
                <div class="p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100/60 dark:border-zinc-800/40 rounded-2xl">
                  <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Quốc gia</p>
                  <p class="text-xs font-bold text-zinc-850 dark:text-zinc-200 mt-1">{{ selectedUser.country || 'N/A' }}</p>
                </div>
                <div class="p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100/60 dark:border-zinc-800/40 rounded-2xl">
                  <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Mã Bưu Điện (ZIP)</p>
                  <p class="text-xs font-bold text-zinc-850 dark:text-zinc-200 mt-1">{{ selectedUser.zip || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 select-none">Dung lượng bộ nhớ lưu trữ</h4>
              <div class="p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100/60 dark:border-zinc-800/40 rounded-2xl">
                <div class="flex items-center justify-between text-xs mb-2">
                  <span class="text-zinc-500 font-semibold">Đã sử dụng: <strong class="text-zinc-800 dark:text-white">{{ (selectedUser.usedStorage || 0).toLocaleString() }} MB</strong></span>
                  <span class="text-zinc-450 font-medium">Tổng hạn mức: {{ (selectedUser.storageLimit || 0).toLocaleString() }} MB</span>
                </div>
                <!-- Progress bar -->
                <div class="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-primary transition-all duration-500"
                    :style="{ width: `${Math.min(100, ((selectedUser.usedStorage || 0) / (selectedUser.storageLimit || 1)) * 100)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Role Groups & Permissions -->
        <div v-else-if="activeTab === 'permissions'" class="space-y-4">
          <div class="flex items-center justify-between select-none">
            <h4 class="text-xs font-black text-zinc-455 dark:text-zinc-500 uppercase tracking-wider">Nhóm quyền & Gói dịch vụ đã cấp</h4>
          </div>

          <div v-if="selectedUser.userPermissions && selectedUser.userPermissions.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="perm in selectedUser.userPermissions" 
              :key="perm.id"
              class="p-5 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-150/60 dark:border-zinc-800/40 rounded-2xl flex flex-col justify-between"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                    <Icon name="heroicons:sparkles" class="text-base" />
                  </div>
                  <div>
                    <h4 class="text-xs font-black text-zinc-800 dark:text-zinc-100">
                      {{ perm.packName || perm.serName || 'Quyền hạn' }}
                    </h4>
                    <p class="text-[9px] text-zinc-400 mt-0.5">Mã quyền: #{{ perm.id.slice(0, 8) }}</p>
                  </div>
                </div>
                <span class="text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full select-none font-sans uppercase">
                  Hoạt động
                </span>
              </div>
              <div class="border-t border-zinc-100 dark:border-zinc-800/60 mt-4 pt-3 flex items-center justify-between text-xs">
                <span class="text-zinc-455 font-medium">Hạn sử dụng:</span>
                <span class="font-bold text-zinc-700 dark:text-zinc-300">
                  {{ perm.expiredAt ? formatDate(perm.expiredAt) : 'Vĩnh viễn' }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] select-none">
            <Icon name="heroicons:shield-exclamation" class="text-3xl text-zinc-300 dark:text-zinc-700 mb-2" />
            <p class="text-xs text-zinc-450 dark:text-zinc-500 font-bold">Chưa cấp nhóm quyền nào</p>
          </div>
        </div>

        <!-- Tab 3: Payment Methods (Bank) -->
        <div v-else-if="activeTab === 'banks'" class="space-y-4">
          <div class="flex items-center justify-between select-none">
            <h4 class="text-xs font-black text-zinc-455 dark:text-zinc-500 uppercase tracking-wider">Danh sách tài khoản ngân hàng liên kết</h4>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="bank in userBanks" 
              :key="bank.id"
              class="p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900/60 dark:to-zinc-950/80 border-zinc-200/80 dark:border-zinc-800/60"
            >
              <div class="flex items-start justify-between relative z-10">
                <div class="flex items-center gap-2.5">
                  <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                    <Icon name="heroicons:building-library" class="text-base" />
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-zinc-850 dark:text-zinc-100">{{ bank.bankName }}</h4>
                    <p class="text-[9px] text-zinc-400 font-medium mt-0.5">{{ bank.branch }}</p>
                  </div>
                </div>
                <span 
                  v-if="bank.isDefault" 
                  class="text-[9px] font-bold bg-primary/10 text-primary border border-primary/25 px-2.5 py-0.5 rounded-full select-none"
                >
                  Mặc định
                </span>
              </div>
              <div class="mt-6 relative z-10">
                <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider select-none">Số tài khoản</p>
                <p class="text-base font-black text-zinc-800 dark:text-white tracking-widest mt-0.5 select-all">{{ bank.accountNo }}</p>
              </div>
              <div class="mt-4 flex items-center justify-between relative z-10">
                <div>
                  <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider select-none">Chủ tài khoản</p>
                  <p class="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mt-0.5">{{ bank.accountName }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 4: Account Wallets -->
        <div v-else-if="activeTab === 'wallet'" class="space-y-4">
          <div class="flex items-center justify-between select-none">
            <h4 class="text-xs font-black text-zinc-455 dark:text-zinc-500 uppercase tracking-wider">Số dư ví tài khoản</h4>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              v-for="wallet in userWallets" 
              :key="wallet.id"
              class="p-5 rounded-[1.75rem] border border-zinc-150/60 dark:border-zinc-800/40 relative overflow-hidden flex flex-col justify-between h-[135px] hover:shadow-md transition-all duration-300"
              :class="wallet.code === 'USD' 
                ? 'bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 dark:from-emerald-500/10 dark:to-emerald-500/20 border-emerald-100/30'
                : wallet.code === 'PROMO'
                  ? 'bg-gradient-to-br from-purple-500/5 to-purple-500/10 dark:from-purple-500/10 dark:to-purple-500/20 border-purple-100/30'
                  : 'bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border-primary/10'"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-2">
                  <Icon :name="wallet.flag" class="text-lg shrink-0" />
                  <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200">{{ wallet.name }}</span>
                </div>
                <span class="text-[9px] font-extrabold uppercase bg-white/40 dark:bg-black/30 border border-white/50 dark:border-black/20 px-2 py-0.5 rounded-full text-zinc-550 dark:text-zinc-300">
                  {{ wallet.code }}
                </span>
              </div>
              <div>
                <div class="text-[20px] font-black text-zinc-900 dark:text-white leading-none tracking-tight">
                  {{ wallet.code === 'USD' ? '$' + wallet.balance.toLocaleString() : wallet.balance.toLocaleString() + ' đ' }}
                </div>
                <span class="inline-block text-[9px] font-bold mt-2.5 text-emerald-500 select-none">
                  <span class="w-1 h-1 rounded-full bg-emerald-500 inline-block align-middle mr-1"></span>
                  {{ wallet.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 5: Recent Transactions -->
        <div v-else-if="activeTab === 'transactions'" class="space-y-4">
          <div class="flex items-center justify-between select-none">
            <h4 class="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Lịch sử giao dịch gần đây</h4>
          </div>

          <div class="overflow-x-auto border border-zinc-150/80 dark:border-zinc-850 rounded-2xl no-scrollbar">
            <table class="w-full border-collapse text-left min-w-[700px]">
              <thead>
                <tr class="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-100 dark:border-zinc-850 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider select-none">
                  <th class="px-5 py-3.5">Mã giao dịch</th>
                  <th class="px-5 py-3.5">Loại giao dịch</th>
                  <th class="px-5 py-3.5">Số tiền</th>
                  <th class="px-5 py-3.5">Mô tả</th>
                  <th class="px-5 py-3.5">Trạng thái</th>
                  <th class="px-5 py-3.5">Thời gian</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-100 dark:divide-zinc-900 text-xs font-semibold text-zinc-650 dark:text-zinc-300">
                <tr v-for="tx in userTransactions" :key="tx.id" class="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
                  <td class="px-5 py-3.5 font-bold text-zinc-800 dark:text-zinc-100">#{{ tx.id }}</td>
                  <td class="px-5 py-3.5">
                    <span 
                      class="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border"
                      :class="tx.type === 'deposit' 
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border-emerald-100/50'
                        : tx.type === 'withdraw'
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-450 border-amber-100/50'
                          : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-405 border-indigo-100/50'"
                    >
                      {{ tx.type === 'deposit' ? 'Nạp tiền' : tx.type === 'withdraw' ? 'Rút tiền' : 'Nâng cấp' }}
                    </span>
                  </td>
                  <td 
                    class="px-5 py-3.5 font-black text-sm"
                    :class="tx.amount > 0 ? 'text-emerald-500' : 'text-red-500'"
                  >
                    {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount.toLocaleString() }} đ
                  </td>
                  <td class="px-5 py-3.5 text-zinc-500 dark:text-zinc-400 font-medium">{{ tx.description }}</td>
                  <td class="px-5 py-3.5">
                    <span 
                      class="inline-flex items-center gap-1 text-[10px] font-bold"
                      :class="tx.status === 'success' ? 'text-emerald-500' : 'text-amber-500'"
                    >
                      <span class="w-1 h-1 rounded-full bg-current animate-pulse"></span>
                      {{ tx.status === 'success' ? 'Thành công' : 'Đang xử lý' }}
                    </span>
                  </td>
                  <td class="px-5 py-3.5 text-zinc-400 font-medium">{{ formatDate(tx.date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <template #footer>
        <CmButton 
          variant="outline" 
          size="md" 
          class="text-xs font-bold border-zinc-150 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 px-5" 
          @click="isDetailsOpen = false"
        >
          Đóng chi tiết
        </CmButton>
      </template>
    </CmDialog>
  </div>
</template>

<style scoped>
/* Page-specific styling overrides */
</style>
