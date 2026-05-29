<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useServiceApi, type Service, type ServiceGroup } from '~/api/service';
import { usePackageApi, type PackageItem } from '~/api/package';
import { useUploadApi } from '~/api/upload';
import { usePermissionApi, type PermissionItem } from '~/api/permission';

definePageMeta({
  path: '/supper/systems',
  layout: 'supper'
});

const api = useServiceApi();
const packageApi = usePackageApi();
const systemsList = ref<ServiceGroup[]>([]);
const listLoading = ref(false);

// Toast overlay state
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

// Form dialog state
const isFormOpen = ref(false);
const formLoading = ref(false);
const isEditing = ref(false);
const currentId = ref<string | null>(null);

const systemForm = ref<Partial<ServiceGroup>>({
  name: '',
  code: '',
  description: '',
  priority: 1,
  icon: 'heroicons:server',
  thumbnail: '',
  packageIds: []
});

const config = useRuntimeConfig();
const uploadApi = useUploadApi();
const fileInputRef = ref<HTMLInputElement | null>(null);
const uploadingImage = ref(false);

const iconList = [
  'heroicons:server',
  'heroicons:chart-bar',
  'heroicons:credit-card',
  'heroicons:shield-check',
  'heroicons:cpu-chip',
  'heroicons:database',
  'heroicons:cloud',
  'heroicons:sparkles',
  'heroicons:cog-6-tooth',
  'heroicons:globe-alt',
  'heroicons:envelope',
  'heroicons:user-group'
];

// Delete dialog state
const isDeleteConfirmOpen = ref(false);
const deleteLoading = ref(false);
const targetDeleteId = ref<string | null>(null);

// Active packages modal state
const isPackagesModalOpen = ref(false);
const selectedSystem = ref<any>(null);
const activeCategory = ref<'monthly' | 'yearly' | 'lifetime' | 'group'>('monthly');

// Compute Host based on system name
const getHost = (sys: any) => {
  const name = sys.name.toLowerCase();
  if (name.includes('core')) return 'api.binex.com';
  if (name.includes('analytics')) return 'analytics.binex.com';
  if (name.includes('payment') || name.includes('gateway')) return 'payment.binex.com';
  if (name.includes('sandbox') || name.includes('test')) return 'sandbox.binex.com';
  return 'services.binex.com';
};

// Helper functions for package price & discount formatting
const getNumericPrice = (priceStr: string | number) => {
  if (!priceStr) return 0;
  const digits = priceStr.toString().replace(/\D/g, '');
  return Number(digits) || 0;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
};

// Fetch all services from backend
const fetchServices = async () => {
  listLoading.value = true;
  try {
    // 1. Fetch all services (already includes 'packages' relation from backend)
    const res = await api.findAll();

    if (res && res.data) {
      systemsList.value = res.data.map(item => {
        // Count how many packages belong to this system directly from populated relation
        const pkgCount = Array.isArray(item.packages) ? item.packages.length : 0;
        
        return {
          ...item,
          status: item.status || 'active',
          users: Math.floor(Math.random() * 5000) + 120,
          packagesCount: pkgCount,
          ping: `${Math.floor(Math.random() * 20) + 15}ms`,
          region: 'Singapore'
        };
      });
    } else {
      systemsList.value = [];
    }
  } catch (err) {
    console.error('Failed to fetch services', err);
    triggerToast('Không thể kết nối tới máy chủ API!', 'error');
  } finally {
    listLoading.value = false;
  }
};

onMounted(() => {
  fetchServices();
  fetchServicesList();
});

const servicesList = ref<Service[]>([]);
const fetchServicesList = async () => {
  try {
    const res = await api.findAllServices();
    if (res && res.status && Array.isArray(res.data)) {
      servicesList.value = res.data;
    } else if (Array.isArray(res)) {
      servicesList.value = res;
    }
  } catch (err) {
    console.error('Failed to fetch services', err);
  }
};

// CRUD action handlers
const openCreateForm = () => {
  isEditing.value = false;
  currentId.value = null;
  systemForm.value = {
    name: '',
    code: '',
    description: '',
    priority: systemsList.value.length + 1,
    icon: 'heroicons:server',
    thumbnail: '',
    packageIds: []
  };
  isFormOpen.value = true;
};

const openEditForm = (item: ServiceGroup) => {
  isEditing.value = true;
  currentId.value = item.id;
  systemForm.value = {
    name: item.name,
    code: item.code || '',
    description: item.description,
    priority: item.priority || 1,
    icon: item.icon || 'heroicons:server',
    thumbnail: item.thumbnail || '',
    packageIds: item.packageIds || []
  };
  isFormOpen.value = true;
};

const saveSystem = async () => {
  if (!systemForm.value.name?.trim() || !systemForm.value.description?.trim()) {
    triggerToast('Vui lòng nhập đầy đủ tên và mô tả hệ thống!', 'error');
    return;
  }
  
  formLoading.value = true;
  try {
    if (isEditing.value && currentId.value) {
      await api.update(currentId.value, systemForm.value);
      triggerToast('Cập nhật thông tin hệ thống thành công!');
    } else {
      await api.create(systemForm.value);
      triggerToast('Thêm mới hệ thống thành công!');
    }
    isFormOpen.value = false;
    await fetchServices();
  } catch (err: any) {
    triggerToast(err?.message || 'Lưu thông tin thất bại!', 'error');
  } finally {
    formLoading.value = false;
  }
};

const confirmDelete = (item: ServiceGroup) => {
  targetDeleteId.value = item.id;
  isDeleteConfirmOpen.value = true;
};

const deleteSystem = async () => {
  if (!targetDeleteId.value) return;
  deleteLoading.value = true;
  try {
    await api.remove(targetDeleteId.value);
    triggerToast('Xóa hệ thống thành công!');
    isDeleteConfirmOpen.value = false;
    await fetchServices();
  } catch (err: any) {
    triggerToast(err?.message || 'Xóa hệ thống thất bại!', 'error');
  } finally {
    deleteLoading.value = false;
  }
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  const formData = new FormData();
  formData.append('files', file);

  uploadingImage.value = true;
  try {
    const res = await uploadApi.uploadImages(formData);
    if (res && res.status && res.data && res.data.length > 0) {
      systemForm.value.thumbnail = res.data[0].url;
      triggerToast('Tải lên ảnh đại diện thành công!');
    } else {
      triggerToast(res?.message || 'Tải ảnh lên thất bại!', 'error');
    }
  } catch (err: any) {
    triggerToast(err?.message || 'Đã có lỗi xảy ra khi tải ảnh!', 'error');
  } finally {
    uploadingImage.value = false;
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }
};

const packagesList = ref<PackageItem[]>([]);
const packageLoading = ref(false);
const showPackageForm = ref(false);
const isEditingPackage = ref(false);
const currentPackageId = ref<string | null>(null);

const packageForm = ref<Partial<PackageItem>>({
  name: '',
  description: '',
  price: '',
  sale: 0,
  isGroup: false,
  amountGroup: 1,
  expire: 1,
  storageLimit: 0,
  ac: 1,
  serviceId: '',
  serviceIds: []
});

const fetchPackages = async () => {
  if (!selectedSystem.value) return;
  packageLoading.value = true;
  try {
    const res = await packageApi.findAll();
    if (res && res.status && Array.isArray(res.data)) {
      packagesList.value = res.data;
    } else if (Array.isArray(res)) {
      packagesList.value = res;
    } else {
      packagesList.value = [];
    }
  } catch (err: any) {
    triggerToast('Không thể tải danh sách gói dịch vụ!', 'error');
  } finally {
    packageLoading.value = false;
  }
};

const filteredPackages = computed(() => {
  if (!selectedSystem.value) return [];
  const list = packagesList.value.filter(pkg => pkg.serviceId === selectedSystem.value?.id);
  
  // Sort by ac ascending
  list.sort((a, b) => (a.ac || 0) - (b.ac || 0));

  if (activeCategory.value === 'group') {
    return list.filter(pkg => pkg.isGroup === true);
  } else if (activeCategory.value === 'lifetime') {
    return list.filter(pkg => pkg.expire === 0 && !pkg.isGroup);
  } else if (activeCategory.value === 'yearly') {
    return list.filter(pkg => pkg.expire > 1 && !pkg.isGroup);
  } else {
    // monthly
    return list.filter(pkg => pkg.expire === 1 && !pkg.isGroup);
  }
});

const openCreatePackage = () => {
  isEditingPackage.value = false;
  currentPackageId.value = null;
  packageForm.value = {
    name: '',
    description: '',
    price: '',
    sale: 0,
    isGroup: false,
    amountGroup: 1,
    expire: 1,
    storageLimit: 0,
    ac: 1,
    serviceId: selectedSystem.value?.id || '',
    serviceIds: []
  };
  showPackageForm.value = true;
};

const openEditPackage = (pkg: PackageItem) => {
  isEditingPackage.value = true;
  currentPackageId.value = pkg.id || null;
  packageForm.value = {
    name: pkg.name,
    description: pkg.description,
    price: pkg.price,
    sale: pkg.sale || 0,
    isGroup: pkg.isGroup,
    amountGroup: pkg.amountGroup,
    expire: pkg.expire,
    storageLimit: pkg.storageLimit,
    ac: pkg.ac,
    serviceId: pkg.serviceId,
    serviceIds: Array.isArray(pkg.services) ? pkg.services.map((item: any) => item.id) : (pkg.serviceIds || [])
  };
  showPackageForm.value = true;
};

const savePackage = async () => {
  if (!packageForm.value.name || !packageForm.value.price) {
    triggerToast('Vui lòng điền đầy đủ tên và giá gói!', 'error');
    return;
  }

  packageLoading.value = true;
  try {
    let res;
    const payload = {
      ...packageForm.value,
      sale: Number(packageForm.value.sale) || 0,
      expire: Number(packageForm.value.expire) || 1,
      storageLimit: Number(packageForm.value.storageLimit) || 0,
      ac: Number(packageForm.value.ac) || 1,
      amountGroup: packageForm.value.isGroup ? 5 : 1,
      serviceIds: packageForm.value.serviceIds || []
    };

    if (isEditingPackage.value && currentPackageId.value) {
      res = await packageApi.update(currentPackageId.value, payload);
    } else {
      res = await packageApi.create(payload);
    }

    if (res && res.status) {
      triggerToast(isEditingPackage.value ? 'Cập nhật gói dịch vụ thành công!' : 'Tạo gói dịch vụ thành công!');
      showPackageForm.value = false;
      await fetchPackages();
      await fetchServices();
    } else {
      triggerToast(res?.message || 'Lưu gói dịch vụ thất bại!', 'error');
    }
  } catch (err: any) {
    triggerToast(err?.message || 'Có lỗi xảy ra khi lưu gói dịch vụ!', 'error');
  } finally {
    packageLoading.value = false;
  }
};

const deletePackage = async (id: string) => {
  if (!confirm('Bạn có chắc chắn muốn xóa gói dịch vụ này?')) return;
  packageLoading.value = true;
  try {
    const res = await packageApi.remove(id);
    if (res && res.status) {
      triggerToast('Xóa gói dịch vụ thành công!');
      await fetchPackages();
      await fetchServices();
    } else {
      triggerToast(res?.message || 'Xóa gói dịch vụ thất bại!', 'error');
    }
  } catch (err: any) {
    triggerToast(err?.message || 'Có lỗi xảy ra khi xóa gói dịch vụ!', 'error');
  } finally {
    packageLoading.value = false;
  }
};

const viewPackages = async (sys: any) => {
  selectedSystem.value = sys;
  activeCategory.value = 'monthly';
  showPackageForm.value = false;
  isPackagesModalOpen.value = true;
  await fetchPackages();
};

// ===== PERMISSION MODAL =====
const permissionApi = usePermissionApi();
const isPermModalOpen = ref(false);
const permLoading = ref(false);
const currentPermPackage = ref<PackageItem | null>(null);
const permissionsList = ref<PermissionItem[]>([]);

// Preset permission actions (có thể mở rộng)
const availableActions = [
  { label: 'user.read', value: 'user.read' },
  { label: 'user.create', value: 'user.create' },
  { label: 'user.update', value: 'user.update' },
  { label: 'user.delete', value: 'user.delete' },
  { label: 'landing_page.read', value: 'landing_page.read' },
  { label: 'landing_page.edit', value: 'landing_page.edit' },
  { label: 'report.view', value: 'report.view' },
  { label: 'report.export', value: 'report.export' },
  { label: 'billing.view', value: 'billing.view' },
  { label: 'billing.manage', value: 'billing.manage' },
  { label: 'api.access', value: 'api.access' },
  { label: 'storage.upload', value: 'storage.upload' },
];

// Track selected actions as a Set for easy toggle
const selectedActions = ref<Set<string>>(new Set());

const openPermModal = async (pkg: PackageItem) => {
  currentPermPackage.value = pkg;
  selectedActions.value = new Set();
  permissionsList.value = [];
  isPermModalOpen.value = true;
  permLoading.value = true;
  try {
    const res = await permissionApi.findByPackId(pkg.id!);
    const list: PermissionItem[] = Array.isArray(res)
      ? res
      : (res as any)?.data ?? [];
    permissionsList.value = list;
    selectedActions.value = new Set(list.map((p) => p.action));
  } catch {
    triggerToast('Không thể tải danh sách quyền!', 'error');
  } finally {
    permLoading.value = false;
  }
};

const toggleAction = (action: string) => {
  if (selectedActions.value.has(action)) {
    selectedActions.value.delete(action);
  } else {
    selectedActions.value.add(action);
  }
  // force reactivity
  selectedActions.value = new Set(selectedActions.value);
};

const customAction = ref('');
const addCustomAction = () => {
  const val = customAction.value.trim();
  if (!val) return;
  selectedActions.value.add(val);
  selectedActions.value = new Set(selectedActions.value);
  customAction.value = '';
};

const savePermissions = async () => {
  if (!currentPermPackage.value) return;
  permLoading.value = true;
  try {
    const actions = Array.from(selectedActions.value).map((a) => ({ action: a, weight: 1 }));
    await permissionApi.bulkSet({ packId: currentPermPackage.value.id!, actions });
    triggerToast('Cập nhật quyền thành công!');
    isPermModalOpen.value = false;
  } catch {
    triggerToast('Lưu quyền thất bại!', 'error');
  } finally {
    permLoading.value = false;
  }
};
</script>

<template>
  <div class="flex-1 flex flex-col min-w-0">
    <!-- Header Section -->
    <section class="mb-8 flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
          Danh sách hệ thống
        </h1>
        <p class="text-xs sm:text-sm text-zinc-450 dark:text-zinc-555 font-medium mt-2">
          Giám sát trạng thái hoạt động, lượng tài khoản truy cập và hiệu năng của các hệ thống trực thuộc Binex.
        </p>
      </div>
      <CmButton 
        variant="primary" 
        size="md" 
        icon="heroicons:plus-solid"
        class="text-xs font-bold shadow-sm shadow-primary/10 shrink-0"
        @click="openCreateForm"
      >
        Thêm hệ thống
      </CmButton>
    </section>

    <!-- Loading Spinner -->
    <div v-if="listLoading" class="flex-1 py-20 flex flex-col items-center justify-center">
      <div class="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p class="text-xs text-zinc-400 dark:text-zinc-555 font-bold mt-4">Đang tải danh sách hệ thống...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="systemsList.length === 0" class="flex-1 py-12 flex flex-col items-center justify-center">
      <CmEmpty 
        title="Không có hệ thống" 
        description="Hiện tại chưa có hệ thống nào được thiết lập. Hãy nhấn nút phía dưới hoặc góc trên bên phải để bắt đầu thêm."
      >
        <CmButton 
          variant="primary" 
          size="sm" 
          icon="heroicons:plus-solid"
          class="text-[10px] font-bold shadow-sm shadow-primary/5 mt-4"
          @click="openCreateForm"
        >
          Tạo hệ thống đầu tiên
        </CmButton>
      </CmEmpty>
    </div>

    <!-- Systems Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <CmCard 
        v-for="sys in systemsList" 
        :key="sys.id" 
        class="border border-zinc-150/80 dark:border-zinc-850 hover:shadow-md transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
      >
        <!-- Top Image Banner (if exists) -->
        <div v-if="sys.thumbnail" class="w-full h-64 overflow-hidden relative shrink-0 select-none pointer-events-none">
          <img 
            :src="sys.thumbnail.startsWith('http') ? sys.thumbnail : (config.public.apiBaseUrl + sys.thumbnail)"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt="System Banner"
          />
          <div class="absolute inset-0 bg-black/5"></div>
        </div>

        <!-- Content Area with Padding -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-primary/5 dark:bg-primary/10 text-primary border border-primary/10 flex items-center justify-center shrink-0">
                  <Icon :name="sys.icon || 'heroicons:server'" class="text-sm" />
                </div>
                <div>
                  <h3 class="text-sm font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-primary transition-colors">
                    {{ sys.name }}
                  </h3>
                  <p class="text-[10px] text-zinc-400 dark:text-zinc-550 font-medium mt-0.5">{{ getHost(sys) }}</p>
                </div>
              </div>

              <span 
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase select-none font-sans"
                :class="sys.status === 'active' 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-100/50'
                  : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-450 border border-amber-100/50'"
              >
                <span class="w-1 h-1 rounded-full bg-current animate-pulse"></span>
                {{ sys.status }}
              </span>
            </div>

            <!-- Description Block -->
            <p class="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-3 line-clamp-2 leading-relaxed">
              {{ sys.description }}
            </p>

            <!-- Stats Grid -->
            <div class="grid grid-cols-3 gap-4 border-t border-zinc-100 dark:border-zinc-900 mt-4 pt-3">
              <div>
                <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Người dùng</p>
                <p class="text-xs font-black text-zinc-700 dark:text-zinc-300 mt-1">{{ sys.users ? sys.users.toLocaleString() : '0' }}</p>
              </div>
              <div>
                <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Số lượng gói</p>
                <p class="text-xs font-black text-zinc-700 dark:text-zinc-300 mt-1">{{ sys.packagesCount || 0 }} gói</p>
              </div>
              <div>
                <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Thứ tự ưu tiên</p>
                <p class="text-xs font-black text-zinc-700 dark:text-zinc-300 mt-1">#{{ sys.priority }}</p>
              </div>
            </div>
          </div>

          <!-- Action Footer -->
          <div class="border-t border-zinc-100 dark:border-zinc-900 mt-4 pt-3 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-1">
              <CmButton 
                variant="ghost" 
                size="sm" 
                icon="heroicons:pencil-square"
                class="text-zinc-400 hover:text-primary dark:text-zinc-500 dark:hover:text-primary p-1.5 rounded-lg"
                @click="openEditForm(sys)"
              />
              <CmButton 
                variant="ghost" 
                size="sm" 
                icon="heroicons:trash"
                class="text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 p-1.5 rounded-lg"
                @click="confirmDelete(sys)"
              />
            </div>
            <CmButton 
              variant="outline" 
              size="sm" 
              icon="heroicons:sparkles-20-solid"
              class="text-[11px] font-bold border-zinc-150 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              @click="viewPackages(sys)"
            >
              Xem gói dịch vụ
            </CmButton>
          </div>
        </div>
      </CmCard>
    </div>

    <!-- Add/Edit System Form Dialog -->
    <CmDialog
      v-model:isOpen="isFormOpen"
      :title="isEditing ? 'Cập nhật thông tin hệ thống' : 'Thêm hệ thống mới'"
      size="md"
    >
      <div class="space-y-5">
        <p class="text-xs text-zinc-400 font-medium leading-relaxed">
          {{ isEditing ? 'Cập nhật các thông số kỹ thuật và mô tả hoạt động của hệ thống.' : 'Khởi tạo cấu hình hệ thống trực thuộc mới vào cơ sở dữ liệu Binex.' }}
        </p>

        <!-- Form Fields Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- Left side: Text inputs & Selection (2/3 width) -->
          <div class="md:col-span-2 space-y-4">
            <!-- Row 1: Name & Code -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 select-none">Tên hệ thống</label>
                <CmInput v-model="systemForm.name" placeholder="Ví dụ: Hệ thống Binex Billing" class="w-full text-xs font-medium" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 select-none">Mã hệ thống (Code)</label>
                <CmInput v-model="systemForm.code" placeholder="Ví dụ: BILLING" class="w-full text-xs font-medium" />
              </div>
            </div>

            <!-- Row 2: Priority & Icon -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 select-none">Độ ưu tiên</label>
                <CmInput type="number" v-model="systemForm.priority" placeholder="Ví dụ: 1" class="w-full text-xs font-medium" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 select-none">Biểu tượng (Icon)</label>
                <el-popover
                  placement="bottom-start"
                  :width="280"
                  trigger="click"
                  popper-class="!p-0 !rounded-xl !border-zinc-150/80 dark:!border-zinc-850 !bg-white dark:!bg-zinc-950"
                >
                  <template #reference>
                    <button 
                      type="button"
                      class="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-100 text-xs sm:text-sm font-medium transition-all text-left outline-none"
                    >
                      <div class="w-7 h-7 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/10 flex items-center justify-center text-primary">
                        <Icon :name="systemForm.icon || 'heroicons:server'" class="text-base" />
                      </div>
                      <span class="flex-1 capitalize font-bold text-zinc-700 dark:text-zinc-300">
                        {{ systemForm.icon ? systemForm.icon.replace('heroicons:', '').replace('-', ' ') : 'server' }}
                      </span>
                      <Icon name="heroicons:chevron-down" class="text-zinc-400 text-xs" />
                    </button>
                  </template>

                  <div class="p-3 bg-white dark:bg-zinc-950">
                    <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2.5 px-1 select-none">Chọn biểu tượng hệ thống</p>
                    <div class="grid grid-cols-4 gap-2">
                      <button
                        v-for="icon in iconList"
                        :key="icon"
                        type="button"
                        @click="systemForm.icon = icon"
                        class="w-11 h-11 rounded-lg border flex items-center justify-center transition-all outline-none"
                        :class="[
                          systemForm.icon === icon 
                            ? 'border-primary bg-primary/5 text-primary shadow-sm scale-95 ring-2 ring-primary/20' 
                            : 'border-zinc-150 hover:border-zinc-300 dark:border-zinc-850 dark:hover:border-zinc-750 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 text-zinc-550 dark:text-zinc-400'
                        ]"
                        :title="icon"
                      >
                        <Icon :name="icon" class="text-lg" />
                      </button>
                    </div>
                  </div>
                </el-popover>
              </div>
            </div>
          </div>

          <!-- Right side: Thumbnail Upload (1/3 width, flex auto height matching the left column) -->
          <div class="flex flex-col">
            <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 select-none">Ảnh đại diện (Thumbnail)</label>
            
            <div class="relative w-full flex-1 flex flex-col min-h-[125px]">
              <input 
                type="file" 
                ref="fileInputRef" 
                accept="image/*" 
                class="hidden" 
                @change="handleImageUpload" 
              />
              
              <div 
                @click="triggerFileInput"
                class="border-2 border-dashed border-zinc-200 hover:border-primary/50 dark:border-zinc-800 dark:hover:border-primary/50 rounded-xl bg-white dark:bg-zinc-950 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 group overflow-hidden select-none w-full flex-1 relative shadow-inner aspect-video md:aspect-auto"
              >
                <!-- Loading State Overlay -->
                <div v-if="uploadingImage" class="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xs flex items-center justify-center z-10">
                  <Icon name="svg-spinners:ring-resize" class="text-lg text-primary animate-spin" />
                </div>
                
                <!-- Preview Image state -->
                <template v-if="systemForm.thumbnail">
                  <img 
                    :src="systemForm.thumbnail.startsWith('http') ? systemForm.thumbnail : (config.public.apiBaseUrl + systemForm.thumbnail)" 
                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" 
                    alt="Thumbnail Preview"
                  />
                  <!-- Hover Overlay for changing image -->
                  <div class="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1">
                    <div class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                      <Icon name="heroicons:pencil-square" class="text-base" />
                    </div>
                    <span class="text-[9px] font-black text-white uppercase tracking-wider select-none transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">Thay đổi ảnh</span>
                  </div>
                </template>

                <!-- Empty State (No Image) -->
                <template v-else>
                  <Icon name="heroicons:cloud-arrow-up" class="text-xl text-zinc-400 group-hover:text-primary group-hover:-translate-y-0.5 transition-all duration-300 mb-1" />
                  <span class="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 text-center px-2 transition-colors leading-tight">
                    Tải ảnh đại diện
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 select-none">Mô tả chi tiết</label>
          <CmEditor 
            v-model="systemForm.description" 
            placeholder="Nhập mô tả hoạt động chi tiết của hệ thống..." 
            :rows="4"
            :maxlength="1000"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-3.5">
          <CmButton 
            variant="ghost" 
            size="md" 
            class="text-xs font-semibold px-5" 
            :disabled="formLoading"
            @click="isFormOpen = false"
          >
            Hủy bỏ
          </CmButton>
          <CmButton 
            variant="primary" 
            size="md" 
            class="text-xs font-bold px-5 shadow-sm shadow-primary/10" 
            :loading="formLoading"
            @click="saveSystem"
          >
            Lưu thay đổi
          </CmButton>
        </div>
      </template>
    </CmDialog>

    <!-- Delete Confirmation Dialog -->
    <CmDialog
      v-model:isOpen="isDeleteConfirmOpen"
      title="Xác nhận xóa hệ thống"
      size="sm"
    >
      <div class="space-y-3">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
          Hành động này **không thể hoàn tác**. Hệ thống sẽ bị xóa hoàn toàn khỏi cơ sở dữ liệu và dừng mọi phân hệ liên kết. Bạn có chắc chắn muốn tiếp tục?
        </p>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <CmButton 
            variant="ghost" 
            size="md" 
            class="text-xs font-semibold px-4" 
            :disabled="deleteLoading"
            @click="isDeleteConfirmOpen = false"
          >
            Hủy
          </CmButton>
          <CmButton 
            variant="primary" 
            size="md" 
            class="text-xs font-bold px-4 bg-red-600 hover:bg-red-700 text-white border-none shadow-sm shadow-red-500/10" 
            :loading="deleteLoading"
            @click="deleteSystem"
          >
            Đồng ý xóa
          </CmButton>
        </div>
      </template>
    </CmDialog>

    <!-- Reusable Dialog Modal for Service Packages -->
    <CmDialog
      v-model:isOpen="isPackagesModalOpen"
      :title="selectedSystem ? `Quản lý gói dịch vụ - ${selectedSystem.name}` : 'Gói dịch vụ hệ thống'"
      size="xl"
    >
      <div v-if="selectedSystem" class="space-y-6">
        
        <!-- Header row of packages modal -->
        <div class="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4 gap-4">
          <p class="text-xs text-zinc-400 font-medium leading-relaxed max-w-md">
            Quản trị và cấu hình giá các gói dịch vụ dành riêng cho phân hệ <strong class="text-zinc-755 dark:text-zinc-255 font-bold">{{ selectedSystem.name }}</strong>.
          </p>
          
          <CmButton 
            v-if="!showPackageForm"
            variant="primary" 
            size="sm" 
            icon="heroicons:plus-solid"
            class="text-[10px] font-bold shadow-sm shadow-primary/5 shrink-0"
            @click="openCreatePackage"
          >
            Thêm gói mới
          </CmButton>
        </div>

        <!-- 1. FORM VIEW FOR ADD/EDIT PACKAGE -->
        <div v-if="showPackageForm" class="space-y-4 bg-zinc-50/50 dark:bg-zinc-900/10 p-5 rounded-2xl border border-zinc-150/40 dark:border-zinc-850/40">
          <h3 class="text-xs font-black text-zinc-850 dark:text-zinc-200 uppercase tracking-wider mb-2">
            {{ isEditingPackage ? 'Cập nhật gói dịch vụ' : 'Thêm gói dịch vụ mới' }}
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Tên gói -->
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 select-none">Tên gói dịch vụ</label>
              <CmInput v-model="packageForm.name" placeholder="Ví dụ: Gói Core Starter" class="w-full text-xs font-medium" />
            </div>

            <!-- Giá tiền -->
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 select-none">Giá hiển thị</label>
              <CmInput v-model="packageForm.price" placeholder="Ví dụ: 290,000 đ" class="w-full text-xs font-medium" />
            </div>

            <!-- Giảm giá (%) -->
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 select-none">Mức giảm giá (%)</label>
              <CmInput v-model="packageForm.sale" type="number" min="0" max="100" placeholder="Ví dụ: 10 cho giảm 10% (để trống hoặc 0 nếu không giảm)" class="w-full text-xs font-medium" />
            </div>

            <!-- Thời hạn -->
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 select-none">Thời hạn sử dụng</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  @click="packageForm.expire = 1"
                  class="py-2.5 rounded-xl border text-xs font-bold transition-all outline-none"
                  :class="[
                    packageForm.expire === 1 
                      ? 'border-primary bg-primary/5 text-primary shadow-sm ring-2 ring-primary/20' 
                      : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400'
                  ]"
                >
                  1 Tháng
                </button>
                <button
                  type="button"
                  @click="packageForm.expire = 12"
                  class="py-2.5 rounded-xl border text-xs font-bold transition-all outline-none"
                  :class="[
                    packageForm.expire === 12 
                      ? 'border-primary bg-primary/5 text-primary shadow-sm ring-2 ring-primary/20' 
                      : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400'
                  ]"
                >
                  1 Năm
                </button>
                <button
                  type="button"
                  @click="packageForm.expire = 0"
                  class="py-2.5 rounded-xl border text-xs font-bold transition-all outline-none"
                  :class="[
                    packageForm.expire === 0 
                      ? 'border-violet-500 bg-violet-500/5 text-violet-600 shadow-sm ring-2 ring-violet-500/20' 
                      : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400'
                  ]"
                >
                  ♾ Vĩnh viễn
                </button>
              </div>
            </div>

            <!-- Thứ tự ưu tiên -->
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 select-none">Độ ưu tiên hiển thị</label>
              <CmInput v-model="packageForm.ac" type="number" min="1" placeholder="Số nhỏ hiển thị trước" class="w-full text-xs font-medium" />
            </div>

            <!-- Dung lượng giới hạn -->
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 select-none">Dung lượng giới hạn (MB)</label>
              <CmInput v-model="packageForm.storageLimit" type="number" placeholder="Nhập số MB (0 là không giới hạn)" class="w-full text-xs font-medium" />
            </div>

            <!-- Loại gói -->
            <div class="flex items-center gap-2 pt-5">
              <input 
                type="checkbox" 
                id="isGroupCheckbox" 
                v-model="packageForm.isGroup"
                class="rounded border-zinc-350 text-primary focus:ring-primary w-4 h-4"
              />
              <label for="isGroupCheckbox" class="text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                Gói đại lý / doanh nghiệp (Cấp nhiều tài khoản)
              </label>
            </div>
          </div>

          <!-- Description / Features (One feature per line) -->
          <div>
            <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 select-none">Mô tả tính năng (Mỗi dòng là một tính năng)</label>
            <CmEditor 
              v-model="packageForm.description"
              placeholder="Ví dụ:&#10;- Quản lý 100 người dùng&#10;- API Core cơ bản&#10;- Hỗ trợ kỹ thuật 24/7"
              :rows="5"
              :maxlength="1000"
            />
          </div>

          <!-- Services checklist mapping -->
          <div v-if="servicesList.length > 0">
            <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5 select-none">
              Danh sách tính năng hệ thống kích hoạt đi kèm
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-zinc-100/30 dark:bg-zinc-950/20 p-4.5 rounded-2xl border border-zinc-150/50 dark:border-zinc-850/50">
              <label
                v-for="item in servicesList"
                :key="item.id"
                class="flex items-start gap-2.5 p-3 rounded-xl border text-[11px] font-bold transition-all cursor-pointer select-none outline-none leading-tight"
                :class="[
                  (packageForm.serviceIds || []).includes(item.id)
                    ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-950'
                ]"
              >
                <input
                  type="checkbox"
                  :value="item.id"
                  v-model="packageForm.serviceIds"
                  class="rounded border-zinc-350 text-emerald-500 focus:ring-emerald-500 w-3.5 h-3.5 shrink-0 mt-0.5"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-1.5">
                    <Icon v-if="item.icon" :name="item.icon" class="text-xs shrink-0" />
                    <span>{{ item.name }}</span>
                  </div>
                  <p class="text-[9px] font-medium text-zinc-400 mt-1 leading-normal line-clamp-2">
                    {{ item.description }}
                  </p>
                </div>
              </label>
            </div>
          </div>


        </div>

        <!-- 2. PACKAGES LIST VIEW -->
        <div v-else class="space-y-6">
          
          <!-- Category Tab Switcher Centered -->
          <div class="flex justify-center select-none">
            <div class="inline-flex p-1 bg-zinc-100/80 dark:bg-zinc-900/80 rounded-2xl border border-zinc-150/40 dark:border-zinc-850/40 shadow-sm shrink-0">
              <CmButton 
                @click="activeCategory = 'monthly'"
                variant="ghost"
                size="sm"
                class="px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                :class="activeCategory === 'monthly'
                  ? '!bg-white dark:!bg-zinc-800 !text-primary shadow-sm'
                  : '!text-zinc-500 dark:!text-zinc-400 hover:!text-zinc-855 dark:hover:!text-zinc-155'"
              >
                <Icon name="heroicons:calendar" class="text-sm" />
                <span>Theo tháng</span>
              </CmButton>
              <CmButton 
                @click="activeCategory = 'yearly'"
                variant="ghost"
                size="sm"
                class="px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                :class="activeCategory === 'yearly'
                  ? '!bg-white dark:!bg-zinc-800 !text-primary shadow-sm'
                  : '!text-zinc-500 dark:!text-zinc-400 hover:!text-zinc-855 dark:hover:!text-zinc-155'"
              >
                <Icon name="heroicons:sparkles" class="text-sm" />
                <span>Theo năm</span>
              </CmButton>
              <CmButton 
                @click="activeCategory = 'lifetime'"
                variant="ghost"
                size="sm"
                class="px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                :class="activeCategory === 'lifetime'
                  ? '!bg-white dark:!bg-zinc-800 !text-violet-600 shadow-sm'
                  : '!text-zinc-500 dark:!text-zinc-400 hover:!text-zinc-855 dark:hover:!text-zinc-155'"
              >
                <Icon name="heroicons:infinity" class="text-sm" />
                <span>Vĩnh viễn</span>
              </CmButton>
              <CmButton 
                @click="activeCategory = 'group'"
                variant="ghost"
                size="sm"
                class="px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                :class="activeCategory === 'group'
                  ? '!bg-white dark:!bg-zinc-800 !text-primary shadow-sm'
                  : '!text-zinc-500 dark:!text-zinc-400 hover:!text-zinc-855 dark:hover:!text-zinc-155'"
              >
                <Icon name="heroicons:building-office-2" class="text-sm" />
                <span>Doanh nghiệp</span>
              </CmButton>
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="packageLoading" class="py-12 flex flex-col items-center justify-center gap-2">
            <Icon name="svg-spinners:ring-resize" class="text-2xl text-primary animate-spin" />
            <span class="text-xs text-zinc-400 font-medium">Đang tải danh sách gói...</span>
          </div>

          <!-- Render active category packages -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            <div 
              v-for="(pkg, idx) in filteredPackages" 
              :key="pkg.id || idx"
              class="p-5 rounded-2xl border border-zinc-150/80 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/20 hover:border-primary transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div class="flex items-start justify-between gap-2">
                  <h4 class="text-xs font-black text-zinc-855 dark:text-zinc-200 group-hover:text-primary transition-colors leading-tight">
                    {{ pkg.name }}
                  </h4>
                  
                  <!-- Compact storage badge -->
                  <span class="text-[9px] font-black uppercase bg-zinc-100 dark:bg-zinc-900 border border-zinc-150/50 dark:border-zinc-850 px-1.5 py-0.5 rounded-md text-zinc-500">
                    {{ pkg.storageLimit > 0 ? `${pkg.storageLimit} MB` : 'Vô hạn' }}
                  </span>
                </div>
                
                <div class="flex items-baseline flex-wrap gap-x-2 gap-y-1 mt-3 mb-4 select-none">
                  <template v-if="pkg.sale">
                    <!-- Discounted Price -->
                    <span class="text-lg font-black text-zinc-900 dark:text-white leading-none animate-fade-in">
                      {{ formatCurrency(Math.round(getNumericPrice(pkg.price) * (1 - pkg.sale / 100))) }}
                    </span>
                    <!-- Struck-through Original Price -->
                    <span class="text-xs text-zinc-400 dark:text-zinc-500 line-through font-bold">
                      {{ pkg.price.toString().includes('đ') ? pkg.price : formatCurrency(getNumericPrice(pkg.price)) }}
                    </span>
                  </template>
                  <template v-else>
                    <!-- Regular Price -->
                    <span class="text-lg font-black text-zinc-900 dark:text-white leading-none">
                      {{ pkg.price.toString().includes('đ') ? pkg.price : formatCurrency(getNumericPrice(pkg.price)) }}
                    </span>
                  </template>
                  
                  <span class="text-[10px] text-zinc-455 font-bold ml-0.5">
                    <template v-if="pkg.expire === 0">/ Vĩnh viễn ♾</template>
                    <template v-else>/{{ pkg.expire }} tháng</template>
                  </span>
                  
                  <!-- Sale badge if discount exists -->
                  <span v-if="pkg.sale" class="ml-1 text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
                    Giảm {{ pkg.sale }}%
                  </span>
                </div>

                <div class="space-y-2 border-t border-zinc-100 dark:border-zinc-900 pt-3.5">
                  <div 
                    v-for="(feat, fIdx) in (pkg.description || '').split('\n').filter(Boolean)" 
                    :key="fIdx"
                    class="flex items-start gap-2 text-[10px] text-zinc-555 dark:text-zinc-400 font-semibold"
                  >
                    <Icon name="heroicons:check-circle" class="text-primary text-base shrink-0" />
                    <span>{{ feat.replace(/^[\s\-\*]+/, '').replace(/\*\*/g, '') }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions on package card -->
              <div class="space-y-2 mt-5 border-t border-zinc-100 dark:border-zinc-900 pt-4">
                <CmButton 
                  variant="outline" 
                  size="sm" 
                  icon="heroicons:shield-check"
                  class="text-[10px] font-bold w-full border-violet-200 !text-violet-600 hover:bg-violet-50 dark:border-violet-900 dark:hover:bg-violet-950/20"
                  @click="openPermModal(pkg)"
                >
                  Cập nhật quyền
                </CmButton>
                <div class="grid grid-cols-2 gap-2">
                  <CmButton 
                    variant="ghost" 
                    size="sm" 
                    icon="heroicons:pencil-square"
                    class="text-[10px] font-bold !text-zinc-500 hover:!text-primary w-full"
                    @click="openEditPackage(pkg)"
                  >
                    Sửa
                  </CmButton>
                  <CmButton 
                    variant="ghost" 
                    size="sm" 
                    icon="heroicons:trash"
                    class="text-[10px] font-bold !text-zinc-450 hover:!text-red-500 w-full"
                    @click="deletePackage(pkg.id)"
                  >
                    Xóa
                  </CmButton>
                </div>
              </div>
            </div>

            <!-- Empty state when no packages found in the selected category -->
            <div 
              v-if="filteredPackages.length === 0"
              class="col-span-full py-12 text-center flex flex-col items-center justify-center select-none"
            >
              <div class="w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-850 text-zinc-400 mb-3">
                <Icon name="heroicons:face-frown" class="text-xl" />
              </div>
              <p class="text-xs font-bold text-zinc-850 dark:text-zinc-200">Không có gói dịch vụ</p>
              <p class="text-[10px] text-zinc-400 font-medium mt-1">Hệ thống hiện tại chưa cấu hình các gói dịch vụ thuộc nhóm này.</p>
              <CmButton 
                variant="primary" 
                size="sm" 
                icon="heroicons:plus-solid"
                class="text-[10px] font-bold mt-4 shadow-sm shadow-primary/5"
                @click="openCreatePackage"
              >
                Tạo gói đầu tiên
              </CmButton>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-3.5">
          <!-- When in form view -->
          <template v-if="showPackageForm">
            <CmButton 
              variant="ghost" 
              size="md" 
              class="text-xs font-semibold px-5"
              @click="showPackageForm = false"
            >
              Hủy
            </CmButton>
            <CmButton 
              variant="primary" 
              size="md" 
              class="text-xs font-semibold px-5 shadow-sm shadow-primary/10"
              :loading="packageLoading"
              @click="savePackage"
            >
              {{ isEditingPackage ? 'Cập nhật' : 'Lưu gói' }}
            </CmButton>
          </template>
          <!-- When in list view, just close -->
          <template v-else>
            <CmButton 
              variant="ghost" 
              size="md" 
              class="text-xs font-semibold px-5"
              @click="isPackagesModalOpen = false"
            >
              Đóng
            </CmButton>
          </template>
        </div>
      </template>
    </CmDialog>

    <!-- ===== PERMISSION MODAL ===== -->
    <CmDialog
      v-model:isOpen="isPermModalOpen"
      :title="currentPermPackage ? `Quyền hệ thống - ${currentPermPackage.name}` : 'Quyền gói dịch vụ'"
      size="md"
    >
      <div class="space-y-5">
        <p class="text-xs text-zinc-400 font-medium leading-relaxed">
          Chọn các quyền mà gói <strong class="text-zinc-700 dark:text-zinc-300">{{ currentPermPackage?.name }}</strong> sẽ được cấp phép. Chỉ Super Admin mới có thể thay đổi cấu hình này.
        </p>

        <!-- Loading -->
        <div v-if="permLoading" class="py-8 flex justify-center">
          <Icon name="svg-spinners:ring-resize" class="text-2xl text-violet-500 animate-spin" />
        </div>

        <div v-else class="space-y-4">
          <!-- Preset actions grid -->
          <div>
            <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 select-none">Quyền mặc định</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                v-for="act in availableActions"
                :key="act.value"
                type="button"
                @click="toggleAction(act.value)"
                class="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all outline-none text-left"
                :class="selectedActions.has(act.value)
                  ? 'border-violet-400 bg-violet-500/5 text-violet-700 dark:text-violet-400 shadow-sm ring-1 ring-violet-400/30'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'"
              >
                <Icon
                  :name="selectedActions.has(act.value) ? 'heroicons:check-circle-solid' : 'heroicons:circle'"
                  class="text-base shrink-0"
                  :class="selectedActions.has(act.value) ? 'text-violet-500' : 'text-zinc-350 dark:text-zinc-600'"
                />
                {{ act.label }}
              </button>
            </div>
          </div>

          <!-- Custom action input -->
          <div>
            <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 select-none">Thêm quyền tùy chỉnh</p>
            <div class="flex gap-2">
              <CmInput
                v-model="customAction"
                placeholder="Ví dụ: invoice.export"
                class="flex-1 text-xs font-medium"
                @keydown.enter="addCustomAction"
              />
              <CmButton
                variant="outline"
                size="sm"
                icon="heroicons:plus"
                class="text-xs font-bold shrink-0"
                @click="addCustomAction"
              >
                Thêm
              </CmButton>
            </div>
          </div>

          <!-- Currently selected list -->
          <div v-if="selectedActions.size > 0">
            <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 select-none">Đang chọn ({{ selectedActions.size }})</p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="action in Array.from(selectedActions)"
                :key="action"
                class="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full text-[10px] font-bold bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-400 border border-violet-200/60 dark:border-violet-900/60"
              >
                {{ action }}
                <button type="button" @click="toggleAction(action)" class="ml-0.5 hover:text-red-500 transition-colors">
                  <Icon name="heroicons:x-mark" class="text-xs" />
                </button>
              </span>
            </div>
          </div>
          <div v-else class="text-xs text-zinc-400 font-medium text-center py-2">
            Chưa có quyền nào được chọn
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <CmButton
            variant="ghost"
            size="md"
            class="text-xs font-semibold px-5"
            :disabled="permLoading"
            @click="isPermModalOpen = false"
          >
            Hủy
          </CmButton>
          <CmButton
            variant="primary"
            size="md"
            class="text-xs font-bold px-5 bg-violet-600 hover:bg-violet-700 border-violet-600 shadow-sm shadow-violet-500/20"
            :loading="permLoading"
            @click="savePermissions"
          >
            Lưu quyền
          </CmButton>
        </div>
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
            {{ toastType === 'success' ? 'Thành công' : 'Thất bại' }}
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
  </div>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from {
  transform: translateX(100px);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>
