<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  path: '/supper/finance/wallet',
  layout: 'supper'
});

const searchQuery = ref('');

const wallets = ref([
  { id: 'W-US09', owner: 'Nguyễn Văn Minh', email: 'minhnv@gmail.com', type: 'VND', balance: 45000000, status: 'Active' },
  { id: 'W-US12', owner: 'Trần Thị Thảo', email: 'thaott@yahoo.com', type: 'VND', balance: 120500000, status: 'Active' },
  { id: 'W-US18', owner: 'Phạm Ngọc Hải', email: 'haipn@outlook.com', type: 'USD', balance: 4800, status: 'Active' },
  { id: 'W-US25', owner: 'Lâm Minh Quân', email: 'quanlm@gmail.com', type: 'VND', balance: 500000, status: 'Inactive' },
  { id: 'W-US41', owner: 'Đỗ Thùy Trang', email: 'trangdt@gmail.com', type: 'USD', balance: 15200, status: 'Active' }
]);

const summary = ref([
  { name: 'Tổng số dư ví thành viên (VND)', value: '285,400,000,000 đ', flag: 'circle-flags:vn' },
  { name: 'Tổng số dư ví thành viên (USD)', value: '$1,520,000', flag: 'circle-flags:us' }
]);
</script>

<template>
  <div class="flex-1 flex flex-col min-w-0">
    <!-- Header search bar -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div class="w-full max-w-md">
        <CmInput 
          v-model="searchQuery" 
          placeholder="Tìm kiếm theo chủ ví, email..." 
          icon="heroicons:magnifying-glass"
        />
      </div>
    </header>

    <!-- Page Title section -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
          Quản lý Ví Thành viên (Supper)
        </h1>
        <p class="text-xs sm:text-sm text-zinc-400 dark:text-zinc-550 font-medium mt-2">
          Xem, kiểm tra số dư và trạng thái ví của toàn bộ thành viên trong hệ thống Binex.
        </p>
      </div>
      
      <div class="flex items-center gap-3 shrink-0">
        <CmButton variant="outline" icon="heroicons:shield-exclamation" class="text-xs font-bold border-zinc-150 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 px-4 py-2.5">
          Quét ví bất thường
        </CmButton>
      </div>
    </section>

    <!-- Aggregates widgets -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div 
        v-for="item in summary" 
        :key="item.name"
        class="p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] flex items-center justify-between shadow-sm"
      >
        <div class="space-y-2">
          <p class="text-[11px] font-bold text-zinc-400 uppercase tracking-wider leading-none">{{ item.name }}</p>
          <h3 class="text-2xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">{{ item.value }}</h3>
        </div>
        <div class="w-10 h-10 rounded-full overflow-hidden shrink-0">
          <Icon :name="item.flag" class="text-3xl" />
        </div>
      </div>
    </div>

    <!-- Active member wallets list -->
    <h3 class="text-base font-black text-zinc-800 dark:text-white mb-4">Danh sách Ví đang hoạt động</h3>
    <div class="overflow-x-auto border border-zinc-150/80 dark:border-zinc-850 rounded-[2rem] bg-white dark:bg-zinc-950 no-scrollbar">
      <table class="w-full border-collapse text-left min-w-[800px]">
        <thead>
          <tr class="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-100 dark:border-zinc-850 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider select-none">
            <th class="px-5 py-4">Mã Ví</th>
            <th class="px-5 py-4">Chủ sở hữu</th>
            <th class="px-5 py-4">Loại tiền</th>
            <th class="px-5 py-4">Số dư khả dụng</th>
            <th class="px-5 py-4">Trạng thái</th>
            <th class="px-5 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 dark:divide-zinc-900 text-xs font-semibold text-zinc-655 dark:text-zinc-300">
          <tr v-for="wallet in wallets" :key="wallet.id" class="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
            <td class="px-5 py-4 font-mono font-bold text-zinc-800 dark:text-zinc-100">#{{ wallet.id }}</td>
            <td class="px-5 py-4">
              <div class="flex flex-col">
                <span class="font-bold text-zinc-800 dark:text-zinc-100">{{ wallet.owner }}</span>
                <span class="text-[10px] text-zinc-400 font-medium">{{ wallet.email }}</span>
              </div>
            </td>
            <td class="px-5 py-4">
              <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                {{ wallet.type }}
              </span>
            </td>
            <td class="px-5 py-4 font-black text-sm text-zinc-800 dark:text-white">
              {{ wallet.type === 'USD' ? '$' + wallet.balance.toLocaleString() : wallet.balance.toLocaleString() + ' đ' }}
            </td>
            <td class="px-5 py-4">
              <span 
                class="inline-flex items-center gap-1.5 text-[10px] font-bold"
                :class="wallet.status === 'Active' ? 'text-emerald-500' : 'text-zinc-400'"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                {{ wallet.status }}
              </span>
            </td>
            <td class="px-5 py-4 text-right">
              <CmButton 
                variant="outline" 
                class="h-8 text-[10px] border-zinc-150 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 font-bold px-3 py-1"
              >
                Chi tiết ví
              </CmButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
