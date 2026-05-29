<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { User } from '~/types/user';

const props = defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  (e: 'toast', message: string, type?: 'success' | 'error'): void;
}>();

const userBanks = ref<any[]>([]);
const loading = ref(false);

const methodPayApi = useMethodPayApi();
const { call } = useApi();
const config = useRuntimeConfig();

// Bank Payment Method CRUD State
const isBankModalOpen = ref(false);
const isBankEditing = ref(false);
const bankModalLoading = ref(false);
const bankModalError = ref('');
const editingBankId = ref<string | null>(null);

const bankForm = ref({
  name: '',
  bankName: '',
  bankNumber: '',
  accountHolderName: '',
  code: '',
  cardNumber: '',
  QRCode: '',
  status: 'active',
});

const qrInputMode = ref<'link' | 'upload'>('link');
const qrFileInputRef = ref<{ click: () => void; clear: () => void } | null>(null);
const uploadingQRCode = ref(false);

const triggerQRFileInput = () => {
  qrFileInputRef.value?.click();
};

const getQRCodeUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  return `${config.public.apiBaseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

const handleQRCodeUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('files', file);

  uploadingQRCode.value = true;
  try {
    const res = await call('/upload/images', 'POST', formData);
    if (res && res.status && res.data && res.data.length > 0) {
      bankForm.value.QRCode = res.data[0].url;
      emit('toast', 'Tải lên ảnh QR Code thành công!', 'success');
    } else {
      emit('toast', res?.message || 'Tải ảnh lên thất bại!', 'error');
    }
  } catch (err: any) {
    emit('toast', err?.message || 'Đã có lỗi xảy ra khi tải ảnh!', 'error');
  } finally {
    uploadingQRCode.value = false;
    qrFileInputRef.value?.clear();
  }
};

const fetchUserBanks = async () => {
  loading.value = true;
  try {
    const response = await methodPayApi.findAll({ userId: props.user.id });
    if (response && response.status) {
      userBanks.value = response.data || [];
    } else {
      userBanks.value = [];
    }
  } catch (err) {
    console.error('Failed to fetch user bank payment methods:', err);
    userBanks.value = [];
  } finally {
    loading.value = false;
  }
};

const openAddBankModal = () => {
  bankForm.value = {
    name: '',
    bankName: '',
    bankNumber: '',
    accountHolderName: props.user.fullName?.toUpperCase() || props.user.userName?.toUpperCase() || '',
    code: '',
    cardNumber: '',
    QRCode: '',
    status: 'active',
  };
  qrInputMode.value = 'link';
  bankModalError.value = '';
  isBankEditing.value = false;
  editingBankId.value = null;
  isBankModalOpen.value = true;
};

const openEditBankModal = (bank: any) => {
  bankForm.value = {
    name: bank.name || '',
    bankName: bank.bankName || '',
    bankNumber: bank.bankNumber || '',
    accountHolderName: bank.accountHolderName || '',
    code: bank.code || '',
    cardNumber: bank.cardNumber || '',
    QRCode: bank.QRCode || '',
    status: bank.status || 'active',
  };
  qrInputMode.value = bank.QRCode ? 'upload' : 'link';
  bankModalError.value = '';
  isBankEditing.value = true;
  editingBankId.value = bank.id;
  isBankModalOpen.value = true;
};

const handleSaveBank = async () => {
  if (!bankForm.value.name.trim()) {
    bankModalError.value = 'Vui lòng nhập tên phương thức (ví dụ: Vietcombank)';
    return;
  }
  if (!bankForm.value.bankName.trim()) {
    bankModalError.value = 'Vui lòng nhập tên ngân hàng';
    return;
  }
  if (!bankForm.value.bankNumber.trim()) {
    bankModalError.value = 'Vui lòng nhập số tài khoản';
    return;
  }
  if (!bankForm.value.accountHolderName.trim()) {
    bankModalError.value = 'Vui lòng nhập tên chủ tài khoản';
    return;
  }
  if (!bankForm.value.code.trim()) {
    bankModalError.value = 'Vui lòng nhập mã ngân hàng (Code)';
    return;
  }

  bankModalLoading.value = true;
  bankModalError.value = '';

  try {
    if (isBankEditing.value && editingBankId.value) {
      const response = await methodPayApi.update(editingBankId.value!, {
        ...bankForm.value,
        type: 'account' as any,
      });
      if (response && response.status) {
        emit('toast', 'Cập nhật tài khoản ngân hàng thành công!', 'success');
        isBankModalOpen.value = false;
        await fetchUserBanks();
      } else {
        const errMsg = methodPayApi.error.value?.message;
        bankModalError.value = Array.isArray(errMsg)
          ? (errMsg[0] || 'Không thể cập nhật tài khoản ngân hàng.')
          : (errMsg || 'Không thể cập nhật tài khoản ngân hàng.');
      }
    } else {
      const response = await methodPayApi.create({
        ...bankForm.value,
        type: 'account' as any,
        userId: props.user.id,
      });
      if (response && response.status) {
        emit('toast', 'Liên kết tài khoản ngân hàng mới thành công!', 'success');
        isBankModalOpen.value = false;
        await fetchUserBanks();
      } else {
        const errMsg = methodPayApi.error.value?.message;
        bankModalError.value = Array.isArray(errMsg)
          ? (errMsg[0] || 'Không thể liên kết tài khoản ngân hàng.')
          : (errMsg || 'Không thể liên kết tài khoản ngân hàng.');
      }
    }
  } catch (err: any) {
    bankModalError.value = err.message || 'Có lỗi hệ thống xảy ra.';
  } finally {
    bankModalLoading.value = false;
  }
};

const handleDeleteBank = async (bankId: string) => {
  if (!confirm('Bạn có chắc chắn muốn xóa phương thức thanh toán ngân hàng này không?')) {
    return;
  }
  try {
    await methodPayApi.remove(bankId);
    emit('toast', 'Đã xóa phương thức thanh toán ngân hàng thành công!', 'success');
    await fetchUserBanks();
  } catch (err) {
    console.error('Failed to delete bank payment method:', err);
    emit('toast', 'Có lỗi xảy ra khi xóa phương thức thanh toán.', 'error');
  }
};

onMounted(() => {
  fetchUserBanks();
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between select-none">
      <h4 class="text-xs font-black text-zinc-455 dark:text-zinc-550 uppercase tracking-wider">Danh sách tài khoản ngân hàng liên kết</h4>
      <CmButton 
        variant="primary" 
        size="sm" 
        icon="heroicons:plus-circle"
        class="text-[10px] font-bold py-1 px-2.5 h-7 shadow-sm shadow-primary/10"
        @click="openAddBankModal"
      >
        Thêm ngân hàng
      </CmButton>
    </div>

    <!-- Loading Skeleton/Spinner -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <Icon name="heroicons:arrow-path" class="text-3xl text-primary animate-spin" />
      <p class="text-xs text-zinc-400 dark:text-zinc-500 mt-2 font-medium">Đang tải danh sách ngân hàng...</p>
    </div>

    <div v-else-if="userBanks.length === 0" class="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] select-none">
      <Icon name="heroicons:credit-card" class="text-3xl text-zinc-300 dark:text-zinc-700 mb-2" />
      <p class="text-xs text-zinc-450 dark:text-zinc-500 font-bold">Chưa liên kết tài khoản ngân hàng nào</p>
      <p class="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-1">Nhấn vào "Thêm ngân hàng" ở trên để liên kết tài khoản đầu tiên.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <p class="text-[9px] text-zinc-400 font-semibold mt-0.5">{{ bank.name }} ({{ bank.code }})</p>
            </div>
          </div>
          <span 
            v-if="bank.status === 'active'" 
            class="text-[9px] font-bold bg-primary/10 text-primary border border-primary/25 px-2.5 py-0.5 rounded-full select-none"
          >
            Hoạt động 
          </span>
          <span 
            v-else 
            class="text-[9px] font-bold bg-zinc-200 text-zinc-550 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 px-2.5 py-0.5 rounded-full select-none"
          >
            Không hoạt động 
          </span>
        </div>
        <div class="mt-6 relative z-10">
          <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider select-none">Số tài khoản</p>
          <p class="text-base font-black text-zinc-800 dark:text-white tracking-widest mt-0.5 select-all">{{ bank.bankNumber }}</p>
        </div>
        <div class="mt-4 flex items-center justify-between relative z-10">
          <div> 
            <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider select-none">Chủ tài khoản</p>
            <p class="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mt-0.5">{{ bank.accountHolderName }}</p>
          </div>
          <div class="flex items-center gap-1.5">
            <CmButtonBase 
              class="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary/30 transition-all duration-300 bg-white/50 dark:bg-zinc-900/50"
              title="Chỉnh sửa tài khoản"
              @click="openEditBankModal(bank)"
            >
              <Icon name="heroicons:pencil-square" class="text-xs" />
            </CmButtonBase>
            <CmButtonBase 
              class="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-450 hover:text-red-500 hover:border-red-500/30 transition-all duration-300 bg-white/50 dark:bg-zinc-900/50"
              title="Xóa tài khoản"
              @click="handleDeleteBank(bank.id)"
            >
              <Icon name="heroicons:trash" class="text-xs" />
            </CmButtonBase>
          </div>
        </div>
      </div>
    </div>

    <!-- Bank Payment Method Dialog Modal (Add/Edit) -->
    <CmDialog
      v-model:isOpen="isBankModalOpen"
      :title="isBankEditing ? 'Cập nhật tài khoản ngân hàng' : 'Liên kết tài khoản ngân hàng mới'"
      size="md"
    >
      <div class="space-y-5">
        <!-- Error alert if any -->
        <div 
          v-if="bankModalError" 
          class="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-900/30 rounded-xl text-xs font-bold text-red-500 flex items-center gap-2 select-none"
        >
          <Icon name="heroicons:information-circle" class="text-base shrink-0" />
          <span>{{ bankModalError }}</span>
        </div>

        <div class="space-y-4">
          <!-- Method Payment Name -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
              Tên hiển thị phương thức <span class="text-red-500">*</span>
            </label>
            <CmInput 
              v-model="bankForm.name"
              placeholder="Ví dụ: Vietcombank, Techcombank..."
              icon="heroicons:tag"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Bank Name Input -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
                Tên Ngân hàng <span class="text-red-500">*</span>
              </label>
              <CmInput 
                v-model="bankForm.bankName"
                placeholder="Ví dụ: Vietcombank"
                icon="heroicons:building-library"
              />
            </div>

            <!-- Bank Code (e.g. VCB, TCB) -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-555 select-none">
                Mã Ngân hàng <span class="text-red-500">*</span>
              </label>
              <CmInput 
                v-model="bankForm.code"
                placeholder="Ví dụ: VCB"
                icon="heroicons:qr-code"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Account Number Input -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-555 select-none">
                Số tài khoản <span class="text-red-500">*</span>
              </label>
              <CmInput 
                v-model="bankForm.bankNumber"
                placeholder="Nhập số tài khoản"
                icon="heroicons:credit-card"
              />
            </div>

            <!-- Account Holder Name Input -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-555 select-none">
                Tên chủ tài khoản <span class="text-red-500">*</span>
              </label>
              <CmInput 
                v-model="bankForm.accountHolderName"
                placeholder="Ví dụ: NGUYEN VAN A"
                icon="heroicons:user"
              />
            </div>
          </div>

          <!-- Card Number Input (Optional) -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-555 select-none">
              Số thẻ liên kết (Tùy chọn)
            </label>
            <CmInput 
              v-model="bankForm.cardNumber"
              placeholder="Nhập số thẻ ATM (nếu có)"
              icon="heroicons:identification"
            />
          </div>

          <!-- QRCode Input (Optional) with Two Options -->
          <div class="flex flex-col gap-2.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-555 select-none">
              Hình ảnh QR Code (Tùy chọn)
            </label>
            
            <div class="bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-150/60 dark:border-zinc-800/40 rounded-2xl p-4 space-y-4">
              <!-- Tab Selector for Input Options -->
              <div class="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
                <CmButtonBase
                  type="button"
                  class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all duration-300"
                  :class="qrInputMode === 'link'
                    ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'"
                  @click="qrInputMode = 'link'"
                >
                  <Icon name="heroicons:link" class="text-sm" />
                  <span>Nhập đường dẫn</span>
                </CmButtonBase>
                <CmButtonBase
                  type="button"
                  class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all duration-300"
                  :class="qrInputMode === 'upload'
                    ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'"
                  @click="qrInputMode = 'upload'"
                >
                  <Icon name="heroicons:cloud-arrow-up" class="text-sm" />
                  <span>Tải ảnh lên</span>
                </CmButtonBase>
              </div>

              <!-- Option 1: Link/URL Mode -->
              <div v-if="qrInputMode === 'link'" class="space-y-3">
                <CmInput 
                  v-model="bankForm.QRCode"
                  placeholder="URL hình ảnh mã QR Code thanh toán nhanh"
                  icon="heroicons:photo"
                />
                
                <!-- URL Preview -->
                <div v-if="bankForm.QRCode" class="flex flex-col items-center justify-center p-4 border border-zinc-150 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/60 relative overflow-hidden">
                  <span class="text-[9px] font-black uppercase text-zinc-400 tracking-wider mb-2">Xem trước QR Code</span>
                  <div class="relative group/qr">
                    <img 
                      :src="getQRCodeUrl(bankForm.QRCode)" 
                      class="max-h-[140px] rounded-lg object-contain border border-zinc-100 dark:border-zinc-800 bg-white p-1"
                      alt="QR Code Preview"
                      @error="(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/150x150?text=Invalid+Image'"
                    />
                    <CmButtonBase
                      type="button"
                      class="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md transition-colors"
                      title="Xóa đường dẫn"
                      @click="bankForm.QRCode = ''"
                    >
                      <Icon name="heroicons:x-mark" class="text-xs" />
                    </CmButtonBase>
                  </div>
                </div>
              </div>

              <!-- Option 2: Image Upload Mode -->
              <div v-else class="space-y-3">
                <CmFileInput
                  ref="qrFileInputRef" 
                  accept="image/*" 
                  class="hidden" 
                  @change="handleQRCodeUpload" 
                />

                <!-- Upload Drag/Drop Zone -->
                <div 
                  v-if="!bankForm.QRCode"
                  class="border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 group/drop"
                  @click="triggerQRFileInput"
                >
                  <div class="flex flex-col items-center gap-2">
                    <div 
                      class="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10 group-hover/drop:scale-105 transition-transform"
                      :class="uploadingQRCode ? 'animate-pulse' : ''"
                    >
                      <Icon v-if="!uploadingQRCode" name="heroicons:cloud-arrow-up" class="text-2xl" />
                      <Icon v-else name="heroicons:arrow-path" class="text-2xl animate-spin" />
                    </div>
                    <div>
                      <p class="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {{ uploadingQRCode ? 'Đang tải lên...' : 'Nhấp để chọn ảnh QR Code' }}
                      </p>
                      <p class="text-[9px] text-zinc-400 mt-1">Định dạng JPG, JPEG, PNG (Tối đa 5MB)</p>
                    </div>
                  </div>
                </div>

                <!-- Upload Preview & Actions -->
                <div 
                  v-else 
                  class="flex flex-col items-center justify-center p-4 border border-zinc-150 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/60 relative overflow-hidden group/qr-upload"
                >
                  <!-- Loading overlay -->
                  <div v-if="uploadingQRCode" class="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-20 flex items-center justify-center gap-2">
                    <Icon name="heroicons:arrow-path" class="text-lg text-primary animate-spin" />
                    <span class="text-xs font-bold text-zinc-700 dark:text-zinc-300">Đang tải lên...</span>
                  </div>

                  <span class="text-[9px] font-black uppercase text-zinc-400 tracking-wider mb-2">QR Code Đã Tải Lên</span>
                  <div class="relative">
                    <img 
                      :src="getQRCodeUrl(bankForm.QRCode)" 
                      class="max-h-[140px] rounded-lg object-contain border border-zinc-100 dark:border-zinc-800 bg-white p-1"
                      alt="Uploaded QR Code"
                    />
                  </div>

                  <div class="flex items-center gap-3 mt-4 w-full">
                    <CmButtonBase
                      type="button"
                      class="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                      @click="triggerQRFileInput"
                    >
                      <Icon name="heroicons:arrow-path" class="text-xs" />
                      <span>Đổi ảnh khác</span> 
                    </CmButtonBase>
                    <CmButtonBase
                      type="button"
                      class="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-red-150/80 dark:border-red-950/30 text-[10px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      @click="bankForm.QRCode = ''"
                    >
                      <Icon name="heroicons:trash" class="text-xs" />
                      <span>Xóa hình ảnh</span>
                    </CmButtonBase>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Input -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-555 select-none">
              Trạng thái phương thức 
            </label>
            <CmSelectBase 
              v-model="bankForm.status"
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-primary/50"
            >
              <option value="active">Hoạt động (Active)</option>
              <option value="inactive">Không hoạt động (Inactive)</option>
            </CmSelectBase>
          </div>
        </div>
      </div>

      <template #footer>
        <CmButton 
          variant="ghost" 
          size="md" 
          class="text-xs font-semibold px-5" 
          :disabled="bankModalLoading"
          @click="isBankModalOpen = false"
        >
          Hủy bỏ
        </CmButton>
        <CmButton 
          variant="primary" 
          size="md" 
          class="text-xs font-bold px-5 shadow-sm shadow-primary/10" 
          :loading="bankModalLoading"
          @click="handleSaveBank"
        >
          {{ isBankEditing ? 'Cập nhật' : 'Liên kết ngay' }}
        </CmButton>
      </template>
    </CmDialog>
  </div>
</template>
