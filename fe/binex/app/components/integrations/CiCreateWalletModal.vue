<script setup lang="ts">
import { ref } from 'vue';
import { useWalletApi } from '~/api/wallet';
import { useUserApi } from '~/api/user';
import { useUser } from '~/composables/useUser';
import mascotLogin from '/img/mascot_login.png';

const isOpen = useState('create-wallet-modal-open', () => false);
const walletApi = useWalletApi();
const { user, openDepositModal, hasWallet } = useUser();

// State management
const currentStep = ref(1);
const isProcessing = ref(false);
const errorMessage = ref('');

// Data states
const generatedPrivateKey = ref('');
const inputPrivateKey = ref('');
const generatedPublicKey = ref('');
const createdWallet = ref<any>(null);

const close = () => {
  isOpen.value = false;
  // Reset state after a short delay
  setTimeout(() => {
    currentStep.value = 1;
    generatedPrivateKey.value = '';
    inputPrivateKey.value = '';
    generatedPublicKey.value = '';
    errorMessage.value = '';
    createdWallet.value = null;
  }, 500);
};

// Step 1 -> 2: Khởi tạo Key
const handleGenerateKey = async () => {
  isProcessing.value = true;
  errorMessage.value = '';
  try {
    const res = await walletApi.createKey();
    if (res?.data) {
      // Chỉ lấy chuỗi privateKey bên trong object
      generatedPrivateKey.value = typeof res.data === 'object' ? res.data.privateKey : res.data;
      currentStep.value = 2;
    }
  } catch (err) {
    errorMessage.value = 'Không thể khởi tạo mã. Vui lòng thử lại.';
  } finally {
    isProcessing.value = false;
  }
};

// Step 2 -> 3: Chuyển sang màn hình xác thực
const goToVerify = () => {
  currentStep.value = 3;
};

// Step 3 -> 4: Xác thực & Tạo ví
const handleVerifyAndCreate = async () => {
  if (inputPrivateKey.value !== generatedPrivateKey.value) {
    errorMessage.value = 'Mã Private Key không khớp. Vui lòng kiểm tra lại.';
    return;
  }

  isProcessing.value = true;
  errorMessage.value = '';
  
  try {
    // 1. Validate Private Key để lấy Public Key
    const validateRes = await walletApi.validatePrivateKey(inputPrivateKey.value); 
    if (validateRes?.data) {
      // Bóc tách publicKey nếu nó nằm trong object { publicKey: '...' }
      generatedPublicKey.value = typeof validateRes.data === 'object' ? validateRes.data.publicKey : validateRes.data;

      // 2. Gọi POST /wallet để tạo ví chính thức
      const createRes = await walletApi.create({
        name: `Ví Binex ${user.value?.userName}`,
        type: 'PERSONAL',
        privateKey: generatedPrivateKey.value,
        publicKey: generatedPublicKey.value,
        pin: '123456',
        userId: user.value?.id || ''
      });

      if (createRes?.data) {
        // Cập nhật store cục bộ để UI nhận diện đã có ví ngay lập tức
        hasWallet.value = true;

        createdWallet.value = createRes.data;
        currentStep.value = 4;
      }
    }
  } catch (err) {
    errorMessage.value = 'Xác thực thất bại. Vui lòng đảm bảo mã chính xác.';
  } finally {
    isProcessing.value = false;
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
</script>

<template>
  <Teleport to="body">
    <Transition name="wallet-fade">
      <div v-if="isOpen" class="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6">
        <div class="absolute inset-0 bg-black/95 backdrop-blur-2xl" @click="close"></div>

        <div class="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] animate-modal-in">
          
          <!-- Header Progress -->
          <div class="p-8 md:p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-2xl bg-[#CCFF00] flex items-center justify-center text-black">
                <Icon :name="currentStep === 4 ? 'ph:check-bold' : 'ph:wallet-bold'" size="20" />
              </div>
              <div>
                <h3 class="text-white font-black uppercase tracking-tighter text-sm">Khởi tạo Ví Binex</h3>
                <p class="text-white/20 text-[8px] font-bold uppercase tracking-[0.2em]">Step {{ currentStep }} of 4</p>
              </div>
            </div>
            <div class="flex gap-2">
              <div v-for="s in 4" :key="s" 
                   class="w-6 h-1 rounded-full transition-all duration-500"
                   :class="s <= currentStep ? 'bg-[#CCFF00]' : 'bg-white/10'"></div>
            </div>
          </div>

          <div class="p-8 md:p-12">
            <!-- STEP 1: Intro -->
            <div v-if="currentStep === 1" class="text-center">
              <div class="mb-8 animate-float">
                <img :src="mascotLogin" class="w-40 mx-auto drop-shadow-[0_0_30px_rgba(204,255,0,0.3)]" />
              </div>
              <h2 class="text-3xl font-black uppercase tracking-tighter text-white mb-4">An toàn & Bảo mật</h2>
              <p class="text-white/40 text-xs font-medium leading-relaxed mb-10 max-w-sm mx-auto">
                Ví Binex sử dụng công nghệ mã hóa Private Key. Bạn sẽ được cấp một mã định danh duy nhất để quản lý tài sản của mình.
              </p>
              <button @click="handleGenerateKey" :disabled="isProcessing"
                      class="w-full py-4 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                {{ isProcessing ? 'Đang tạo mã...' : 'Khởi tạo mã ngay' }}
              </button>
            </div>

            <!-- STEP 2: Show Private Key -->
            <div v-if="currentStep === 2">
              <div class="mb-6">
                <h2 class="text-2xl font-black uppercase tracking-tighter text-white mb-2">Lưu trữ Private Key</h2>
                <p class="text-red-500/80 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  Cảnh báo: Đừng chia sẻ mã này cho bất kỳ ai. Hãy sao lưu nó ở nơi an toàn.
                </p>
              </div>

              <div class="relative mb-8">
                <div class="w-full p-8 bg-white/[0.03] border border-white/10 rounded-[2rem] font-mono text-[#CCFF00] text-sm break-all leading-relaxed min-h-[120px] flex items-center shadow-inner">
                  {{ generatedPrivateKey }}
                </div>
                <div class="absolute -bottom-4 right-6">
                  <button @click="copyToClipboard(generatedPrivateKey)" 
                          class="flex items-center gap-2 px-4 py-2 bg-[#CCFF00] text-black rounded-xl font-black uppercase text-[9px] tracking-widest shadow-xl hover:scale-110 active:scale-95 transition-all">
                    <Icon name="ph:copy-bold" /> Sao chép mã
                  </button>
                </div>
              </div>

              <button @click="goToVerify"
                      class="w-full py-4 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                Tôi đã sao lưu, tiếp tục xác thực
              </button>
            </div>

            <!-- STEP 3: Verify Private Key -->
            <div v-if="currentStep === 3">
              <div class="mb-8">
                <h2 class="text-2xl font-black uppercase tracking-tighter text-white mb-2">Xác thực ví</h2>
                <p class="text-white/40 text-[10px] font-bold uppercase tracking-widest">Vui lòng nhập lại mã Private Key đã sao lưu</p>
              </div>

              <div class="mb-8">
                <textarea v-model="inputPrivateKey" 
                          placeholder="Dán mã Private Key tại đây..."
                          class="w-full h-32 p-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-mono text-sm focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00] outline-none transition-all resize-none"></textarea>
                <p v-if="errorMessage" class="mt-3 text-red-500 text-[10px] font-bold uppercase tracking-widest">{{ errorMessage }}</p>
              </div>

              <button @click="handleVerifyAndCreate" :disabled="isProcessing"
                      class="w-full py-4 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                {{ isProcessing ? 'Đang xác thực & Tạo ví...' : 'Xác thực & Tạo ví ngay' }}
              </button>
            </div>

            <!-- STEP 4: Success & Info -->
            <div v-if="currentStep === 4" class="text-center">
              <div class="mb-8 relative inline-block">
                <div class="absolute inset-0 bg-[#CCFF00]/20 blur-3xl rounded-full"></div>
                <Icon name="ph:sparkles-fill" class="text-7xl text-[#CCFF00] relative z-10" />
              </div>
              <h2 class="text-3xl font-black uppercase tracking-tighter text-white mb-2">Ví Binex Sẵn Sàng!</h2>
              <p class="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-10">Khởi tạo thành công tài khoản ví cá nhân</p>

              <div class="grid grid-cols-2 gap-4 mb-10">
                <div class="p-5 bg-white/[0.03] border border-white/5 rounded-3xl text-left">
                  <p class="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Số dư VND</p>
                  <p class="text-white font-black text-lg">0đ</p>
                </div>
                <div class="p-5 bg-white/[0.03] border border-white/5 rounded-3xl text-left">
                  <p class="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Số dư USD</p>
                  <p class="text-white font-black text-lg">$0.00</p>
                </div>
              </div>

              <div class="flex gap-4">
                <button @click="openDepositModal(); close();"
                        class="flex-1 py-4 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all">
                  Nạp tiền ngay
                </button>
                <button @click="close"
                        class="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/10 transition-all">
                  Để sau
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.wallet-fade-enter-active, .wallet-fade-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.wallet-fade-enter-from, .wallet-fade-leave-to { opacity: 0; transform: scale(1.1); }

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
