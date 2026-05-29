<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useServiceApi, type ServiceGroup } from '~/api/service';
import { usePayApi } from '~/api/pay';

definePageMeta({
  path: '/supper/orders/:systemId',
  layout: 'supper',
});

const route = useRoute();
const systemId = route.params.systemId as string;

const serviceApi = useServiceApi();
const payApi = usePayApi();

// States
const systemInfo = ref<ServiceGroup | null>(null);
const systemLoading = ref(false);

const searchQuery = ref('');
const selectedStatus = ref('');
const page = ref(1);
const limit = ref(10);

const orders = ref<any[]>([]);
const totalOrders = ref(0);
const loading = ref(false);

// Modal details state
const isDetailsOpen = ref(false);
const selectedOrder = ref<any | null>(null);

// Delete dialog state
const isDeleteConfirmOpen = ref(false);
const deleteLoading = ref(false);
const targetDeleteOrder = ref<any | null>(null);

// Verification states
const verifyLoading = ref(false);

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

// Fetch system details
const fetchSystemInfo = async () => {
  systemLoading.value = true;
  try {
    const res = await serviceApi.findOne(systemId);
    if (res && res.status && res.data) {
      systemInfo.value = res.data;
    }
  } catch (err) {
    console.error('Failed to fetch system details:', err);
    triggerToast('Không thể lấy thông tin hệ thống!', 'error');
  } finally {
    systemLoading.value = false;
  }
};

// Fetch payment requests list from real API
const fetchOrders = async () => {
  loading.value = true;
  try {
    const res = await payApi.getPaymentRequests({
      serviceId: systemId,
      status: selectedStatus.value || undefined,
      page: page.value,
      limit: limit.value
    });
    
    if (res && res.status && res.data) {
      let items = res.data.data || [];
      let total = res.data.total || 0;
      
      // Perform local search filtering since backend doesn't support free-text queries on payments yet
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        items = items.filter((item: any) => 
          item.id.toLowerCase().includes(q) || 
          (item.transactionCode && item.transactionCode.toLowerCase().includes(q)) ||
          (item.userId && item.userId.toLowerCase().includes(q))
        );
        total = items.length;
      }
      
      orders.value = items;
      totalOrders.value = total;
    } else {
      orders.value = [];
      totalOrders.value = 0;
    }
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    triggerToast('Không thể tải danh sách đơn hàng!', 'error');
  } finally {
    loading.value = false;
  }
};

// Handle manual payment verification (Approve/Reject)
const handleVerifyPayment = async (requestId: string, status: 'approved' | 'rejected', adminNote?: string) => {
  verifyLoading.value = true;
  try {
    const res = await payApi.verifyManualPayment(requestId, status, adminNote);
    if (res && res.status) {
      triggerToast(status === 'approved' ? 'Phê duyệt giao dịch thành công!' : 'Đã từ chối giao dịch thành công!');
      isDetailsOpen.value = false;
      await fetchOrders();
    } else {
      triggerToast('Thao tác phê duyệt giao dịch thất bại!', 'error');
    }
  } catch (err: any) {
    console.error('Failed to verify payment:', err);
    triggerToast(err?.message || 'Xử lý giao dịch thất bại!', 'error');
  } finally {
    verifyLoading.value = false;
  }
};

const handleClear = () => {
  searchQuery.value = '';
  selectedStatus.value = '';
  page.value = 1;
};

const handleExport = () => {
  triggerToast(`Đang xuất danh sách yêu cầu thanh toán ${systemInfo.value?.name || ''} ra file Excel...`);
};

const openDetailsModal = (order: any) => {
  selectedOrder.value = order;
  isDetailsOpen.value = true;
};

const confirmDeleteItem = (order: any) => {
  targetDeleteOrder.value = order;
  isDeleteConfirmOpen.value = true;
};

const deleteOrder = async () => {
  isDeleteConfirmOpen.value = false;
  // Financial transaction records should not be deleted for compliance and auditing.
  triggerToast('Không thể xóa dữ liệu giao dịch tài chính để bảo toàn lịch sử kiểm toán!', 'error');
};

// Reset page on filter changes
watch([searchQuery, selectedStatus], () => {
  page.value = 1;
});

// Reactively watch for filters and pagination
watch([searchQuery, selectedStatus, page, limit], () => {
  fetchOrders();
});

onMounted(async () => {
  await fetchSystemInfo();
  await fetchOrders();
});
</script>

<template>
  <div class="flex-1 flex flex-col min-w-0">
    <!-- Header Section -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div v-if="systemLoading" class="animate-pulse space-y-2">
        <div class="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-64"></div>
        <div class="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-96"></div>
      </div>
      <div v-else-if="systemInfo">
        <!-- Back Link -->
        <button 
          @click="navigateTo('/supper/orders')"
          class="inline-flex items-center gap-1 text-[11px] font-black text-zinc-400 hover:text-primary dark:text-zinc-555 dark:hover:text-primary uppercase tracking-wider mb-2 transition-colors outline-none"
        >
          <Icon name="heroicons:arrow-left" class="text-xs" />
          <span>Quay lại danh sách</span>
        </button>
        
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white leading-none flex items-center gap-3">
          <span>Quản lý đơn hàng: {{ systemInfo.name }}</span>
          <span 
            class="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 px-2.5 py-0.5 rounded-full select-none"
          >
            Active
          </span>
        </h1>
        <p class="text-xs sm:text-sm text-zinc-455 dark:text-zinc-550 font-medium mt-2">
          Theo dõi và xử lý các yêu cầu thanh toán chuyển khoản thủ công của hệ thống {{ systemInfo.name }}.
        </p>
      </div>
    </section>

    <!-- Filters component -->
    <div class="mb-8">
      <CpOrdersDetailFilter 
        v-model:search="searchQuery"
        v-model:status="selectedStatus"
        @clear="handleClear"
        @export="handleExport"
      />
    </div>

    <!-- Table component -->
    <CpOrdersDetailTable 
      v-model:page="page"
      v-model:limit="limit"
      :total="totalOrders"
      :items="orders"
      :loading="loading"
      @clear-filters="handleClear"
      @view-details="openDetailsModal"
      @delete-item="confirmDeleteItem"
    />

    <!-- Details Modal -->
    <CpOrdersDetailModal 
      v-model:isOpen="isDetailsOpen"
      :item="selectedOrder"
      :verifyLoading="verifyLoading"
      @verify="handleVerifyPayment"
    />

    <!-- Delete Confirmation Dialog -->
    <CmDialog
      v-model:isOpen="isDeleteConfirmOpen"
      title="Xác nhận xóa giao dịch"
      size="sm"
    >
      <div class="space-y-3">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
          Hành động này **không thể hoàn tác**. Bạn có chắc chắn muốn xóa lịch sử giao dịch này không?
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
            @click="deleteOrder"
          >
            Đồng ý xóa
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
          <p class="text-[11px] text-zinc-550 dark:text-zinc-400 mt-1 font-medium leading-relaxed">
            {{ toastMessage }}
          </p>
        </div>
        <CmButton 
          variant="ghost"
          size="sm"
          class="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 p-1"
          @click="showToast = false"
        >
          <Icon name="heroicons:x-mark" class="text-sm" />
        </CmButton>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
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
