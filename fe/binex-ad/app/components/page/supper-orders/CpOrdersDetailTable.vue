<script setup lang="ts">
import { PaymentRequestStatus } from '~/types/payment-request';

const page = defineModel<number>('page', { default: 1 });
const limit = defineModel<number>('limit', { default: 10 });

defineProps<{
  total: number;
  items: any[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'clear-filters'): void;
  (e: 'view-details', item: any): void;
  (e: 'delete-item', item: any): void;
}>();

const tableHeaders = [
  { key: 'transaction', label: 'Giao dịch / Nội dung' },
  { key: 'customer', label: 'Người thực hiện' },
  { key: 'amount', label: 'Số tiền' },
  { key: 'methodPay', label: 'Phương thức' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'createdAt', label: 'Ngày tạo' },
  { key: 'actions', label: 'Hành động', class: 'text-right', cellClass: 'text-right' }
];

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCurrency = (value: number) => {
  if (value === undefined || value === null) return '0đ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getOrderTypeLabel = (type: string) => {
  switch (type) {
    case 'CR_AC_ADMIN': return 'Tạo tài khoản Admin';
    case 'RN_AC_PK': return 'Gia hạn gói dịch vụ';
    case 'CR_OD_PK': return 'Đăng ký gói mới';
    default: return 'Yêu cầu thanh toán';
  }
};
</script>

<template>
  <CmTable
    v-model:page="page"
    v-model:limit="limit"
    :total="total"
    :headers="tableHeaders"
    :items="items"
    :loading="loading"
    label="giao dịch"
    empty-text="Không tìm thấy giao dịch nào"
    empty-subtext="Hãy thử thay đổi từ khóa tìm kiếm hoặc lọc trạng thái để tìm kết quả."
    @clear-filters="emit('clear-filters')"
  >
    <!-- Custom slot: transaction -->
    <template #transaction="{ item }">
      <div class="flex items-center gap-3.5 cursor-pointer group/title" @click="emit('view-details', item)">
        <div class="w-9 h-9 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/15 text-primary flex items-center justify-center shrink-0 group-hover/title:scale-105 transition-transform duration-300">
          <Icon name="heroicons:credit-card" class="text-sm shrink-0" />
        </div>
        <div class="flex flex-col">
          <span class="text-[13px] font-bold text-zinc-850 dark:text-zinc-100 group-hover/title:text-primary transition-colors">
            {{ item.transactionCode || 'N/A' }}
          </span>
          <span class="text-[10px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider mt-0.5">
            {{ getOrderTypeLabel(item.orderType) }}
          </span>
        </div>
      </div>
    </template>

    <!-- Custom slot: customer -->
    <template #customer="{ item }">
      <div class="flex flex-col text-xs font-semibold">
        <span class="text-zinc-700 dark:text-zinc-300">
          {{ item.user?.userName || item.userId || 'N/A' }}
        </span>
        <span class="text-zinc-400 dark:text-zinc-550 text-[10px] mt-0.5 font-medium">
          Gói: {{ item.packageId || 'Không có' }}
        </span>
      </div>
    </template>

    <!-- Custom slot: amount -->
    <template #amount="{ item }">
      <span class="text-xs text-zinc-850 dark:text-zinc-100 font-extrabold text-primary">
        {{ formatCurrency(item.amount) }}
      </span>
    </template>

    <!-- Custom slot: methodPay -->
    <template #methodPay="{ item }">
      <div class="flex flex-col">
        <span class="text-xs text-zinc-750 dark:text-zinc-350 font-bold">
          {{ item.methodPay?.name || item.methodPayId || 'Chuyển khoản' }}
        </span>
        <span class="text-[9px] text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
          {{ item.methodPay?.typePay || 'Manual' }}
        </span>
      </div>
    </template>

    <!-- Custom slot: status -->
    <template #status="{ item }">
      <div class="flex items-center gap-1.5 select-none">
        <span 
          class="w-1.5 h-1.5 rounded-full animate-pulse"
          :class="{
            'bg-emerald-500': item.status === 'approved',
            'bg-amber-500': item.status === 'pending',
            'bg-red-500': item.status === 'rejected'
          }"
        ></span>
        <span 
          class="text-[11px] font-bold uppercase"
          :class="{
            'text-emerald-500 dark:text-emerald-450': item.status === 'approved',
            'text-amber-500 dark:text-amber-400': item.status === 'pending',
            'text-red-500 dark:text-red-400': item.status === 'rejected'
          }"
        >
          {{ item.status === 'approved' ? 'Đã duyệt' : (item.status === 'pending' ? 'Chờ duyệt' : (item.status === 'rejected' ? 'Đã từ chối' : item.status)) }}
        </span>
      </div>
    </template>

    <!-- Custom slot: createdAt -->
    <template #createdAt="{ item }">
      <span class="text-xs text-zinc-450 dark:text-zinc-555 font-semibold">
        {{ formatDate(item.createdAt) }}
      </span>
    </template>

    <!-- Custom slot: actions -->
    <template #actions="{ item }">
      <div class="inline-flex items-center gap-2">
        <CmButton 
          variant="outline" 
          icon="heroicons:eye" 
          class="h-8 text-[11px] border-zinc-150 dark:border-zinc-800 font-bold px-3 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-655 dark:text-zinc-300"
          title="Xem chi tiết giao dịch"
          @click="emit('view-details', item)"
        >
          Chi tiết
        </CmButton>
        <CmButton 
          variant="ghost" 
          icon="heroicons:trash" 
          iconOnly 
          class="w-8 h-8 rounded-full text-zinc-400 hover:text-red-500 dark:hover:text-red-400"
          title="Xóa đơn hàng"
          @click="emit('delete-item', item)"
        />
      </div>
    </template>
  </CmTable>
</template>
