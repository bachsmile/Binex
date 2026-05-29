<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { MethodPay } from '~/types/method-pay';
import type { Wallet } from '~/types/wallet';

type WalletTab = 'wallet' | 'banking';
type WalletOperation = 'deposit' | 'withdraw';

const walletApi = useWalletApi();
const methodPayApi = useMethodPayApi();
const roleCookie = useCookie<string | null>('user_role');

const isOpen = ref(false);
const activeTab = ref<WalletTab>('wallet');
const loading = ref(false);
const operationOpen = ref(false);
const operationMode = ref<WalletOperation>('deposit');
const operationLoading = ref(false);
const operationError = ref('');

const myWallets = ref<Wallet[]>([]);
const systemWallets = ref<Wallet[]>([]);
const adminWallets = ref<Wallet[]>([]);
const bankingMethods = ref<MethodPay[]>([]);
const systemBankingMethods = ref<MethodPay[]>([]);

const operationForm = ref({
  walletAddress: '',
  adminAddress: '',
  methodPayId: '',
  amount: 0,
  currency: 'VND' as 'VND' | 'USD',
  description: '',
});

const isSuperAdmin = computed(() => roleCookie.value === 'sp-ad');

const totalBalanceVND = computed(() =>
  myWallets.value.reduce((total, wallet) => total + Number(wallet.balance?.VND || 0), 0),
);

const totalBalanceUSD = computed(() =>
  myWallets.value.reduce((total, wallet) => total + Number(wallet.balance?.USD || 0), 0),
);

const availableTargetWallets = computed(() =>
  systemWallets.value.length > 0 ? systemWallets.value : myWallets.value,
);

const formatMoney = (amount: number, currency: string) => {
  const formatted = Number(amount || 0).toLocaleString('vi-VN');
  return currency === 'USD' ? `$${formatted}` : `${formatted} ₫`;
};

const walletLabel = (wallet: Wallet) => {
  const owner = wallet.user?.userName ? ` • ${wallet.user.userName}` : '';
  return `${wallet.name || 'Ví'}${owner} • ${wallet.address}`;
};

const bankLabel = (bank: MethodPay) => {
  const bankName = bank.bankName || bank.name || 'Ngân hàng';
  const bankNumber = bank.bankNumber || bank.cardNumber || bank.code || '';
  return bankNumber ? `${bankName} • ${bankNumber}` : bankName;
};

const copyText = async (value: string, message = 'Đã sao chép') => {
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    ElMessage.success(message);
  } catch {
    ElMessage.warning('Không thể sao chép tự động, vui lòng copy thủ công.');
  }
};

const fetchWallets = async () => {
  const response = await walletApi.findMine({ limit: 100 });
  myWallets.value = response?.status ? response.data || [] : [];
};

const fetchBankingMethods = async () => {
  const response = await methodPayApi.findMine();
  bankingMethods.value = response?.status ? response.data || [] : [];
};

const fetchAdminData = async () => {
  if (!isSuperAdmin.value) return;

  const [walletsResponse, adminWalletsResponse, systemBanksResponse] = await Promise.all([
    walletApi.findAll({ limit: 200 }),
    walletApi.findAdmin({ limit: 100 }),
    methodPayApi.findSystem(),
  ]);

  systemWallets.value = walletsResponse?.status ? walletsResponse.data || [] : [];
  adminWallets.value = adminWalletsResponse?.status ? adminWalletsResponse.data || [] : [];
  systemBankingMethods.value = systemBanksResponse?.status ? systemBanksResponse.data || [] : [];

  if (systemBankingMethods.value.length === 0) {
    const allBanksResponse = await methodPayApi.findAll();
    systemBankingMethods.value = allBanksResponse?.status ? allBanksResponse.data || [] : [];
  }
};

const loadModalData = async () => {
  loading.value = true;
  try {
    await Promise.all([fetchWallets(), fetchBankingMethods(), fetchAdminData()]);
  } catch (error) {
    console.error('Failed to load navbar wallet data:', error);
    ElMessage.error('Không thể tải thông tin ví.');
  } finally {
    loading.value = false;
  }
};

const openModal = async () => {
  isOpen.value = true;
  activeTab.value = 'wallet';
  await loadModalData();
};

const openOperation = (mode: WalletOperation) => {
  operationMode.value = mode;
  operationError.value = '';
  operationForm.value = {
    walletAddress: availableTargetWallets.value[0]?.address || '',
    adminAddress: adminWallets.value[0]?.address || '',
    methodPayId: systemBankingMethods.value[0]?.id || '',
    amount: 0,
    currency: 'VND',
    description: '',
  };
  operationOpen.value = true;
};

const validateOperation = () => {
  if (!operationForm.value.walletAddress) {
    return 'Vui lòng chọn ví trong hệ thống.';
  }
  if (!operationForm.value.amount || operationForm.value.amount <= 0) {
    return 'Vui lòng nhập số tiền lớn hơn 0.';
  }
  if (operationMode.value === 'deposit' && !operationForm.value.methodPayId) {
    return 'Vui lòng chọn ngân hàng.';
  }
  if (operationMode.value === 'withdraw' && !operationForm.value.adminAddress) {
    return 'Vui lòng chọn ví admin nhận tiền.';
  }
  return '';
};

const submitOperation = async () => {
  const validationMessage = validateOperation();
  if (validationMessage) {
    operationError.value = validationMessage;
    return;
  }

  operationLoading.value = true;
  operationError.value = '';

  try {
    const amount = Number(operationForm.value.amount);
    const response =
      operationMode.value === 'deposit'
        ? await walletApi.deposit({
            address: operationForm.value.walletAddress,
            amount,
            currency: operationForm.value.currency,
            methodPayId: operationForm.value.methodPayId,
            description: operationForm.value.description || undefined,
          })
        : await walletApi.transfer({
            from: operationForm.value.walletAddress,
            to: operationForm.value.adminAddress,
            amount,
            currency: operationForm.value.currency,
          });

    if (response?.status) {
      ElMessage.success(operationMode.value === 'deposit' ? 'Nạp tiền thành công.' : 'Rút tiền thành công.');
      operationOpen.value = false;
      await loadModalData();
      return;
    }

    operationError.value = response?.message || 'Không thể thực hiện giao dịch.';
  } catch (error: any) {
    operationError.value = error?.message || 'Có lỗi hệ thống xảy ra.';
  } finally {
    operationLoading.value = false;
  }
};
</script>

<template>
  <div>
    <button
      class="w-9 h-9 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 flex items-center justify-center text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
      title="Ví"
      type="button"
      @click="openModal"
    >
      <Icon name="heroicons:wallet" class="text-lg shrink-0" />
    </button>

    <ClientOnly>
      <Teleport to="body">
    <CmDialog v-model:isOpen="isOpen" title="Ví tài khoản" size="lg">
      <div class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="inline-flex rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-1">
            <button
              class="px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              :class="activeTab === 'wallet' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'"
              type="button"
              @click="activeTab = 'wallet'"
            >
              Thông tin ví
            </button>
            <button
              class="px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              :class="activeTab === 'banking' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'"
              type="button"
              @click="activeTab = 'banking'"
            >
              Ngân hàng
            </button>
          </div>

          <div v-if="isSuperAdmin" class="flex items-center gap-2">
            <CmButton size="sm" icon="heroicons:arrow-down-tray" class="text-xs" @click="openOperation('deposit')">
              Nạp
            </CmButton>
            <CmButton size="sm" variant="outline" icon="heroicons:arrow-up-tray" class="text-xs" @click="openOperation('withdraw')">
              Rút
            </CmButton>
          </div>
        </div>

        <div v-if="loading" class="py-12 text-center text-sm font-semibold text-zinc-400">
          Đang tải thông tin ví...
        </div>

        <div v-else-if="activeTab === 'wallet'" class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="rounded-3xl border border-zinc-150 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900/60 p-5">
              <p class="text-[10px] uppercase tracking-wider font-black text-zinc-400">Tổng VND</p>
              <p class="mt-2 text-2xl font-black text-zinc-900 dark:text-white">{{ formatMoney(totalBalanceVND, 'VND') }}</p>
            </div>
            <div class="rounded-3xl border border-zinc-150 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900/60 p-5">
              <p class="text-[10px] uppercase tracking-wider font-black text-zinc-400">Tổng USD</p>
              <p class="mt-2 text-2xl font-black text-zinc-900 dark:text-white">{{ formatMoney(totalBalanceUSD, 'USD') }}</p>
            </div>
          </div>

          <div v-if="myWallets.length === 0" class="rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-10 text-center">
            <Icon name="heroicons:wallet" class="text-4xl text-zinc-300 mx-auto mb-3" />
            <p class="text-sm font-bold text-zinc-600 dark:text-zinc-300">Chưa có ví</p>
            <p class="text-xs text-zinc-400 mt-1">Tạo ví trong tab ví tài khoản của người dùng.</p>
          </div>

          <div v-else class="grid grid-cols-1 gap-4">
            <div
              v-for="wallet in myWallets"
              :key="wallet.id"
              class="rounded-3xl border border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-950 p-5 shadow-sm"
            >
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="text-sm font-black text-zinc-900 dark:text-white">{{ wallet.name || 'Ví' }}</p>
                    <span v-if="wallet.isAdminWallet" class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black">ADMIN</span>
                    <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black">{{ wallet.status || 'active' }}</span>
                  </div>
                  <div class="mt-3 flex items-center gap-2">
                    <p class="font-mono text-xs text-zinc-500 dark:text-zinc-400 break-all">{{ wallet.address }}</p>
                    <button
                      class="w-8 h-8 rounded-lg border border-zinc-150 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-primary shrink-0"
                      type="button"
                      @click="copyText(wallet.address, 'Đã sao chép địa chỉ ví')"
                    >
                      <Icon name="heroicons:clipboard-document" class="text-base shrink-0" />
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3 sm:min-w-52">
                  <div class="rounded-2xl bg-zinc-50 dark:bg-zinc-900 p-3">
                    <p class="text-[10px] font-black text-zinc-400">VND</p>
                    <p class="text-sm font-black text-zinc-900 dark:text-white">{{ formatMoney(wallet.balance?.VND || 0, 'VND') }}</p>
                  </div>
                  <div class="rounded-2xl bg-zinc-50 dark:bg-zinc-900 p-3">
                    <p class="text-[10px] font-black text-zinc-400">USD</p>
                    <p class="text-sm font-black text-zinc-900 dark:text-white">{{ formatMoney(wallet.balance?.USD || 0, 'USD') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div v-if="bankingMethods.length === 0" class="rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-10 text-center">
            <Icon name="heroicons:building-library" class="text-4xl text-zinc-300 mx-auto mb-3" />
            <p class="text-sm font-bold text-zinc-600 dark:text-zinc-300">Chưa có thông tin banking</p>
          </div>

          <template v-else>
            <div
              v-for="bank in bankingMethods"
              :key="bank.id"
              class="rounded-3xl border border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-950 p-5"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-black text-zinc-900 dark:text-white">{{ bank.name || bank.bankName }}</p>
                  <p class="mt-1 text-xs text-zinc-400">{{ bank.bankName }} • {{ bank.accountHolderName }}</p>
                </div>
                <span class="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-[10px] font-black text-zinc-500 uppercase">{{ bank.status }}</span>
              </div>
              <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div class="rounded-2xl bg-zinc-50 dark:bg-zinc-900 p-3">
                  <p class="text-[10px] font-black uppercase text-zinc-400">Số tài khoản</p>
                  <p class="mt-1 font-bold text-zinc-800 dark:text-zinc-100">{{ bank.bankNumber || bank.cardNumber || 'N/A' }}</p>
                </div>
                <div class="rounded-2xl bg-zinc-50 dark:bg-zinc-900 p-3">
                  <p class="text-[10px] font-black uppercase text-zinc-400">Mã ngân hàng</p>
                  <p class="mt-1 font-bold text-zinc-800 dark:text-zinc-100">{{ bank.code || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <template #footer>
        <CmButton variant="ghost" size="sm" class="text-xs font-semibold px-4" @click="isOpen = false">
          Đóng
        </CmButton>
      </template>
    </CmDialog>

    <CmDialog
      v-model:isOpen="operationOpen"
      :title="operationMode === 'deposit' ? 'Nạp tiền vào ví' : 'Rút tiền từ ví'"
      size="md"
    >
      <div class="space-y-4">
        <div v-if="operationError" class="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 text-xs font-bold text-red-500">
          {{ operationError }}
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400">Ví trong hệ thống</label>
          <select
            v-model="operationForm.walletAddress"
            class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-primary/50"
          >
            <option value="" disabled>Chọn ví</option>
            <option v-for="wallet in availableTargetWallets" :key="wallet.id" :value="wallet.address">
              {{ walletLabel(wallet) }}
            </option>
          </select>
        </div>

        <div v-if="operationMode === 'deposit'" class="space-y-1.5">
          <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400"> Ngân hàng</label>
          <select
            v-model="operationForm.methodPayId"
            class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-primary/50"
          >
            <option value="" disabled>Chọn ngân hàng</option>
            <option v-for="bank in systemBankingMethods" :key="bank.id" :value="bank.id">
              {{ bankLabel(bank) }}
            </option>
          </select>
        </div>

        <div v-else class="space-y-1.5">
          <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400"> Ví admin nhận tiền</label>
          <select
            v-model="operationForm.adminAddress"
            class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-primary/50"
          >
            <option value="" disabled>Chọn ví admin</option>
            <option v-for="wallet in adminWallets" :key="wallet.id" :value="wallet.address">
              {{ walletLabel(wallet) }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400"> Số tiền</label>
            <input
              v-model.number="operationForm.amount"
              min="0"
              type="number"
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-primary/50"
              placeholder="0"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400"> Loại tiền</label>
            <select
              v-model="operationForm.currency"
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-primary/50"
            >
              <option value="VND">VND</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div v-if="operationMode === 'deposit'" class="space-y-1.5">
          <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400"> Mô tả</label>
          <textarea
            v-model="operationForm.description"
            rows="3"
            class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-primary/50"
            placeholder="Nhập mô tả giao dịch nạp tiền"
          ></textarea>
        </div>
      </div>

      <template #footer>
        <CmButton variant="ghost" size="sm" class="text-xs font-semibold px-4" @click="operationOpen = false">
          Hủy
        </CmButton>
        <CmButton size="sm" class="text-xs font-bold px-5" :loading="operationLoading" @click="submitOperation">
          {{ operationMode === 'deposit' ? 'Nạp tiền' : 'Rút tiền' }}
        </CmButton>
      </template>
    </CmDialog>
      </Teleport>
    </ClientOnly>
  </div>
</template>

