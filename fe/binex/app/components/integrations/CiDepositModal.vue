<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useWalletApi } from '~/api/wallet';
import { useUploadApi } from '~/api/upload';
import { usePayApi } from '~/api/pay';
import { useMethodPayApi } from '~/api/method-pay';
import { OrderType } from '~/types/enums/order-type';
import mascotLogin from '/img/mascot_login.png';

const { isDepositModalOpen, closeDepositModal, user, depositData } = useUser();
const walletApi = useWalletApi();
const uploadApi = useUploadApi();
const payApi = usePayApi();
const methodPayApi = useMethodPayApi();
const { public: { apiBaseUrl } } = useRuntimeConfig();

const amount = ref<number | null>(null);
const currentStep = ref(1); // 1: Input, 2: Transfer Info, 3: Verification, 4: Success
const isProcessing = ref(false);
const isUploading = ref(false);
const errorMessage = ref('');

// State for Payment Methods
const methods = ref<any[]>([]);
const selectedMethodId = ref('');
const isManualMode = ref(false);
const manualBank = ref('');
const manualAccount = ref('');

const transactionCode = ref(''); // generated code for reference
const userTransactionCode = ref(''); // input from user bank app
const userProofImage = ref(''); // uploaded image URL
const fileInput = ref<HTMLInputElement | null>(null);

// System bank accounts (Binex receiving accounts)
const systemAccounts = ref<any[]>([]);

const vnBanks = [
  'Vietcombank', 'Techcombank', 'MB Bank', 'Agribank', 'VietinBank', 
  'BIDV', 'ACB', 'VPBank', 'TPBank', 'Sacombank', 'Momo', 'ZaloPay'
];

// Fetch available methods
const fetchMethods = async () => {
  try {
    const res = await methodPayApi.findMine();
    const data = res?.data;
    if (Array.isArray(data)) {
      methods.value = data;
    } else if (data && Array.isArray(data.items)) {
      methods.value = data.items;
    }
    
    if (methods.value.length > 0 && !selectedMethodId.value) {
      selectedMethodId.value = methods.value[0].id;
      isManualMode.value = false;
    } else if (methods.value.length === 0) {
      isManualMode.value = true;
    }
  } catch (err) {
    console.error('Lỗi lấy danh sách phương thức:', err);
  }
};

// Fetch system (Binex) bank accounts
const fetchSystemAccounts = async () => {
  try {
    const res = await methodPayApi.findSystem();
    const data = res?.data;
    if (Array.isArray(data)) {
      systemAccounts.value = data;
    } else if (data && Array.isArray(data.items)) {
      systemAccounts.value = data.items;
    }
  } catch (err) {
    console.error('Lỗi lấy tài khoản hệ thống:', err);
  }
};

const saveToPersonalAccount = async () => {
  if (!manualBank.value || !manualAccount.value) return;
  
  isProcessing.value = true;
  try {
    const payload = {
      name: manualBank.value,
      bankName: manualBank.value,
      bankNumber: manualAccount.value,
      accountHolderName: user.value?.fullName || user.value?.userName || 'Cá nhân',
      type: 'account',
      code: manualBank.value.substring(0, 3).toUpperCase(),
      status: 'active'
    };
    
    await methodPayApi.create(payload as any);
    await fetchMethods();
    isManualMode.value = false;
    // Tìm phương thức vừa tạo để select
    const newMethod = methods.value.find(m => m.bankNumber === manualAccount.value);
    if (newMethod) selectedMethodId.value = newMethod.id;
  } catch (err) {
    console.error('Lỗi lưu tài khoản:', err);
    errorMessage.value = 'Không thể lưu tài khoản vào danh sách cá nhân.';
  } finally {
    isProcessing.value = false;
  }
};

onMounted(() => {
  fetchMethods();
  fetchSystemAccounts();
});

// Watch depositData to pre-fill amount
watch(() => depositData.value, (data) => {
  if (data?.amount) amount.value = data.amount;
}, { immediate: true });

const selectedMethodDetails = computed(() => {
  if (isManualMode.value) {
    return {
      bankName: manualBank.value || 'Chưa chọn',
      accountNumber: manualAccount.value || 'Chưa nhập',
      accountName: 'BINEX BANK'
    };
  }
  const method = methods.value.find(m => m.id === selectedMethodId.value);
  return method ? {
    bankName: method.bankName,
    accountNumber: method.bankNumber,
    accountName: method.accountHolderName || 'BINEX BANK'
  } : {
    bankName: 'Chưa chọn',
    accountNumber: '',
    accountName: ''
  };
});

// System bank info for Step 2 (Binex receiving account)
const systemBankInfo = computed(() => {
  const acc = systemAccounts.value[0];
  if (!acc) return null;
  return {
    bankName: acc.bankName,
    accountNumber: acc.bankNumber,
    accountName: acc.accountHolderName,
    code: acc.code
  };
});

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files?.length) return;

  isUploading.value = true;
  errorMessage.value = '';
  const formData = new FormData();
  formData.append('files', target.files[0]);

  try {
    const res = await uploadApi.uploadImages(formData);
    if (res?.data && res.data[0]?.url) {
      userProofImage.value = `${apiBaseUrl}${res.data[0].url}`;
    }
  } catch (err) {
    errorMessage.value = 'Lỗi khi tải ảnh lên. Vui lòng thử lại.';
    console.error('Lỗi upload ảnh:', err);
  } finally {
    isUploading.value = false;
  }
};

const handleDeposit = async () => {
  if (!amount.value || amount.value <= 0) return;
  if (isManualMode.value && (!manualBank.value || !manualAccount.value)) return;
  if (!isManualMode.value && !selectedMethodId.value) return;
  
  isProcessing.value = true;
  errorMessage.value = '';
  try {
    const timePart = Date.now().toString(36).toUpperCase().slice(-5);
    const userPart = (user.value?.id || 'BX').slice(-3).toUpperCase();
    transactionCode.value = `#${userPart}${timePart}`;
    currentStep.value = 2;
  } catch (err) {
    errorMessage.value = 'Không thể khởi tạo giao dịch.';
    console.error('Lỗi khi khởi tạo nạp tiền:', err);
  } finally {
    isProcessing.value = false;
  }
};

const handleConfirmTransfer = () => {
  currentStep.value = 3;
};

const handleSubmitManual = async () => {
  if (!userTransactionCode.value) return;

  isProcessing.value = true;
  errorMessage.value = '';
  try {
    const payload = {
      packageId: depositData.value?.packageId || 'PK_001',
      serviceId: depositData.value?.serviceId || 'SER_001',
      orderType: OrderType.CR_OD_PK,
      amount: amount.value || 0,
      transactionCode: userTransactionCode.value,
      proofImage: userProofImage.value,
      methodPayId: isManualMode.value ? 'MANUAL' : selectedMethodId.value
    };

    const res = await payApi.submitManualPayment(payload);
    if (res.data) {
      currentStep.value = 4;
    } else {
      errorMessage.value = 'Gửi xác minh thất bại. Vui lòng kiểm tra lại thông tin.';
    }
  } catch (err) {
    errorMessage.value = 'Có lỗi xảy ra khi kết nối máy chủ.';
    console.error('Lỗi gửi xác minh:', err);
  } finally {
    isProcessing.value = false;
  }
};

const copyToClipboard = async (text: string) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback cho trình duyệt cũ hoặc không hỗ trợ
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
};

const close = () => {
  closeDepositModal();
  setTimeout(() => {
    currentStep.value = 1;
    amount.value = null;
    userTransactionCode.value = '';
    userProofImage.value = '';
    isManualMode.value = false;
    manualBank.value = '';
    manualAccount.value = '';
    errorMessage.value = '';
  }, 500);
};
</script>

<template>
  <Teleport to="body">
    <Transition name="deposit-fade">
      <div v-if="isDepositModalOpen" class="fixed inset-0 z-[10001] flex items-center justify-center p-4 md:p-6">
        <div class="absolute inset-0 bg-black/95 backdrop-blur-2xl" @click="close"></div>

        <div class="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] animate-modal-in">
          
          <!-- Header -->
          <div class="p-8 md:p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-2xl bg-[#CCFF00] flex items-center justify-center text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                <Icon name="ph:hand-coins-bold" size="20" />
              </div>
              <div>
                <h3 class="text-white font-black uppercase tracking-tighter text-sm">Nạp tiền vào ví</h3>
                <p class="text-white/20 text-[8px] font-bold uppercase tracking-[0.2em]">Cấp vốn cho tài khoản Binex</p>
              </div>
            </div>
            <button @click="close" class="text-white/20 hover:text-white transition-colors">
              <Icon name="ph:x-bold" size="20" />
            </button>
          </div>

          <div class="p-8 md:p-12">
            <!-- STEP 1: Input Amount & Method -->
            <div v-if="currentStep === 1" class="max-w-xl mx-auto">
              <div class="mb-8">
                <label class="block text-white/40 text-[10px] font-black uppercase tracking-widest mb-4">Số tiền muốn nạp (VND)</label>
                <div class="relative">
                  <input v-model="amount" 
                         type="number" 
                         placeholder="Nhập số tiền..."
                         class="w-full py-6 px-8 bg-white/[0.03] border border-white/10 rounded-2xl text-2xl font-black text-[#CCFF00] focus:border-[#CCFF00] outline-none transition-all" />
                  <span class="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 font-black tracking-widest text-xs uppercase">VND</span>
                </div>
              </div>

              <div class="mb-10">
                <label class="block text-white/40 text-[10px] font-black uppercase tracking-widest mb-4">Phương thức nạp</label>
                <div class="grid grid-cols-2 gap-3 mb-6">
                  <!-- System Methods -->
                  <template v-if="methods.length > 0">
                    <div v-for="m in methods" :key="m.id"
                         @click="selectedMethodId = m.id; isManualMode = false"
                         class="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/[0.05] transition-all"
                         :class="{ 'border-[#CCFF00]/50 bg-white/[0.05]': selectedMethodId === m.id && !isManualMode }">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#CCFF00]">
                          <Icon name="ph:bank-bold" />
                        </div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-white">{{ m.bankName }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="col-span-2 p-6 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl text-center">
                       <p class="text-white/20 text-[10px] font-bold uppercase tracking-widest italic">Chưa có tài khoản cá nhân đăng ký</p>
                    </div>
                  </template>

                  <!-- Manual Mode Trigger -->
                  <div @click="isManualMode = true; selectedMethodId = ''"
                       class="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/[0.05] transition-all"
                       :class="{ 'border-[#CCFF00]/50 bg-white/[0.05]': isManualMode }">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#CCFF00]">
                        <Icon name="ph:plus-bold" />
                      </div>
                      <span class="text-[10px] font-bold uppercase tracking-wider text-white">Tự nhập STK</span>
                    </div>
                  </div>
                </div>

                <!-- Manual Entry Form -->
                <Transition name="deposit-fade">
                  <div v-if="isManualMode" class="space-y-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl animate-modal-in">
                    <div>
                      <label class="block text-white/40 text-[8px] font-black uppercase tracking-widest mb-2">Chọn ngân hàng</label>
                      <select v-model="manualBank" 
                              class="w-full py-3 px-4 bg-white/[0.03] border border-white/10 rounded-xl text-xs font-bold text-white focus:border-[#CCFF00] outline-none transition-all">
                        <option value="" disabled>-- Chọn ngân hàng --</option>
                        <option v-for="bank in vnBanks" :key="bank" :value="bank">{{ bank }}</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-white/40 text-[8px] font-black uppercase tracking-widest mb-2">Số tài khoản nhận</label>
                      <input v-model="manualAccount" 
                             type="text" 
                             placeholder="Nhập số tài khoản..."
                             class="w-full py-3 px-4 bg-white/[0.03] border border-white/10 rounded-xl text-xs font-bold text-[#CCFF00] focus:border-[#CCFF00] outline-none transition-all" />
                    </div>
                    
                    <button v-if="manualBank && manualAccount"
                            @click="saveToPersonalAccount"
                            class="flex items-center gap-2 text-[#CCFF00] text-[8px] font-black uppercase tracking-widest hover:underline transition-all">
                      <Icon name="ph:floppy-disk-bold" />
                      Thêm vào tài khoản cá nhân
                    </button>
                  </div>
                </Transition>
              </div>

              <button @click="handleDeposit" 
                      :disabled="isProcessing || !amount || (isManualMode && (!manualBank || !manualAccount)) || (!isManualMode && !selectedMethodId)"
                      class="w-full py-5 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                <Icon v-if="isProcessing" name="ph:circle-notch-bold" class="animate-spin text-xl" />
                {{ isProcessing ? 'Đang khởi tạo...' : 'Tiếp tục nạp tiền' }}
              </button>
            </div>

            <!-- STEP 2: Transfer Info (2 Columns) -->
            <div v-if="currentStep === 2" class="animate-modal-in flex flex-col md:flex-row gap-12">
              <!-- Left: Receiving Info -->
              <div class="flex-1 space-y-8">
                <div v-if="!systemBankInfo" class="flex flex-col items-center justify-center py-12">
                  <Icon name="ph:bank-bold" size="48" class="text-white/20 mb-4" />
                  <p class="text-white/40 text-xs font-bold uppercase tracking-widest">Chưa có tài khoản hệ thống</p>
                  <p class="text-white/20 text-[9px] mt-1">Vui lòng liên hệ quản trị viên</p>
                </div>

                <template v-else>
                  <div class="flex flex-col items-center">
                    <div class="relative group">
                      <div class="absolute -inset-4 bg-[#CCFF00]/10 blur-3xl rounded-full"></div>
                      <div class="relative w-56 h-56 p-4 bg-white rounded-[2rem] border-4 border-[#CCFF00] flex items-center justify-center">
                        <img v-if="systemBankInfo.accountNumber"
                             :src="`https://img.vietqr.io/image/${systemBankInfo.code}-${systemBankInfo.accountNumber}-compact2.jpg?amount=${amount}&addInfo=BINEX ${transactionCode}&accountName=${systemBankInfo.accountName}`" 
                             class="w-full h-full object-contain" 
                             alt="VietQR Transfer" />
                        <div v-else class="text-black/20 flex flex-col items-center">
                          <Icon name="ph:qr-code-bold" size="48" />
                          <p class="text-[8px] font-bold mt-2 uppercase">Chưa có thông tin</p>
                        </div>
                      </div>
                    </div>
                    <p class="mt-4 text-white/40 text-[8px] font-black uppercase tracking-[0.3em]">Quét mã VietQR để nạp nhanh</p>
                  </div>

                  <div class="space-y-px bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                    <div class="p-4 flex justify-between items-center bg-white/[0.02]">
                      <span class="text-white/20 text-[9px] font-bold uppercase tracking-widest">Ngân hàng</span>
                      <span class="text-white font-black text-[10px] uppercase tracking-tighter">{{ systemBankInfo.bankName }}</span>
                    </div>
                    <div class="p-4 flex justify-between items-center bg-white/[0.01]">
                      <span class="text-white/20 text-[9px] font-bold uppercase tracking-widest">Số tài khoản</span>
                      <div class="flex items-center gap-2">
                        <span class="text-white font-black text-xs tracking-widest">{{ systemBankInfo.accountNumber }}</span>
                        <button @click="copyToClipboard(systemBankInfo.accountNumber)" class="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black transition-all">
                          <Icon name="ph:copy-bold" size="12" />
                        </button>
                      </div>
                    </div>
                    <div class="p-4 flex justify-between items-center bg-white/[0.02]">
                      <span class="text-white/20 text-[9px] font-bold uppercase tracking-widest">Chủ tài khoản</span>
                      <span class="text-white font-black text-[10px] uppercase tracking-tighter">{{ systemBankInfo.accountName }}</span>
                    </div>
                  </div>
                </template>
              </div>

              <!-- Right: Payment Info & Button -->
              <div class="flex-1 flex flex-col">
                <div class="flex-1 space-y-6">
                  <div class="p-8 bg-[#CCFF00]/5 border border-[#CCFF00]/20 rounded-[2.5rem] text-center">
                    <p class="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-2">Số tiền cần nạp</p>
                    <h4 class="text-4xl font-black text-[#CCFF00]">{{ amount?.toLocaleString() }}đ</h4>
                  </div>

                  <div class="p-6 bg-white/[0.03] border border-white/10 rounded-[2rem]">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-white/20 text-[9px] font-bold uppercase tracking-widest">Nội dung nạp tiền</span>
                      <button @click="copyToClipboard(`BINEX ${transactionCode}`)" class="text-[#CCFF00] text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        Sao chép <Icon name="ph:copy-bold" />
                      </button>
                    </div>
                    <p class="text-xl font-black text-white tracking-widest uppercase">BINEX {{ transactionCode }}</p>
                    <p class="mt-2 text-[9px] text-red-500/80 font-bold uppercase tracking-wider italic">* Vui lòng ghi đúng nội dung để nạp tự động</p>
                  </div>
                </div>

                <div class="mt-12 space-y-4">
                  <button @click="handleConfirmTransfer"
                          class="w-full py-6 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-[0_0_30px_rgba(204,255,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all">
                    Tôi đã chuyển khoản xong
                  </button>
                  <button @click="currentStep = 1" class="w-full text-white/20 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">
                    Quay lại sửa số tiền
                  </button>
                </div>
              </div>
            </div>

            <!-- STEP 3: Verification -->
            <div v-if="currentStep === 3" class="animate-modal-in max-w-xl mx-auto">
              <div class="mb-8 text-center">
                <h4 class="text-white font-black uppercase tracking-tighter text-2xl mb-2">Xác minh thanh toán</h4>
                <p class="text-white/40 text-[10px] font-bold uppercase tracking-widest">Vui lòng cung cấp thông tin để chúng tôi đối soát</p>
              </div>

              <div class="space-y-6 mb-10">
                <div>
                  <label class="block text-white/40 text-[9px] font-black uppercase tracking-widest mb-3">Mã giao dịch từ ngân hàng</label>
                  <input v-model="userTransactionCode" 
                         type="text" 
                         placeholder="Ví dụ: FT231..."
                         class="w-full py-4 px-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-bold focus:border-[#CCFF00] outline-none transition-all" />
                </div>

                <div>
                  <label class="block text-white/40 text-[9px] font-black uppercase tracking-widest mb-3">Ảnh biên lai / Chụp màn hình</label>
                  <div @click="fileInput?.click()" 
                       class="relative group cursor-pointer aspect-video bg-white/[0.02] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center hover:border-[#CCFF00]/50 hover:bg-white/[0.04] transition-all overflow-hidden">
                    <input ref="fileInput" type="file" class="hidden" @change="handleFileUpload" accept="image/*" />
                    
                    <template v-if="userProofImage">
                      <img :src="userProofImage" class="w-full h-full object-cover" />
                      <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span class="text-[#CCFF00] text-[10px] font-black uppercase">Thay đổi ảnh</span>
                      </div>
                    </template>
                    <template v-else-if="isUploading">
                      <Icon name="ph:circle-notch-bold" class="animate-spin text-3xl text-[#CCFF00] mb-3" />
                      <span class="text-white/20 text-[10px] font-black uppercase">Đang tải lên...</span>
                    </template>
                    <template v-else>
                      <Icon name="ph:camera-bold" class="text-3xl text-white/20 mb-3 group-hover:text-[#CCFF00] transition-colors" />
                      <span class="text-white/20 text-[10px] font-black uppercase group-hover:text-white transition-colors">Bấm để tải ảnh lên</span>
                    </template>
                  </div>
                </div>
              </div>

              <div v-if="errorMessage" class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p class="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">{{ errorMessage }}</p>
              </div>

              <div class="space-y-4">
                <button @click="handleSubmitManual"
                        :disabled="isProcessing || !userTransactionCode || !userProofImage"
                        class="w-full py-5 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                  <Icon v-if="isProcessing" name="ph:circle-notch-bold" class="animate-spin text-xl" />
                  Gửi xác minh ngay
                </button>
                <button @click="currentStep = 2" class="w-full text-white/20 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">
                  Quay lại xem thông tin ngân hàng
                </button>
              </div>
            </div>

            <!-- STEP 4: Success -->
            <div v-if="currentStep === 4" class="text-center animate-modal-in">
              <div class="mb-8 animate-float">
                <img :src="mascotLogin" class="w-40 mx-auto drop-shadow-[0_0_30px_rgba(204,255,0,0.3)]" />
              </div>
              <h2 class="text-3xl font-black uppercase tracking-tighter text-white mb-4">Gửi yêu cầu thành công</h2>
              <p class="text-white/40 text-xs font-medium leading-relaxed mb-10 max-w-sm mx-auto uppercase tracking-widest">
                Yêu cầu của bạn đang được hệ thống phê duyệt. Vui lòng giữ liên lạc, chúng tôi sẽ thông báo ngay khi giao dịch hoàn tất.
              </p>
              <button @click="close"
                      class="w-full py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/10 transition-all">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.deposit-fade-enter-active, .deposit-fade-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.deposit-fade-enter-from, .deposit-fade-leave-to { opacity: 0; transform: scale(1.1); }

@keyframes modal-in {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-modal-in { animation: modal-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
.animate-float { animation: float 6s ease-in-out infinite; }
</style>
