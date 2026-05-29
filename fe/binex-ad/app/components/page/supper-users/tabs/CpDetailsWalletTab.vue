<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { User } from '~/types/user';

type WalletModalMode = 'add' | 'view' | 'edit';
type AddWalletStep = 'start' | 'backup' | 'verify' | 'info';
type WalletTransferMode = 'deposit' | 'withdraw';

const props = defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  (e: 'toast', message: string, type?: 'success' | 'error'): void;
  (e: 'updated'): void; // notify parent if transactions/balance changes
}>();

const userWallets = ref<any[]>([]);
const adminWallets = ref<any[]>([]);
const loading = ref(false);

const walletApi = useWalletApi();

// Modal States
const isWalletModalOpen = ref(false);
const walletModalMode = ref<WalletModalMode>('view');
const walletModalLoading = ref(false);
const walletModalError = ref('');
const selectedWalletId = ref<string | null>(null);

const addWalletStep = ref<AddWalletStep>('start');
const generatedPrivateKey = ref('');
const verifyPrivateKey = ref('');

const isWalletTransferOpen = ref(false);
const walletTransferMode = ref<WalletTransferMode>('deposit');
const walletTransferLoading = ref(false);
const walletTransferError = ref('');
const selectedTransferWallet = ref<any | null>(null);

const walletTransferForm = ref({
  adminAddress: '',
  targetAddress: '',
  amount: 0,
  currency: 'VND' as 'VND' | 'USD',
});

const walletForm = ref({
  name: '',
  address: '',
  type: 'main',
  status: 'active',
  pin: '',
  privateKey: '',
  publicKey: '',
  balanceVND: 0,
  balanceUSD: 0,
});

const getWalletCurrencyEntries = (wallet: any): [string, number][] => {
  const entries = Object.entries(wallet.balance || {}).map(
    ([currency, amount]) => [currency, Number(amount || 0)] as [string, number],
  );
  return entries.length > 0 ? entries : [['VND', 0], ['USD', 0]];
};

const formatWalletAmount = (currency: string, amount: number) => {
  const value = Number(amount || 0).toLocaleString('vi-VN');
  return currency === 'USD' ? `$${value}` : `${value} ₫`;
};

const getWalletBalance = (wallet: any | null, currency: 'VND' | 'USD') =>
  Number(wallet?.balance?.[currency] || 0);

const getWalletByAddress = (address: string) =>
  [...adminWallets.value, ...userWallets.value].find((wallet) => wallet.address === address) || null;

const getWalletLabel = (wallet: any) =>
  `${wallet.name} - ${wallet.address}`;

const copyWalletAddress = async (address: string) => {
  if (!address) return;
  try {
    await navigator.clipboard.writeText(address);
    emit('toast', 'Đã sao chép địa chỉ ví!', 'success');
  } catch {
    emit('toast', 'Không thể sao chép tự động, vui lòng copy thủ công.', 'error');
  }
};

const fillWalletForm = (wallet: any) => {
  walletForm.value = {
    name: wallet.name || '',
    address: wallet.address || '',
    type: 'main',
    status: wallet.status || 'active',
    pin: wallet.pin || '',
    privateKey: wallet.privateKey || '',
    publicKey: wallet.publicKey || '',
    balanceVND: Number(wallet.balance?.VND || 0),
    balanceUSD: Number(wallet.balance?.USD || 0),
  };
};

const resetWalletForm = () => {
  walletForm.value = {
    name: 'Ví chính',
    address: '',
    type: 'main',
    status: 'active',
    pin: '',
    privateKey: '',
    publicKey: '',
    balanceVND: 0,
    balanceUSD: 0,
  };
};

const fetchUserWallets = async () => {
  loading.value = true;
  try {
    const response = await walletApi.findMine({ id: props.user.id, limit: 100 });
    if (response && response.status) {
      userWallets.value = response.data || [];
    } else {
      userWallets.value = [];
    }
  } catch (err) {
    console.error('Failed to fetch user wallets:', err);
    userWallets.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchAdminWallets = async () => {
  try {
    const response = await walletApi.findAdmin({ limit: 100 });
    if (response && response.status) {
      adminWallets.value = response.data || [];
    } else {
      adminWallets.value = [];
    }
  } catch (err) {
    console.error('Failed to fetch admin wallets:', err);
    adminWallets.value = [];
  }
};

const openAddWalletModal = () => {
  selectedWalletId.value = null;
  resetWalletForm();
  addWalletStep.value = 'start';
  generatedPrivateKey.value = '';
  verifyPrivateKey.value = '';
  walletModalMode.value = 'add';
  walletModalError.value = '';
  isWalletModalOpen.value = true;
};

const handleGenerateWalletKey = async () => {
  walletModalLoading.value = true;
  walletModalError.value = '';
  try {
    const response = await walletApi.createKey();
    const privateKey = response?.data?.privateKey;
    if (response && response.status && privateKey) {
      generatedPrivateKey.value = privateKey;
      verifyPrivateKey.value = '';
      addWalletStep.value = 'backup';
    } else {
      const errMsg = walletApi.error.value?.message || response?.message;
      walletModalError.value = Array.isArray(errMsg)
        ? (errMsg[0] || 'Không thể tạo bộ khóa ví.')
        : (errMsg || 'Không thể tạo bộ khóa ví.');
    }
  } catch (err: any) {
    walletModalError.value = err.message || 'Có lỗi hệ thống xảy ra.';
  } finally {
    walletModalLoading.value = false;
  }
};

const copyGeneratedPrivateKey = async () => {
  if (!generatedPrivateKey.value) return;
  try {
    await navigator.clipboard.writeText(generatedPrivateKey.value);
    emit('toast', 'Đã copy private key!', 'success');
  } catch {
    emit('toast', 'Không thể copy tự động, vui lòng copy thủ công.', 'error');
  }
};

const handleValidateWalletKey = async () => {
  if (!verifyPrivateKey.value.trim()) {
    walletModalError.value = 'Vui lòng nhập private key để xác thực';
    return;
  }

  walletModalLoading.value = true;
  walletModalError.value = '';
  try {
    const response = await walletApi.validatePrivateKey(verifyPrivateKey.value.trim());
    if (response && response.status && response.data) {
      walletForm.value.privateKey = verifyPrivateKey.value.trim();
      walletForm.value.publicKey = response.data;
      addWalletStep.value = 'info';
      emit('toast', 'Xác thực private key thành công!', 'success');
    } else {
      const errMsg = walletApi.error.value?.message || response?.message;
      walletModalError.value = Array.isArray(errMsg)
        ? (errMsg[0] || 'Private key không hợp lệ.')
        : (errMsg || 'Private key không hợp lệ.');
    }
  } catch (err: any) {
    walletModalError.value = err.message || 'Có lỗi hệ thống xảy ra.';
  } finally {
    walletModalLoading.value = false;
  }
};

const openViewWalletModal = (wallet: any) => {
  selectedWalletId.value = wallet.id;
  fillWalletForm(wallet);
  walletModalMode.value = 'view';
  walletModalError.value = '';
  isWalletModalOpen.value = true;
};

const openEditWalletModal = (wallet: any) => {
  selectedWalletId.value = wallet.id;
  fillWalletForm(wallet);
  walletModalMode.value = 'edit';
  walletModalError.value = '';
  isWalletModalOpen.value = true;
};

const handleSaveWallet = async () => {
  if (walletModalMode.value !== 'add' && !selectedWalletId.value) return;
  if (walletModalMode.value === 'add' && addWalletStep.value !== 'info') return;
  if (!walletForm.value.name.trim()) {
    walletModalError.value = 'Vui lòng nhập tên ví';
    return;
  }
  if (!walletForm.value.privateKey.trim()) {
    walletModalError.value = 'Vui lòng nhập private key';
    return;
  }
  if (!walletForm.value.publicKey.trim()) {
    walletModalError.value = 'Vui lòng nhập public key';
    return;
  }
  if (!walletForm.value.pin || walletForm.value.pin.length !== 6) {
    walletModalError.value = 'Vui lòng nhập đủ 6 số PIN';
    return;
  }

  walletModalLoading.value = true;
  walletModalError.value = '';

  try {
    const response =
      walletModalMode.value === 'add'
        ? await walletApi.create({
            name: walletForm.value.name.trim(),
            type: walletForm.value.type,
            pin: walletForm.value.pin,
            privateKey: walletForm.value.privateKey,
            publicKey: walletForm.value.publicKey,
            userId: props.user.id,
          })
        : await walletApi.update(selectedWalletId.value!, {
            name: walletForm.value.name.trim(),
            status: walletForm.value.status,
            pin: walletForm.value.pin,
            privateKey: walletForm.value.privateKey,
            publicKey: walletForm.value.publicKey,
            balance: {
              VND: Number(walletForm.value.balanceVND || 0),
              USD: Number(walletForm.value.balanceUSD || 0),
            },
          });

    if (response && response.status) {
      emit('toast', walletModalMode.value === 'add' ? 'Tạo ví thành công!' : 'Cập nhật ví thành công!', 'success');
      isWalletModalOpen.value = false;
      await fetchUserWallets();
      emit('updated');
    } else {
      const errMsg = walletApi.error.value?.message || response?.message;
      walletModalError.value = Array.isArray(errMsg)
        ? (errMsg[0] || 'Không thể lưu ví.')
        : (errMsg || 'Không thể lưu ví.');
    }
  } catch (err: any) {
    walletModalError.value = err.message || 'Có lỗi hệ thống xảy ra.';
  } finally {
    walletModalLoading.value = false;
  }
};

const handleDeleteWallet = async (walletId: string) => {
  if (!confirm('Bạn có chắc chắn muốn xóa ví này không?')) {
    return;
  }
  try {
    const response = await walletApi.remove(walletId);
    if (response && response.status) {
      emit('toast', 'Đã xóa ví thành công!', 'success');
      await fetchUserWallets();
      emit('updated');
    } else {
      emit('toast', response?.message || 'Không thể xóa ví.', 'error');
    }
  } catch (err) {
    console.error('Failed to delete wallet:', err);
    emit('toast', 'Có lỗi xảy ra khi xóa ví.', 'error');
  }
};

const openWalletTransferModal = async (mode: WalletTransferMode, wallet: any) => {
  selectedTransferWallet.value = wallet;
  walletTransferMode.value = mode;
  walletTransferError.value = '';
  walletTransferForm.value = {
    adminAddress: '',
    targetAddress: wallet.address,
    amount: 0,
    currency: 'VND',
  };
  isWalletTransferOpen.value = true;

  await fetchAdminWallets();
  walletTransferForm.value.adminAddress = adminWallets.value[0]?.address || '';
};

const handleWalletTransfer = async () => {
  if (!selectedTransferWallet.value) return;
  if (!walletTransferForm.value.adminAddress) {
    walletTransferError.value = 'Vui lòng chọn ví admin';
    return;
  }
  if (!walletTransferForm.value.amount || walletTransferForm.value.amount <= 0) {
    walletTransferError.value = 'Vui lòng nhập số tiền lớn hơn 0';
    return;
  }

  const isDeposit = walletTransferMode.value === 'deposit';
  const from = isDeposit
    ? walletTransferForm.value.adminAddress
    : selectedTransferWallet.value.address;
  const to = isDeposit
    ? selectedTransferWallet.value.address
    : walletTransferForm.value.adminAddress;

  walletTransferLoading.value = true;
  walletTransferError.value = '';

  try {
    const response = await walletApi.transfer({
      from,
      to,
      amount: Number(walletTransferForm.value.amount),
      currency: walletTransferForm.value.currency,
    });

    if (response && response.status) {
      emit('toast', isDeposit ? 'Nạp tiền vào ví thành công!' : 'Rút tiền từ ví thành công!', 'success');
      isWalletTransferOpen.value = false;
      await fetchUserWallets();
      await fetchAdminWallets();
      emit('updated');
    } else {
      const errMsg = walletApi.error.value?.message || response?.message;
      walletTransferError.value = Array.isArray(errMsg)
        ? (errMsg[0] || 'Không thể thực hiện giao dịch.')
        : (errMsg || 'Không thể thực hiện giao dịch.');
    }
  } catch (err: any) {
    walletTransferError.value = err.message || 'Có lỗi hệ thống xảy ra.';
  } finally {
    walletTransferLoading.value = false;
  }
};

onMounted(() => {
  fetchUserWallets();
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between select-none">
      <h4 class="text-xs font-black text-zinc-455 dark:text-zinc-550 uppercase tracking-wider">Số dư ví tài khoản</h4>
      <div class="flex items-center gap-2">
        <CmButton 
          variant="outline"
          size="sm"
          icon="heroicons:arrow-path"
          class="text-[10px] font-bold"
          :loading="loading"
          @click="fetchUserWallets"
        >
          Tải lại
        </CmButton>
        <CmButton 
          variant="primary"
          size="sm"
          icon="heroicons:plus"
          class="text-[10px] font-bold"
          @click="openAddWalletModal"
        >
          Thêm ví
        </CmButton>
      </div>
    </div>

    <!-- Loading Skeleton/Spinner -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <Icon name="heroicons:arrow-path" class="text-3xl text-primary animate-spin" />
      <p class="text-xs text-zinc-400 dark:text-zinc-500 mt-2 font-medium">Đang tải danh sách ví...</p>
    </div>

    <div v-else-if="userWallets.length === 0" class="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] select-none">
      <Icon name="heroicons:wallet" class="text-4xl text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
      <p class="text-xs font-bold text-zinc-500">Người dùng này chưa có ví.</p>
      <CmButton
        variant="primary"
        size="sm"
        icon="heroicons:plus"
        class="text-[10px] font-bold mt-4"
        @click="openAddWalletModal"
      >
        Thêm ví đầu tiên
      </CmButton>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="wallet in userWallets" 
        :key="wallet.id"
        class="p-5 rounded-[1.75rem] border border-zinc-150/70 dark:border-zinc-800/60 bg-gradient-to-br from-emerald-50/80 via-primary/5 to-white dark:from-emerald-950/10 dark:via-primary/10 dark:to-zinc-950 relative overflow-hidden hover:shadow-md transition-all duration-300"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 flex items-center justify-center shrink-0">
                <Icon name="heroicons:wallet" class="text-base" />
              </span>
              <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{{ wallet.name }}</span>
            </div>
            <div class="mt-3 flex items-center gap-2 min-w-0 max-w-full rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-white/55 dark:bg-zinc-950/30 px-3 py-2">
              <Icon name="heroicons:link" class="text-xs text-zinc-400 shrink-0" />
              <p class="text-[10px] leading-none font-mono text-zinc-500 dark:text-zinc-400 truncate select-all flex-1 min-w-0">{{ wallet.address }}</p>
              <CmButtonBase
                class="w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 bg-white/70 dark:bg-zinc-900/70 inline-flex items-center justify-center shrink-0 transition-all"
                title="Sao chép địa chỉ ví"
                @click="copyWalletAddress(wallet.address)"
              >
                <Icon name="heroicons:clipboard-document" class="text-sm" />
              </CmButtonBase>
            </div>
          </div>
          <span class="shrink-0 text-[9px] font-extrabold uppercase bg-white/70 dark:bg-black/30 border border-white/80 dark:border-black/20 px-3 py-1 rounded-full text-zinc-550 dark:text-zinc-300">
            {{ wallet.status || 'inactive' }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-3 mt-5">
          <div
            v-for="[currency, amount] in getWalletCurrencyEntries(wallet)"
            :key="currency"
            class="rounded-2xl border border-white/80 dark:border-zinc-800/50 bg-white/65 dark:bg-zinc-950/25 p-4 shadow-sm shadow-white/20"
          >
            <p class="text-[9px] font-black uppercase text-zinc-450 dark:text-zinc-500 tracking-wider">{{ currency }}</p>
            <p class="text-lg font-black text-zinc-900 dark:text-white mt-1">{{ formatWalletAmount(currency, amount) }}</p>
          </div>
        </div>

        <div class="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span class="text-[9px] font-mono text-zinc-400 truncate">#{{ wallet.id }}</span>
          <div class="flex flex-wrap items-center sm:justify-end gap-2">
            <CmButtonBase 
              class="h-8 px-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-300 bg-white/70 dark:bg-zinc-900/70 inline-flex items-center justify-center"
              title="Nạp tiền vào ví"
              @click="openWalletTransferModal('deposit', wallet)"
            >
              Nạp
            </CmButtonBase>
            <CmButtonBase 
              class="h-8 px-3 rounded-xl border border-amber-200 dark:border-amber-900/40 text-[10px] font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all duration-300 bg-white/70 dark:bg-zinc-900/70 inline-flex items-center justify-center"
              title="Rút tiền từ ví"
              @click="openWalletTransferModal('withdraw', wallet)"
            >
              Rút
            </CmButtonBase>
            <CmButtonBase 
              class="w-8 h-8 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 bg-white/70 dark:bg-zinc-900/70 inline-flex items-center justify-center shrink-0"
              title="Xem chi tiết ví"
              @click="openViewWalletModal(wallet)"
            >
              <Icon name="heroicons:eye" class="text-sm" />
            </CmButtonBase>
            <CmButtonBase 
              class="w-8 h-8 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 bg-white/70 dark:bg-zinc-900/70 inline-flex items-center justify-center shrink-0"
              title="Chỉnh sửa ví"
              @click="openEditWalletModal(wallet)"
            >
              <Icon name="heroicons:pencil-square" class="text-sm" />
            </CmButtonBase>
            <CmButtonBase 
              class="w-8 h-8 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-500 hover:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300 bg-white/70 dark:bg-zinc-900/70 inline-flex items-center justify-center shrink-0"
              title="Xóa ví"
              @click="handleDeleteWallet(wallet.id)"
            >
              <Icon name="heroicons:trash" class="text-sm" />
            </CmButtonBase>
          </div>
        </div>
      </div>
    </div>

    <!-- Wallet Detail/Edit Dialog Modal -->
    <CmDialog
      v-model:isOpen="isWalletModalOpen"
      :title="walletModalMode === 'add' ? 'Thêm ví tài khoản' : walletModalMode === 'edit' ? 'Cập nhật ví tài khoản' : 'Chi tiết ví tài khoản'"
      size="md"
    >
      <div class="space-y-5">
        <div 
          v-if="walletModalError" 
          class="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-900/30 rounded-xl text-xs font-bold text-red-500 flex items-center gap-2 select-none"
        >
          <Icon name="heroicons:information-circle" class="text-base shrink-0" />
          <span>{{ walletModalError }}</span>
        </div>

        <div v-if="walletModalMode === 'add'" class="space-y-5">
          <div v-if="addWalletStep === 'start'" class="text-center py-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] select-none">
            <Icon name="heroicons:key" class="text-4xl text-primary mx-auto mb-3" />
            <p class="text-sm font-black text-zinc-850 dark:text-white">Tạo bộ khoá ví mới</p>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm mx-auto">
              Bấm tạo ví ngay để hệ thống sinh private key. Người dùng cần copy và lưu chuỗi này trước khi tiếp tục.
            </p>
          </div>

          <div v-else-if="addWalletStep === 'backup'" class="space-y-4">
            <div class="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 text-xs text-amber-700 dark:text-amber-300 font-semibold">
              Private key chỉ hiển thị ở bước này. Hãy copy và lưu an toàn trước khi xác thực.
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
                Private key vừa tạo
              </label>
              <div class="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 break-all select-all">
                {{ generatedPrivateKey }}
              </div>
            </div>
            <CmButton
              variant="outline"
              size="sm"
              icon="heroicons:clipboard-document"
              class="text-[10px] font-bold"
              @click="copyGeneratedPrivateKey"
            >
              Copy private key
            </CmButton>
          </div>

          <div v-else-if="addWalletStep === 'verify'" class="space-y-4">
            <div class="p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 text-xs text-zinc-600 dark:text-zinc-300 font-semibold">
              Nhập lại private key đã copy để xác thực. API sẽ trả về public key nếu chuỗi hợp lệ. 
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
                Nhập private key <span class="text-red-500">*</span>
              </label>
              <CmInput 
                v-model="verifyPrivateKey"
                placeholder="Dán private key đã copy"
                icon="heroicons:lock-closed"
              />
            </div>
          </div>

          <div v-else class="space-y-4">
            <div class="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/70 dark:bg-emerald-950/20 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
              Private key đã xác thực. Tiếp tục nhập thông tin ví và cài mã PIN.
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
                Tên ví <span class="text-red-500">*</span>
              </label>
              <CmInput 
                v-model="walletForm.name"
                placeholder="Vd: Ví chính"
                icon="heroicons:wallet"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
                Loại ví
              </label>
              <CmInput 
                v-model="walletForm.type"
                placeholder="main"
                icon="heroicons:squares-2x2"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
                Mã PIN <span class="text-red-500">*</span>
              </label>
              <CmPinInput 
                v-model="walletForm.pin"
              />
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
                  Private key đã xác thực
                </label>
                <div class="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 break-all select-all">
                  {{ walletForm.privateKey }}
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
                  Public key
                </label>
                <div class="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 break-all select-all">
                  {{ walletForm.publicKey }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 gap-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-555 select-none">
                Mã ví 
              </label>
              <div class="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-300 truncate select-all">
                {{ selectedWalletId || 'N/A' }}
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
                Trạng thái
              </label>
              <CmSelectBase 
                v-model="walletForm.status"
                :disabled="walletModalMode === 'view'"
                class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-primary/50 disabled:opacity-70"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="locked">Locked</option>
              </CmSelectBase>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
              Tên ví <span class="text-red-500">*</span>
            </label>
            <CmInput 
              v-model="walletForm.name"
              :disabled="walletModalMode === 'view'"
              placeholder="Nhập tên ví"
              icon="heroicons:wallet"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
              Địa chỉ ví
            </label>
            <div class="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-300 break-all select-all">
              {{ walletForm.address || 'N/A' }}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
                Số dư VND
              </label>
              <CmInput 
                v-model="walletForm.balanceVND"
                :disabled="walletModalMode === 'view'"
                type="number"
                placeholder="0"
                icon="heroicons:banknotes"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
                Số dư USD
              </label>
              <CmInput 
                v-model="walletForm.balanceUSD"
                :disabled="walletModalMode === 'view'"
                type="number"
                placeholder="0"
                icon="heroicons:currency-dollar"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
              PIN
            </label>
            <CmPinInput 
              v-model="walletForm.pin"
              :disabled="walletModalMode === 'view'"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
              Private key
            </label>
            <CmInput 
              v-model="walletForm.privateKey"
              :disabled="walletModalMode === 'view'"
              placeholder="Private key"
              icon="heroicons:lock-closed"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-555 select-none">
              Public key
            </label>
            <CmInput 
              v-model="walletForm.publicKey"
              :disabled="walletModalMode === 'view'"
              placeholder="Public key"
              icon="heroicons:identification"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <CmButton 
          variant="ghost" 
          size="md" 
          class="text-xs font-semibold px-5" 
          :disabled="walletModalLoading"
          @click="isWalletModalOpen = false"
        >
          Đóng
        </CmButton>
        <CmButton 
          v-if="walletModalMode === 'add' && addWalletStep === 'start'"
          variant="primary" 
          size="md" 
          class="text-xs font-bold px-5 shadow-sm shadow-primary/10" 
          :loading="walletModalLoading"
          @click="handleGenerateWalletKey"
        >
          Tạo ví ngay
        </CmButton>
        <CmButton 
          v-else-if="walletModalMode === 'add' && addWalletStep === 'backup'"
          variant="primary" 
          size="md" 
          class="text-xs font-bold px-5 shadow-sm shadow-primary/10" 
          @click="addWalletStep = 'verify'"
        > 
          Tiến hành xác thực   
        </CmButton>
        <CmButton 
          v-else-if="walletModalMode === 'add' && addWalletStep === 'verify'"
          variant="primary" 
          size="md" 
          class="text-xs font-bold px-5 shadow-sm shadow-primary/10" 
          :loading="walletModalLoading"
          @click="handleValidateWalletKey"
        >
          Xác thực
        </CmButton>
        <CmButton 
          v-else-if="walletModalMode === 'add' && addWalletStep === 'info'"
          variant="primary" 
          size="md" 
          class="text-xs font-bold px-5 shadow-sm shadow-primary/10" 
          :loading="walletModalLoading"
          @click="handleSaveWallet"
        >
          Khởi tạo ví 
        </CmButton>
        <CmButton 
          v-else-if="walletModalMode === 'view'"
          variant="primary" 
          size="md" 
          class="text-xs font-bold px-5 shadow-sm shadow-primary/10" 
          @click="walletModalMode = 'edit'"
        >
          Chỉnh sửa 
        </CmButton>
        <CmButton 
          v-else-if="walletModalMode === 'edit'"
          variant="primary" 
          size="md" 
          class="text-xs font-bold px-5 shadow-sm shadow-primary/10" 
          :loading="walletModalLoading"
          @click="handleSaveWallet"
        >
          Cập nhật 
        </CmButton>
      </template>
    </CmDialog>

    <!-- Wallet Transfer Dialog Modal (Deposit/Withdraw) -->
    <CmDialog
      v-model:isOpen="isWalletTransferOpen"
      :title="walletTransferMode === 'deposit' ? 'Nạp tiền vào ví tài khoản' : 'Rút tiền từ ví tài khoản'"  
      size="md"
    >
      <div class="space-y-5">
        <div 
          v-if="walletTransferError" 
          class="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-900/30 rounded-xl text-xs font-bold text-red-500 flex items-center gap-2 select-none"
        >
          <Icon name="heroicons:information-circle" class="text-base shrink-0" />
          <span>{{ walletTransferError }}</span>
        </div>

        <div 
          v-if="adminWallets.length === 0"
          class="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 text-xs text-amber-700 dark:text-amber-300 font-semibold"
        >
          Chưa có ví admin. Hãy tạo ví cho tài khoản quyền sp-ad trước khi nạp/rút. 
        </div>

        <div class="space-y-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
              {{ walletTransferMode === 'deposit' ? 'Ví admin trừ tiền' : 'Ví admin nhận tiền' }} <span class="text-red-500">*</span>
            </label>
            <CmSelectBase
              v-model="walletTransferForm.adminAddress"
              class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-primary/50"
            >
              <option value="" disabled>Chọn ví admin</option>
              <option
                v-for="adminWallet in adminWallets"
                :key="adminWallet.id"
                :value="adminWallet.address"
              >
                {{ getWalletLabel(adminWallet) }}
              </option>
            </CmSelectBase>
            <p v-if="walletTransferForm.adminAddress" class="text-[10px] text-zinc-400 font-medium">
              Số dư {{ walletTransferForm.currency }}:
              <strong class="text-zinc-700 dark:text-zinc-200">
                {{ formatWalletAmount(walletTransferForm.currency, getWalletBalance(getWalletByAddress(walletTransferForm.adminAddress), walletTransferForm.currency)) }}
              </strong>
            </p>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
              {{ walletTransferMode === 'deposit' ? 'Địa chỉ ví nhận' : 'Địa chỉ ví rút' }}
            </label>
            <div class="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-300 break-all select-all">
              {{ selectedTransferWallet?.address || 'N/A' }}
            </div>
            <p class="text-[10px] text-zinc-400 font-medium">
              {{ walletTransferMode === 'deposit' ? 'Địa chỉ nhận mặc định là ví của người dùng đang chọn và không thể sửa. ' : 'Ví rút mặc định là ví của người dùng đang chọn và không thể sửa.' }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
                Loại tiền
              </label>
              <CmSelectBase
                v-model="walletTransferForm.currency"
                class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-primary/50"
              >
                <option value="VND">VND</option>
                <option value="USD">USD</option>
              </CmSelectBase>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
                Số tiền <span class="text-red-500">*</span>
              </label>
              <CmInput
                v-model="walletTransferForm.amount"
                type="number"
                placeholder="0"
                icon="heroicons:banknotes"
              />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <CmButton
          variant="ghost"
          size="md"
          class="text-xs font-semibold px-5"
          :disabled="walletTransferLoading"
          @click="isWalletTransferOpen = false"
        >
          Đóng
        </CmButton>
        <CmButton
          variant="primary"
          size="md"
          class="text-xs font-bold px-5 shadow-sm shadow-primary/10"
          :loading="walletTransferLoading"
          :disabled="adminWallets.length === 0"
          @click="handleWalletTransfer"
        >
          {{ walletTransferMode === 'deposit' ? 'Nạp tiền' : 'Rút tiền' }}
        </CmButton>
      </template>
    </CmDialog>
  </div>
</template>
