<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  path: '/finance/transactions',
  layout: 'admin'
});

const searchQuery = ref('');
const selectedType = ref('');
const selectedStatus = ref('');

const transactions = ref([
  { id: 'TX9082', user: 'Hoàng Anh', email: 'hoanganh@gmail.com', type: 'deposit', amount: 5000000, method: 'Vietcombank', status: 'success', date: '2026-05-18T10:30:00Z', description: 'Nạp tiền qua Vietcombank' },
  { id: 'TX8941', user: 'Vũ Nam', email: 'vunam@outlook.com', type: 'upgrade', amount: -2990000, method: 'Main Wallet', status: 'success', date: '2026-05-15T14:20:00Z', description: 'Mua gói dịch vụ mnfinance' },
  { id: 'TX8810', user: 'Lê Minh', email: 'leminh@gmail.com', type: 'withdraw', amount: -10000000, method: 'Techcombank', status: 'pending', date: '2026-05-19T08:15:00Z', description: 'Yêu cầu rút tiền tài khoản' },
  { id: 'TX8752', user: 'Phạm Bình', email: 'phambinh@gmail.com', type: 'deposit', amount: 15000000, method: 'MB Bank', status: 'success', date: '2026-05-19T07:10:00Z', description: 'Nạp tiền qua MB Bank QR' },
  { id: 'TX8640', user: 'Đỗ Tiến', email: 'dotien@hotmail.com', type: 'withdraw', amount: -5000000, method: 'Vietinbank', status: 'failed', date: '2026-05-17T11:45:00Z', description: 'Yêu cầu rút tiền lỗi ngân hàng' }
]);

const stats = ref([
  { name: 'Tổng nạp (VND)', value: '2,450,000,000 đ', icon: 'heroicons:arrow-down-left', color: 'text-emerald-500 bg-emerald-500/10' },
  { name: 'Tổng rút (VND)', value: '1,120,000,000 đ', icon: 'heroicons:arrow-up-right', color: 'text-rose-500 bg-rose-500/10' },
  { name: 'Giao dịch chờ duyệt', value: '12 giao dịch', icon: 'heroicons:clock', color: 'text-amber-500 bg-amber-500/10' }
]);

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleApprove = (tx: any) => {
  tx.status = 'success';
  alert(`Đã phê duyệt giao dịch #${tx.id} thành công!`);
};

const handleReject = (tx: any) => {
  tx.status = 'failed';
  alert(`Đã từ chối giao dịch #${tx.id}!`);
};
</script>

<template>
  <div class="flex-1 flex flex-col min-w-0">
    <!-- Header Utility Bar -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div class="w-full max-w-md">
        <CmInput 
          v-model="searchQuery" 
          placeholder="Tìm theo mã giao dịch, email người dùng..." 
          icon="heroicons:magnifying-glass"
        />
      </div>
    </header>

    <!-- Welcome & Action Row -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
          Lịch sử Giao dịch Hệ thống
        </h1>
        <p class="text-xs sm:text-sm text-zinc-400 dark:text-zinc-550 font-medium mt-2">
          Theo dõi, tra cứu và phê duyệt toàn bộ các lệnh nạp rút và nâng cấp của tài khoản thành viên.
        </p>
      </div>
    </section>

    <!-- Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div 
        v-for="item in stats" 
        :key="item.name"
        class="p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] flex items-center justify-between shadow-sm"
      >
        <div class="space-y-2">
          <p class="text-[11px] font-bold text-zinc-400 uppercase tracking-wider leading-none">{{ item.name }}</p>
          <h3 class="text-xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">{{ item.value }}</h3>
        </div>
        <div class="w-11 h-11 rounded-2xl flex items-center justify-center" :class="item.color">
          <Icon :name="item.icon" class="text-lg" />
        </div>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="flex flex-wrap gap-4 mb-6">
      <select 
        v-model="selectedType" 
        class="bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-350 rounded-2xl px-4 py-2.5 outline-none hover:bg-zinc-100/50 dark:hover:bg-zinc-800/80 transition-colors"
      >
        <option value="">Tất cả loại giao dịch</option>
        <option value="deposit">Nạp tiền</option>
        <option value="withdraw">Rút tiền</option>
        <option value="upgrade">Nâng cấp gói</option>
      </select>

      <select 
        v-model="selectedStatus" 
        class="bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-350 rounded-2xl px-4 py-2.5 outline-none hover:bg-zinc-100/50 dark:hover:bg-zinc-800/80 transition-colors"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="success">Thành công</option>
        <option value="pending">Đang xử lý</option>
        <option value="failed">Lỗi / Hủy</option>
      </select>
    </div>

    <!-- Transactions Grid Table -->
    <div class="overflow-x-auto border border-zinc-150/80 dark:border-zinc-850 rounded-[2rem] bg-white dark:bg-zinc-950 no-scrollbar">
      <table class="w-full border-collapse text-left min-w-[900px]">
        <thead>
          <tr class="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-100 dark:border-zinc-850 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider select-none">
            <th class="px-5 py-4">Mã giao dịch</th>
            <th class="px-5 py-4">Khách hàng</th>
            <th class="px-5 py-4">Loại giao dịch</th>
            <th class="px-5 py-4">Số tiền</th>
            <th class="px-5 py-4">Phương thức</th>
            <th class="px-5 py-4">Trạng thái</th>
            <th class="px-5 py-4">Thời gian</th>
            <th class="px-5 py-4 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 dark:divide-zinc-900 text-xs font-semibold text-zinc-650 dark:text-zinc-300">
          <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
            <td class="px-5 py-4 font-bold text-zinc-800 dark:text-zinc-100">#{{ tx.id }}</td>
            <td class="px-5 py-4">
              <div class="flex flex-col">
                <span class="font-bold text-zinc-800 dark:text-zinc-100">{{ tx.user }}</span>
                <span class="text-[10px] text-zinc-400 font-medium">{{ tx.email }}</span>
              </div>
            </td>
            <td class="px-5 py-4">
              <span 
                class="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border"
                :class="tx.type === 'deposit' 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border-emerald-100/50'
                  : tx.type === 'withdraw'
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450 border-rose-100/50'
                    : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-405 border-indigo-100/50'"
              >
                {{ tx.type === 'deposit' ? 'Nạp tiền' : tx.type === 'withdraw' ? 'Rút tiền' : 'Nâng cấp' }}
              </span>
            </td>
            <td 
              class="px-5 py-4 font-black text-sm"
              :class="tx.amount > 0 ? 'text-emerald-500' : 'text-rose-500'"
            >
              {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount.toLocaleString() }} đ
            </td>
            <td class="px-5 py-4 font-medium text-zinc-500 dark:text-zinc-400">{{ tx.method }}</td>
            <td class="px-5 py-4">
              <span 
                class="inline-flex items-center gap-1.5 text-[10px] font-bold"
                :class="tx.status === 'success' ? 'text-emerald-500' : tx.status === 'pending' ? 'text-amber-500' : 'text-rose-500'"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                {{ tx.status === 'success' ? 'Thành công' : tx.status === 'pending' ? 'Chờ duyệt' : 'Thất bại' }}
              </span>
            </td>
            <td class="px-5 py-4 text-zinc-400 font-medium">{{ formatDate(tx.date) }}</td>
            <td class="px-5 py-4 text-right">
              <div v-if="tx.status === 'pending'" class="inline-flex items-center gap-2">
                <CmButton 
                  variant="primary" 
                  class="h-8 text-[10px] font-bold px-3 py-1 shadow-sm shadow-primary/10"
                  @click="handleApprove(tx)"
                >
                  Duyệt
                </CmButton>
                <CmButton 
                  variant="outline" 
                  class="h-8 text-[10px] border-zinc-150 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 font-bold px-3 py-1"
                  @click="handleReject(tx)"
                >
                  Hủy
                </CmButton>
              </div>
              <span v-else class="text-[10px] text-zinc-400 font-medium italic">Đã đối soát</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
