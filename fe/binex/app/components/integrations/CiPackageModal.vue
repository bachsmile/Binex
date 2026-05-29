<script setup lang="ts">
import { usePayApi } from '~/api/pay'
import { useWalletApi } from '~/api/wallet'
import { useOrderApi } from '~/api/order'
import mascotLogin from '/img/mascot_login.png'

const { isOpen, currentStep, selectedPackage, nextStep, prevStep, close } = usePackageModal();
const payApi = usePayApi();
const walletApi = useWalletApi();
const orderApi = useOrderApi();
const { user, hasWallet, openCreateWalletModal, openDepositModal } = useUser();

const selectedMethod = ref('binex');
const isProcessing = ref(false);
const isSuccess = ref(true);
const orderCode = ref('');
const walletData = ref<any>(null);
const isFetchingWallet = ref(false);
const showConfirmPayment = ref(false);

const isEnoughBalance = computed(() => {
  if (!walletData.value || !invoice.value) return false;
  return (walletData.value.balance?.VND || 0) >= (invoice.value.total || 0);
});

const fetchWallet = async () => {
  if (!hasWallet.value) return;
  isFetchingWallet.value = true;
  const res = await walletApi.findMine();
  
  if (res.status && res.data) {
    walletData.value = Array.isArray(res.data) ? res.data[0] : res.data;
  }
  isFetchingWallet.value = false;
};

// Debug & Auto-fetch
watch(isOpen, (val) => {
  if (val) {
    console.log('[PackageModal] Opened with package:', selectedPackage.value?.name);
    if (selectedMethod.value === 'binex' && hasWallet.value) {
      fetchWallet();
    }
  } else {
    showConfirmPayment.value = false;
  }
});

watch(selectedMethod, (val) => {
  if (val === 'binex' && hasWallet.value && !walletData.value) {
    fetchWallet();
  }
});

// Giả lập tính toán hóa đơn dựa trên dữ liệu thật của gói
const invoice = computed(() => {
  if (!selectedPackage.value) return null;
  const price = selectedPackage.value.price || 0;
  const sale = selectedPackage.value.sale || 0;
  const discount = price * (sale / 100);
  const priceAfterSale = price - discount;
  const tax = priceAfterSale * 0.1; // 10% VAT trên giá đã giảm
  const total = priceAfterSale + tax;

  return { price, sale, discount, tax, total };
});

const paymentMethods = [
  { id: 'binex', name: 'Ví Binex (Khuyên dùng)', icon: 'ph:sketch-logo-bold', color: '#CCFF00' },
  { id: 'bank', name: 'Chuyển khoản ngân hàng', icon: 'ph:bank-bold' },
  { id: 'momo', name: 'Ví điện tử MoMo', icon: 'ph:wallet-bold' },
  { id: 'visa', name: 'Thẻ Quốc tế (Visa/Master)', icon: 'ph:credit-card-bold' }
];

const handlePayment = async () => {
  if (!selectedPackage.value) return;

  // Kiểm tra ví nếu dùng phương thức Ví Binex
  if (selectedMethod.value === 'binex') {
    if (!hasWallet.value) {
      openCreateWalletModal();
      return;
    }
    
    if (isEnoughBalance.value) {
      // Mở giao diện xác nhận thanh toán chứ không phải nạp tiền
      showConfirmPayment.value = true;
      return;
    }
  }
  
  isProcessing.value = true;
  
  try {
    // Thay vì gọi API trực tiếp, chúng ta mở Modal nạp tiền chuyên nghiệp
    // Hệ thống sẽ tự động map packageId, serviceId và amount
    openDepositModal({
      packageId: selectedPackage.value.id,
      serviceId: selectedPackage.value.serviceId || 'SER_001',
      amount: invoice.value?.total || 0
    });
    
    // Đóng modal gói hiện tại sau khi đã chuyển sang luồng nạp tiền
    close();
  } catch (err) {
    console.error('Lỗi thanh toán:', err);
    isSuccess.value = false;
  } finally {
    isProcessing.value = false;
    // Không tự động gọi nextStep() ở đây vì đã chuyển sang Modal nạp tiền
  }
};

const confirmWalletPayment = async () => {
  if (!selectedPackage.value || !walletData.value) return;
  
  isProcessing.value = true;
  
  try {
    // Gọi API pay package trực tiếp từ backend
    const res = await payApi.payWalletPackage({
      packageId: selectedPackage.value.id,
      serviceId: selectedPackage.value.serviceId || 'SER_001',
      amount: invoice.value?.total || 0,
      fromAddress: walletData.value.address,
    });

    if (res && res.status && res.data) {
      // Thành công: Sử dụng ID payment-request làm mã đơn hàng để hiển thị
      orderCode.value = res.data.paymentRequest?.id || res.data.transactionId || `TX_${Date.now().toString(36).toUpperCase()}`;
      
      isSuccess.value = true;
      showConfirmPayment.value = false;
      
      // Chuyển sang bước 4 hoàn tất thành công
      currentStep.value = 4;
    } else {
      throw new Error(res?.message || 'Giao dịch thanh toán bằng ví thất bại.');
    }
  } catch (err: any) {
    console.error('Lỗi thanh toán bằng ví:', err);

    isSuccess.value = false;
    showConfirmPayment.value = false;
    currentStep.value = 4; // Vẫn chuyển qua bước 4 để hiển thị trạng thái thất bại
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="package-fade">
      <div v-if="isOpen && selectedPackage" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/90 backdrop-blur-xl" @click="close"></div>

        <!-- Modal Content -->
        <div class="relative w-full max-w-5xl max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] flex flex-col md:flex-row animate-modal-in">
          
          <!-- LEFT SIDE: Mascot & Progress -->
          <div class="relative w-full md:w-5/12 bg-zinc-900/50 flex flex-col items-center justify-center p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5 overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#CCFF00]/5 to-transparent"></div>
            
            <div class="relative z-10 w-full flex flex-col items-center text-center">
              <div class="mb-6 animate-float">
                <img :src="mascotLogin" class="w-48 md:w-64 h-auto drop-shadow-[0_20px_50px_rgba(204,255,0,0.2)]" />
              </div>
              
              <div class="flex items-center gap-3 mb-6">
                <div v-for="s in 4" :key="s" 
                     class="w-10 h-1 rounded-full transition-all duration-500"
                     :class="s <= currentStep ? 'bg-[#CCFF00] shadow-[0_0_15px_#CCFF00]' : 'bg-white/10'">
                </div>
              </div>

              <h3 class="text-xl font-black uppercase tracking-tighter text-white mb-2">
                {{ 
                  currentStep === 1 ? 'Thông tin gói' : 
                  currentStep === 2 ? 'Chi tiết hóa đơn' : 
                  currentStep === 3 ? 'Thanh toán' : 'Hoàn tất' 
                }}
              </h3>
              <p class="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Binex Payment Gateway</p>
            </div>
          </div>

          <!-- RIGHT SIDE: Step Content -->
          <div class="relative w-full md:w-7/12 p-8 md:p-12 flex flex-col overflow-y-auto">
            <button @click="close" class="absolute top-6 right-6 text-white/20 hover:text-white transition-colors z-50">
              <Icon name="ph:x-bold" size="20" />
            </button>

            <!-- STEP 1: Features Review -->
            <div v-if="currentStep === 1" class="flex-1 flex flex-col">
              <div class="mb-8">
                <h2 class="text-3xl font-black uppercase tracking-tighter text-[#CCFF00] mb-2">{{ selectedPackage.name }}</h2>
                <p class="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Quyền lợi bạn sẽ nhận được</p>
              </div>

              <div class="grid grid-cols-1 gap-4 mb-8">
                <div class="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-[#CCFF00]/10 flex items-center justify-center text-[#CCFF00]">
                    <Icon name="ph:database-bold" size="24" />
                  </div>
                  <div>
                    <h4 class="text-white font-bold text-sm uppercase tracking-tight">Dung lượng lưu trữ</h4>
                    <p class="text-white/30 text-[10px] uppercase tracking-wider">{{ selectedPackage.storageLimit > 0 ? selectedPackage.storageLimit + ' MB' : 'Không giới hạn' }} lưu trữ dữ liệu an toàn</p>
                  </div>
                </div>
                <div class="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-[#CCFF00]/10 flex items-center justify-center text-[#CCFF00]">
                    <Icon name="ph:calendar-bold" size="24" />
                  </div>
                  <div>
                    <h4 class="text-white font-bold text-sm uppercase tracking-tight">Thời hạn sử dụng</h4>
                    <p class="text-white/30 text-[10px] uppercase tracking-wider">Hiệu lực trong vòng {{ selectedPackage.expire }} ngày kể từ khi kích hoạt</p>
                  </div>
                </div>
                <div v-if="selectedPackage.isGroup" class="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-[#CCFF00]/10 flex items-center justify-center text-[#CCFF00]">
                    <Icon name="ph:users-four-bold" size="24" />
                  </div>
                  <div>
                    <h4 class="text-white font-bold text-sm uppercase tracking-tight">Quản lý nhóm</h4>
                    <p class="text-white/30 text-[10px] uppercase tracking-wider">Hỗ trợ tối đa {{ selectedPackage.amountGroup }} thành viên tham gia</p>
                  </div>
                </div>
              </div>

              <button @click="nextStep" class="mt-auto w-full py-4 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                Xác nhận thông tin
              </button>
            </div>

            <!-- STEP 2: Invoice Summary -->
            <div v-if="currentStep === 2" class="flex-1 flex flex-col">
              <div class="mb-8">
                <h2 class="text-3xl font-black uppercase tracking-tighter text-white mb-2">Hóa đơn thanh toán</h2>
                <p class="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Thông tin chi phí đơn hàng</p>
              </div>

              <div class="space-y-4 p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] mb-8">
                <div class="flex justify-between items-center text-white/40 text-xs font-bold uppercase tracking-widest">
                  <span>Đơn giá gói:</span>
                  <span class="text-white font-black">{{ invoice?.price.toLocaleString() }}đ</span>
                </div>
                <div class="flex justify-between items-center text-white/40 text-xs font-bold uppercase tracking-widest">
                  <span>Chiết khấu hệ thống <span v-if="invoice?.sale" class="text-green-500">({{ invoice.sale }}%)</span>:</span>
                  <span class="text-green-500 font-black">-{{ invoice?.discount.toLocaleString() }}đ</span>
                </div>
                <div class="flex justify-between items-center text-white/40 text-xs font-bold uppercase tracking-widest">
                  <span>Thuế & Phí (10%):</span>
                  <span class="text-white font-black">{{ invoice?.tax.toLocaleString() }}đ</span>
                </div>
                <div class="h-px bg-white/10 my-4"></div>
                <div class="flex justify-between items-end">
                  <div>
                    <p class="text-white/20 text-[8px] font-black uppercase tracking-[0.3em] mb-1">Tổng cộng cần thanh toán</p>
                    <span class="text-[#CCFF00] text-sm font-black uppercase tracking-tighter">Số tiền cuối cùng:</span>
                  </div>
                  <span class="text-[#CCFF00] text-3xl font-black">{{ invoice?.total.toLocaleString() }}đ</span>
                </div>
              </div>

              <div class="flex gap-4 mt-auto">
                <button @click="prevStep" class="flex-1 py-4 border border-white/10 text-white/40 font-black uppercase tracking-widest text-[10px] rounded-xl hover:text-white transition-all">Quay lại</button>
                <button @click="nextStep" class="flex-[2] py-4 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">Xác nhận thông tin thanh toán</button>
              </div>
            </div>

            <!-- STEP 3: Payment Method Selection -->
            <div v-if="currentStep === 3" class="flex-1 flex flex-col">
              <template v-if="!showConfirmPayment">
                <div class="mb-8">
                  <h2 class="text-3xl font-black uppercase tracking-tighter text-white mb-2">Thanh toán</h2>
                  <p class="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Chọn phương thức thanh toán của bạn</p>
                </div>

                <div class="space-y-3 mb-8">
                  <button v-for="m in paymentMethods" :key="m.id"
                          @click="selectedMethod = m.id"
                          class="w-full p-5 rounded-2xl border transition-all flex items-center justify-between group"
                          :class="selectedMethod === m.id ? 'bg-[#CCFF00]/10 border-[#CCFF00]' : 'bg-white/[0.03] border-white/5 hover:border-white/10'">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors"
                           :class="selectedMethod === m.id ? 'bg-[#CCFF00] text-black' : 'bg-white/5 text-white/40 group-hover:text-white'">
                        <Icon :name="m.icon" />
                      </div>
                      <div class="text-left">
                        <div class="flex items-center gap-2">
                          <h4 class="text-white font-bold text-sm uppercase tracking-tight">{{ m.name }}</h4>
                          <span v-if="m.id === 'binex'" class="px-2 py-0.5 bg-[#CCFF00] text-black text-[7px] font-black rounded-full animate-pulse">VIP</span>
                        </div>
                        
                        <!-- Wallet Balance Display -->
                        <div v-if="m.id === 'binex' && walletData" class="mt-1">
                          <p class="text-[10px] font-black uppercase tracking-widest transition-colors"
                             :class="(walletData.balance?.VND || 0) < (invoice?.total || 0) ? 'text-red-500' : 'text-[#CCFF00]'">
                            Số dư: {{ (walletData.balance?.VND || 0).toLocaleString() }}đ
                            <span v-if="(walletData.balance?.VND || 0) < (invoice?.total || 0)" class="ml-2">(Không đủ số dư)</span>
                          </p>
                        </div>
                        <p v-else class="text-white/20 text-[9px] uppercase tracking-widest">Giao dịch an toàn & bảo mật</p>
                      </div>
                    </div>
                    <div v-if="selectedMethod === m.id" class="w-6 h-6 rounded-full bg-[#CCFF00] flex items-center justify-center">
                      <Icon name="ph:check-bold" class="text-black" />
                    </div>
                  </button>
                </div>

                <button @click="handlePayment" 
                        :disabled="isProcessing"
                        class="mt-auto w-full py-4 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Icon v-if="isProcessing" name="ph:circle-notch-bold" class="animate-spin text-xl" />
                  {{ isProcessing ? 'Đang xử lý giao dịch...' : 'Thanh toán ngay' }}
                </button>
              </template>

              <template v-else>
                <div class="mb-8">
                  <h2 class="text-3xl font-black uppercase tracking-tighter text-white mb-2">Xác nhận thanh toán</h2>
                  <p class="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Vui lòng kiểm tra thông tin ví Binex trước khi xác nhận</p>
                </div>

                <div class="space-y-4 mb-8">
                  <!-- Package Info Card -->
                  <div class="p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                    <span class="text-white/20 text-[8px] font-black uppercase tracking-[0.3em]">Gói dịch vụ</span>
                    <h3 class="text-[#CCFF00] text-xl font-black uppercase tracking-tighter mt-1">{{ selectedPackage.name }}</h3>
                    <p class="text-white/40 text-[10px] uppercase tracking-widest mt-1">Thời hạn: {{ selectedPackage.expire }} ngày</p>
                  </div>

                  <!-- Wallet & Cost breakdown -->
                  <div class="p-6 bg-white/[0.03] border border-white/5 rounded-3xl space-y-4">
                    <div class="flex justify-between items-center text-white/40 text-xs font-bold uppercase tracking-widest">
                      <span>Ví thanh toán:</span>
                      <span class="text-white font-black">{{ walletData?.address?.slice(0, 8) }}...{{ walletData?.address?.slice(-8) }}</span>
                    </div>
                    <div class="flex justify-between items-center text-white/40 text-xs font-bold uppercase tracking-widest">
                      <span>Số dư hiện tại:</span>
                      <span class="text-[#CCFF00] font-black">{{ (walletData?.balance?.VND || 0).toLocaleString() }}đ</span>
                    </div>
                    <div class="flex justify-between items-center text-white/40 text-xs font-bold uppercase tracking-widest">
                      <span>Tổng thanh toán:</span>
                      <span class="text-red-500 font-black">-{{ (invoice?.total || 0).toLocaleString() }}đ</span>
                    </div>
                    <div class="h-px bg-white/10 my-2"></div>
                    <div class="flex justify-between items-center">
                      <span class="text-white/40 text-xs font-bold uppercase tracking-widest">Số dư còn lại:</span>
                      <span class="text-green-500 font-black text-lg">
                        {{ ((walletData?.balance?.VND || 0) - (invoice?.total || 0)).toLocaleString() }}đ
                      </span>
                    </div>
                  </div>
                </div>

                <div class="flex gap-4 mt-auto">
                  <button @click="showConfirmPayment = false" 
                          :disabled="isProcessing"
                          class="flex-1 py-4 border border-white/10 text-white/40 font-black uppercase tracking-widest text-[10px] rounded-xl hover:text-white transition-all">
                    Quay lại
                  </button>
                  <button @click="confirmWalletPayment" 
                          :disabled="isProcessing"
                          class="flex-[2] py-4 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all">
                    <Icon v-if="isProcessing" name="ph:circle-notch-bold" class="animate-spin text-xl" />
                    {{ isProcessing ? 'Đang thực hiện giao dịch...' : 'Xác nhận thanh toán' }}
                  </button>
                </div>
              </template>
            </div>

            <!-- STEP 4: Success/Failure Status -->
            <div v-if="currentStep === 4" class="flex-1 flex flex-col items-center justify-center text-center">
              <div class="mb-10 p-10 rounded-full relative" :class="isSuccess ? 'bg-[#CCFF00]/10' : 'bg-red-500/10'">
                <div class="absolute inset-0 bg-inherit blur-2xl rounded-full animate-pulse"></div>
                <Icon :name="isSuccess ? 'ph:sparkles-fill' : 'ph:warning-circle-fill'" 
                      class="text-7xl relative z-10" 
                      :class="isSuccess ? 'text-[#CCFF00]' : 'text-red-500'" />
              </div>

              <h2 class="text-4xl font-black uppercase tracking-tighter text-white mb-6">
                {{ isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại' }}
              </h2>

              <div v-if="isSuccess" class="space-y-6">
                <div class="space-y-3">
                  <p class="text-white/80 text-xs font-bold uppercase tracking-widest leading-relaxed">
                    Hệ thống Binex xin chân thành cám ơn bạn!
                  </p>
                  <p class="text-white/40 text-[10px] uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
                    Gói dịch vụ đã được kích hoạt. Hãy theo dõi đơn hàng của bạn ở thông tin đơn hàng của bạn.
                  </p>
                </div>
                
                <div class="p-6 bg-white/[0.03] border border-white/5 rounded-3xl inline-block">
                  <p class="text-white/20 text-[8px] font-black uppercase tracking-[0.3em] mb-2">Order Tracking ID</p>
                  <p class="text-[#CCFF00] text-lg font-black tracking-[0.3em]">{{ orderCode }}</p>
                </div>
              </div>

              <div v-else class="space-y-4">
                <p class="text-red-500/60 text-xs leading-relaxed max-w-sm font-bold uppercase tracking-widest">
                  Đơn hàng không hoàn tất và xin lỗi vì sự bất tiện này. Vui lòng kiểm tra lại phương thức thanh toán.
                </p>
              </div>

              <button @click="close" class="mt-12 w-full py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/10 transition-all">
                Đóng cửa sổ thanh toán
              </button>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.package-fade-enter-active, .package-fade-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.package-fade-enter-from, .package-fade-leave-to { opacity: 0; transform: scale(1.05); }

@keyframes modal-in {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-modal-in { animation: modal-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
}
.animate-float { animation: float 6s ease-in-out infinite; }
</style>
