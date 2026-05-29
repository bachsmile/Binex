<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { PaymentRequestStatus } from '~/types/payment-request';

const isOpen = defineModel<boolean>('isOpen', { default: false });

const props = defineProps<{
  item: any | null;
  verifyLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'verify', requestId: string, status: 'approved' | 'rejected', adminNote?: string): void;
}>();

const adminNoteInput = ref('');

// Reset note when modal opens or item changes
watch(() => props.item, (newVal) => {
  if (newVal) {
    adminNoteInput.value = newVal.adminNote || '';
  } else {
    adminNoteInput.value = '';
  }
});

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

const config = useRuntimeConfig();

const resolveProofImage = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${config.public.apiBaseUrl}/${cleanPath}`;
};

const handleVerify = (status: 'approved' | 'rejected') => {
  if (!props.item) return;
  emit('verify', props.item.id, status, adminNoteInput.value);
};
</script>

<template>
  <CmDialog
    v-model:isOpen="isOpen"
    title="Chi tiết yêu cầu thanh toán chuyển khoản"
    size="xl"
  >
    <div v-if="item" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Left Side: Transaction Details (7 Columns) -->
        <div class="lg:col-span-7 space-y-6">
          
          <!-- Core Info Section -->
          <div class="p-5 rounded-3xl border border-zinc-150/80 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/20 space-y-4">
            <h3 class="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-2">
              <Icon name="heroicons:information-circle" class="text-sm" />
              <span>Thông tin Giao dịch</span>
            </h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="flex flex-col">
                  <span class="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Mã giao dịch (Nội dung)</span>
                  <span class="text-xs font-bold text-zinc-850 dark:text-zinc-100 mt-1 select-all font-mono bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded w-fit">
                    {{ item.transactionCode || 'N/A' }}
                  </span>
                </div>
                
                <div class="flex flex-col">
                  <span class="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Mã yêu cầu</span>
                  <span class="text-xs font-mono font-medium text-zinc-650 dark:text-zinc-450 mt-0.5 select-all">
                    {{ item.id }}
                  </span>
                </div>

                <div class="flex flex-col">
                  <span class="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Loại yêu cầu</span>
                  <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                    {{ getOrderTypeLabel(item.orderType) }}
                  </span>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex flex-col">
                  <span class="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Người yêu cầu (ID/Tên)</span>
                  <span class="text-xs font-bold text-primary mt-0.5 truncate">
                    {{ item.user?.userName || item.userId || 'N/A' }}
                  </span>
                </div>

                <div class="flex flex-col">
                  <span class="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Mã Gói đăng ký</span>
                  <span class="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                    {{ item.packageId || 'Không có' }}
                  </span>
                </div>

                <div class="flex flex-col">
                  <span class="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Thời gian yêu cầu</span>
                  <span class="text-xs font-medium text-zinc-650 dark:text-zinc-400 mt-0.5">
                    {{ formatDate(item.createdAt) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Amount and Method Details -->
          <div class="p-5 rounded-3xl border border-zinc-150/80 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/20 space-y-4">
            <h3 class="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Icon name="heroicons:credit-card" class="text-sm" />
              <span>Thông tin Thanh toán</span>
            </h3>
            
            <div class="flex flex-col mb-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 w-full">
              <span class="text-[10px] text-primary font-black uppercase tracking-widest">Tổng số tiền cần thanh toán</span>
              <span class="text-2xl font-black text-primary mt-1 font-sans">
                {{ formatCurrency(item.amount) }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div class="space-y-3">
                <div class="flex flex-col">
                  <span class="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Tên Phương thức</span>
                  <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                    {{ item.methodPay?.name || item.methodPayId || 'Chuyển khoản' }}
                  </span>
                </div>
                
                <div class="flex flex-col">
                  <span class="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Số tài khoản</span>
                  <span class="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200 mt-0.5 select-all">
                    {{ item.methodPay?.bankNumber || item.methodPay?.cardNumber || 'N/A' }}
                  </span>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex flex-col">
                  <span class="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Chủ tài khoản</span>
                  <span class="text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mt-0.5 uppercase">
                    {{ item.methodPay?.accountHolderName || 'N/A' }}
                  </span>
                </div>

                <div class="flex flex-col">
                  <span class="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Ngân hàng thụ hưởng</span>
                  <span class="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-0.5">
                    {{ item.methodPay?.bankName || 'N/A' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Proof Image & Operations (5 Columns) -->
        <div class="lg:col-span-5 space-y-6">
          
          <!-- Proof Image container -->
          <div class="p-5 rounded-3xl border border-zinc-150/80 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/20 space-y-4 flex flex-col">
            <h3 class="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-2 shrink-0">
              <Icon name="heroicons:photo" class="text-sm" />
              <span>Minh chứng Chuyển khoản</span>
            </h3>
            
            <div class="flex-1 flex items-center justify-center min-h-[220px] rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 overflow-hidden relative group/proof">
              <a 
                v-if="item.proofImage" 
                :href="resolveProofImage(item.proofImage)" 
                target="_blank" 
                class="w-full h-full flex items-center justify-center p-2"
                title="Click để xem ảnh kích thước lớn"
              >
                <img 
                  :src="resolveProofImage(item.proofImage)" 
                  class="max-w-full max-h-[260px] object-contain rounded-xl shadow-sm hover:scale-[1.02] transition-transform duration-300"
                  alt="Minh chứng chuyển tiền" 
                />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/proof:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[10px] font-bold">
                  <Icon name="heroicons:arrow-top-right-on-square" class="text-sm" />
                  Xem ảnh gốc
                </div>
              </a>
              <div v-else class="flex flex-col items-center justify-center p-6 text-center text-zinc-400">
                <Icon name="heroicons:no-symbol" class="text-3xl mb-2 text-zinc-300" />
                <span class="text-xs font-bold">Chưa tải lên ảnh minh chứng</span>
                <span class="text-[10px] text-zinc-400 dark:text-zinc-555 mt-1 leading-relaxed">Khách hàng chưa đính kèm biên lai chuyển khoản.</span>
              </div>
            </div>
          </div>

          <!-- Transaction Process / Status Box -->
          <div class="p-5 rounded-3xl border border-zinc-150/80 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/20 space-y-4">
            <h3 class="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Icon name="heroicons:adjustments-horizontal" class="text-sm" />
              <span>Xử lý & Trạng thái</span>
            </h3>

            <!-- Processing form for Pending -->
            <div v-if="item.status === 'pending'" class="space-y-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Phản hồi của Admin (Ghi chú)</label>
                <textarea 
                  v-model="adminNoteInput"
                  rows="3"
                  placeholder="Nhập lý do từ chối hoặc lời nhắn phê duyệt gửi đến khách hàng..."
                  class="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-white transition-all resize-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-3 pt-1">
                <CmButton 
                  variant="outline" 
                  size="md" 
                  icon="heroicons:x-circle"
                  class="text-xs font-bold px-4 py-2 border-red-200/50 hover:bg-red-50 dark:hover:bg-red-950/10 text-red-500 hover:border-red-500 dark:border-red-900/50" 
                  :loading="verifyLoading"
                  @click="handleVerify('rejected')"
                >
                  Từ chối
                </CmButton>
                
                <CmButton 
                  variant="primary" 
                  size="md" 
                  icon="heroicons:check-circle"
                  class="text-xs font-bold px-4 py-2 bg-emerald-600 hover:bg-emerald-700 border-none shadow-sm shadow-emerald-500/10" 
                  :loading="verifyLoading"
                  @click="handleVerify('approved')"
                >
                  Phê duyệt
                </CmButton>
              </div>
            </div>

            <!-- View only status box for Approved/Rejected -->
            <div v-else class="p-4 rounded-2xl border flex flex-col gap-3"
              :class="item.status === 'approved' 
                ? 'bg-emerald-500/5 border-emerald-500/10 dark:border-emerald-500/20' 
                : 'bg-red-500/5 border-red-500/10 dark:border-red-500/20'"
            >
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full flex items-center justify-center"
                  :class="item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'"
                >
                  <Icon :name="item.status === 'approved' ? 'heroicons:check' : 'heroicons:x-mark'" class="text-sm" />
                </div>
                <div>
                  <h4 class="text-xs font-black uppercase"
                    :class="item.status === 'approved' ? 'text-emerald-500' : 'text-red-500'"
                  >
                    {{ item.status === 'approved' ? 'Đã phê duyệt' : 'Đã từ chối' }}
                  </h4>
                  <p class="text-[9px] text-zinc-400 dark:text-zinc-555 mt-0.5">Xử lý lúc {{ formatDate(item.updatedAt) }}</p>
                </div>
              </div>
              
              <div v-if="item.adminNote" class="pt-2.5 border-t border-zinc-150/50 dark:border-zinc-850 flex flex-col gap-1">
                <span class="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Phản hồi của Admin</span>
                <p class="text-xs text-zinc-700 dark:text-zinc-350 italic font-medium">
                  "{{ item.adminNote }}"
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end">
        <CmButton 
          variant="primary" 
          size="md" 
          class="text-xs font-bold px-6" 
          @click="isOpen = false"
        >
          Đóng cửa sổ
        </CmButton>
      </div>
    </template>
  </CmDialog>
</template>
