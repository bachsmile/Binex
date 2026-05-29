<script setup lang="ts">
import { usePayApi } from '~/api/pay';
import { useWalletApi } from '~/api/wallet';
import { useUser } from '~/composables/useUser';
import type { Wallet } from '~/types/response/wallet';
import type { PaymentRequest } from '~/types/response/payment-request';

definePageMeta({
  layout: 'default', // Sử dụng layout mặc định có header
  middleware: ['auth'] // Cần middleware để bảo vệ route (nếu đã có middleware auth)
});

const { user, openDepositModal, hasWallet, openCreateWalletModal } = useUser();
const walletApi = useWalletApi();
const payApi = usePayApi();

const walletData = ref<Wallet | null>(null);
const transactions = ref<PaymentRequest[]>([]);
const isFetchingWallet = ref(false);
const isFetchingTx = ref(false);

const fetchWallet = async () => {
  if (!hasWallet.value) return;
  isFetchingWallet.value = true;
  try {
    const res = await walletApi.findMine();
    if (res.status && res.data) {
      walletData.value = Array.isArray(res.data) ? res.data[0] : res.data;
    }
  } catch (error) {
    console.error('Error fetching wallet:', error);
  } finally {
    isFetchingWallet.value = false;
  }
};

const fetchTransactions = async () => {
  isFetchingTx.value = true;
  try {
    const res = await payApi.getPaymentRequests();
    if (res.status && res.data) {
      // Assuming res.data is an array or has a property containing the list
      transactions.value = Array.isArray(res.data) ? res.data : (res.data as any).items || [];
    }
  } catch (error) {
    console.error('Error fetching transactions:', error);
  } finally {
    isFetchingTx.value = false;
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date);
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved': return 'text-green-500 bg-green-500/10 border-green-500/20';
    case 'rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  }
};

const translateStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved': return 'Thành công';
    case 'rejected': return 'Thất bại';
    case 'pending': return 'Đang xử lý';
    default: return status;
  }
};

onMounted(() => {
  if (user.value) {
    if (hasWallet.value) {
      fetchWallet();
    }
    fetchTransactions();
  }
});
</script>

<template>
  <div class="min-h-screen bg-black text-white pt-24 px-6 pb-20">
    <div class="max-w-5xl mx-auto space-y-12">
      <!-- Header -->
      <div class="animate-slide-up">
        <div class="text-[#CCFF00] uppercase tracking-[0.2em] font-bold text-sm mb-4">Dashboard</div>
        <h1 class="text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase">
          Dịch vụ <span class="text-white/40">Tài chính</span>
        </h1>
        <div class="w-16 h-1 bg-[#CCFF00]"></div>
      </div>

      <!-- Wallet Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style="animation-delay: 0.1s;">
        <!-- Card: Wallet Balance -->
        <div class="md:col-span-2 p-8 bg-white/5 border border-white/10 rounded-[2rem] relative overflow-hidden flex flex-col justify-between">
          <div class="absolute top-0 right-0 w-64 h-64 bg-[#CCFF00]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <div>
            <div class="flex items-center justify-between mb-8">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-[#CCFF00]/20 flex items-center justify-center">
                  <Icon name="ph:wallet-bold" class="text-2xl text-[#CCFF00]" />
                </div>
                <span class="font-bold text-lg text-white/80">Số dư Ví Binex</span>
              </div>
              <div v-if="walletData?.address" class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/60">
                {{ walletData.address.substring(0, 6) }}...{{ walletData.address.substring(walletData.address.length - 4) }}
              </div>
            </div>

            <div v-if="!hasWallet" class="py-4">
              <p class="text-white/40 mb-6">Bạn chưa có Ví Binex. Hãy tạo ví để trải nghiệm dịch vụ.</p>
              <button 
                @click="openCreateWalletModal"
                class="px-6 py-3 rounded-xl bg-[#CCFF00] text-black font-bold tracking-wide hover:shadow-lg hover:shadow-[#CCFF00]/20 transition-all active:scale-95"
              >
                Khởi tạo Ví ngay
              </button>
            </div>
            
            <div v-else-if="isFetchingWallet" class="py-4">
              <Icon name="ph:spinner-gap-bold" class="animate-spin text-3xl text-[#CCFF00]" />
            </div>

            <div v-else class="space-y-2">
              <div class="text-5xl font-black tracking-tight flex items-baseline gap-2">
                {{ formatCurrency(walletData?.balance?.VND || 0) }}
              </div>
              <div class="text-white/40 font-medium">
                ~ {{ walletData?.balance?.USDT || 0 }} USDT
              </div>
            </div>
          </div>
        </div>

        <!-- Card: Quick Actions -->
        <div class="p-8 bg-white/5 border border-white/10 rounded-[2rem] flex flex-col gap-4 justify-center">
          <button 
            @click="openDepositModal"
            class="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-[#CCFF00] text-black font-bold hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all active:scale-95 group"
            :disabled="!hasWallet"
            :class="{ 'opacity-50 cursor-not-allowed': !hasWallet }"
          >
            <Icon name="ph:download-simple-bold" class="text-xl group-hover:-translate-y-1 transition-transform" />
            Nạp tiền
          </button>
          
          <button 
            class="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 transition-all active:scale-95 group"
            :disabled="!hasWallet"
            :class="{ 'opacity-50 cursor-not-allowed': !hasWallet }"
          >
            <Icon name="ph:paper-plane-right-bold" class="text-xl group-hover:translate-x-1 transition-transform" />
            Chuyển tiền
          </button>
        </div>
      </div>

      <!-- Transaction History -->
      <div class="animate-slide-up" style="animation-delay: 0.2s;">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
          <Icon name="ph:clock-counter-clockwise-bold" class="text-[#CCFF00]" />
          Lịch sử giao dịch
        </h2>

        <div class="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
          <div v-if="isFetchingTx" class="p-12 flex justify-center">
             <Icon name="ph:spinner-gap-bold" class="animate-spin text-4xl text-[#CCFF00]" />
          </div>
          
          <div v-else-if="!transactions.length" class="p-12 text-center text-white/40">
            <Icon name="ph:receipt-bold" class="text-5xl mb-4 opacity-50 mx-auto" />
            <p>Chưa có giao dịch nào.</p>
          </div>

          <div v-else class="divide-y divide-white/10">
            <div 
              v-for="tx in transactions" 
              :key="tx.id"
              class="p-6 hover:bg-white-[0.02] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Icon 
                    :name="tx.orderType === 'DEPOSIT' ? 'ph:arrow-down-left-bold' : 'ph:arrows-left-right-bold'" 
                    class="text-xl text-white/60"
                  />
                </div>
                <div>
                  <div class="font-bold text-lg mb-1">{{ tx.transactionCode || tx.id }}</div>
                  <div class="text-sm text-white/40">{{ formatDate(tx.createdAt) }} • Phương thức: {{ tx.methodPay?.name || 'Manual' }}</div>
                </div>
              </div>
              
              <div class="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div class="text-right">
                  <div class="font-bold text-lg" :class="tx.status === 'approved' ? 'text-[#CCFF00]' : 'text-white'">
                    +{{ formatCurrency(tx.amount) }}
                  </div>
                </div>
                <div 
                  class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                  :class="getStatusColor(tx.status)"
                >
                  {{ translateStatus(tx.status) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>
