<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { User } from '~/types/user';

const props = defineProps<{
  user: User;
}>();

const userTransactions = ref<any[]>([]);
const loading = ref(false);

const transactionApi = useTransactionApi();

const fetchUserTransactions = async () => {
  loading.value = true;
  try {
    const response = await transactionApi.findMine({ id: props.user.id, limit: 100 });
    if (response && response.status) {
      userTransactions.value = response.data || [];
    } else {
      userTransactions.value = [];
    }
  } catch (err) {
    console.error('Failed to fetch user transactions:', err);
    userTransactions.value = [];
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatTransactionAmount = (tx: any) => {
  const amount = Number(tx.amount || 0);
  const value = Math.abs(amount).toLocaleString('vi-VN');
  return tx.currency === 'USD' ? `$${value}` : `${value} ₫`;
};

const getTransactionTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    deposit: 'Nạp tiền',
    withdraw: 'Rút tiền',
    transfer: 'Chuyển tiền',
  };
  return labels[type] || type;
};

const getTransactionStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    success: 'Thành công',
    pending: 'Đang xử lý',
    failed: 'Thất bại',
  };
  return labels[status] || status;
};

// Expose fetch method so parent modal can refresh transactions if needed when wallet changes
defineExpose({
  fetchUserTransactions,
});

onMounted(() => {
  fetchUserTransactions();
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between select-none">
      <h4 class="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Lịch sử giao dịch gần đây</h4>
      <CmButton
        variant="outline"
        size="sm"
        icon="heroicons:arrow-path"
        class="text-[10px] font-bold"
        :loading="loading"
        @click="fetchUserTransactions"
      >
        Tải lại
      </CmButton>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <Icon name="heroicons:arrow-path" class="text-3xl text-primary animate-spin" />
      <p class="text-xs text-zinc-400 dark:text-zinc-500 mt-2 font-medium">Đang tải lịch sử giao dịch...</p>
    </div>

    <div v-else-if="userTransactions.length === 0" class="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] select-none">
      <Icon name="heroicons:arrow-path" class="text-4xl text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
      <p class="text-xs font-bold text-zinc-500">Người dùng này chưa có giao dịch.</p>
    </div>

    <div v-else class="overflow-x-auto border border-zinc-150/80 dark:border-zinc-850 rounded-2xl no-scrollbar">
      <CmSimpleTable class="w-full border-collapse text-left min-w-[700px]">
        <thead>
          <tr class="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-100 dark:border-zinc-850 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider select-none">
            <th class="px-5 py-3.5">Mã giao dịch</th>
            <th class="px-5 py-3.5">Loại giao dịch</th>
            <th class="px-5 py-3.5">Số tiền</th>
            <th class="px-5 py-3.5">Mô tả</th>
            <th class="px-5 py-3.5">Trạng thái</th>
            <th class="px-5 py-3.5">Thời gian</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 dark:divide-zinc-900 text-xs font-semibold text-zinc-650 dark:text-zinc-300">
          <tr v-for="tx in userTransactions" :key="tx.id" class="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
            <td class="px-5 py-3.5 font-bold text-zinc-800 dark:text-zinc-100">#{{ tx.id }}</td>
            <td class="px-5 py-3.5">
              <span 
                class="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border"
                :class="tx.type === 'deposit' 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border-emerald-100/50'
                  : tx.type === 'withdraw'
                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-450 border-amber-100/50'
                    : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-405 border-indigo-100/50'"
              >
                {{ getTransactionTypeLabel(tx.type) }}
              </span>
            </td>
            <td 
              class="px-5 py-3.5 font-black text-sm"
              :class="Number(tx.amount) >= 0 ? 'text-emerald-500' : 'text-red-500'"
            >
              {{ Number(tx.amount) >= 0 ? '+' : '-' }}{{ formatTransactionAmount(tx) }}
            </td>
            <td class="px-5 py-3.5 text-zinc-500 dark:text-zinc-400 font-medium">{{ tx.description || 'N/A' }}</td>
            <td class="px-5 py-3.5">
              <span 
                class="inline-flex items-center gap-1 text-[10px] font-bold"
                :class="tx.status === 'success' ? 'text-emerald-500' : tx.status === 'failed' ? 'text-red-500' : 'text-amber-500'"
              >
                <span class="w-1 h-1 rounded-full bg-current animate-pulse"></span>
                {{ getTransactionStatusLabel(tx.status) }}
              </span>
            </td>
            <td class="px-5 py-3.5 text-zinc-400 font-medium">{{ formatDate(tx.createdAt) }}</td>
          </tr>
        </tbody>
      </CmSimpleTable>
    </div>
  </div>
</template>
