<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  path: '/supper/finance/banking',
  layout: 'supper'
});

const searchQuery = ref('');

const bankAccounts = ref([
  { id: 'BA-01', bankName: 'Vietcombank (VCB)', accountNo: '1023948576', accountName: 'CONG TY CO PHAN BINEX', limit: 'Không giới hạn', status: 'Active', type: 'Nhận tiền & Đối soát' },
  { id: 'BA-02', bankName: 'Techcombank (TCB)', accountNo: '19034875629012', accountName: 'CONG TY CO PHAN BINEX', limit: '5,000,000,000 đ / ngày', status: 'Active', type: 'Thanh toán & Chuyển tiền' },
  { id: 'BA-03', bankName: 'MB Bank (MB)', accountNo: '990234857620', accountName: 'CONG TY CO PHAN BINEX', limit: '2,000,000,000 đ / ngày', status: 'Inactive', type: 'Nhận tiền QR tự động' }
]);
</script>

<template>
  <div class="flex-1 flex flex-col min-w-0">
    <!-- Header Utility Bar -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div class="w-full max-w-md">
        <CmInput 
          v-model="searchQuery" 
          placeholder="Tìm theo ngân hàng, số tài khoản..." 
          icon="heroicons:magnifying-glass"
        />
      </div>
    </header>

    <!-- Page Title and actions -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
          Quản lý Tài khoản Ngân hàng (Supper)
        </h1>
        <p class="text-xs sm:text-sm text-zinc-400 dark:text-zinc-550 font-medium mt-2">
          Cấu hình và kiểm soát danh sách các tài khoản ngân hàng chính thức nhận tiền chuyển khoản của Binex.
        </p>
      </div>
      
      <div class="flex items-center gap-3 shrink-0">
        <CmButton variant="primary" icon="heroicons:plus" class="text-xs font-bold px-4 py-2.5">
          Thêm tài khoản ngân hàng
        </CmButton>
      </div>
    </section>

    <!-- Active official receiving accounts -->
    <h3 class="text-base font-black text-zinc-800 dark:text-white mb-4">Danh sách Tài khoản Ngân hàng Hệ thống</h3>
    <div class="overflow-x-auto border border-zinc-150/80 dark:border-zinc-850 rounded-[2rem] bg-white dark:bg-zinc-955 no-scrollbar">
      <table class="w-full border-collapse text-left min-w-[850px]">
        <thead>
          <tr class="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-100 dark:border-zinc-850 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider select-none">
            <th class="px-5 py-4">Mã TK</th>
            <th class="px-5 py-4">Ngân hàng</th>
            <th class="px-5 py-4">Số tài khoản</th>
            <th class="px-5 py-4">Tên chủ tài khoản</th>
            <th class="px-5 py-4">Hạn mức / ngày</th>
            <th class="px-5 py-4">Loại hình sử dụng</th>
            <th class="px-5 py-4">Trạng thái</th>
            <th class="px-5 py-4 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 dark:divide-zinc-900 text-xs font-semibold text-zinc-650 dark:text-zinc-300">
          <tr v-for="bank in bankAccounts" :key="bank.id" class="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
            <td class="px-5 py-4 font-mono font-bold text-zinc-800 dark:text-zinc-100">#{{ bank.id }}</td>
            <td class="px-5 py-4 font-bold text-zinc-800 dark:text-zinc-100">{{ bank.bankName }}</td>
            <td class="px-5 py-4 font-mono tracking-wider font-bold select-all text-zinc-800 dark:text-white">{{ bank.accountNo }}</td>
            <td class="px-5 py-4 text-zinc-600 dark:text-zinc-350">{{ bank.accountName }}</td>
            <td class="px-5 py-4 text-zinc-500 dark:text-zinc-400">{{ bank.limit }}</td>
            <td class="px-5 py-4">
              <span class="px-2 py-0.5 rounded text-[10px] bg-primary/5 text-primary dark:bg-primary/10 border border-primary/10">
                {{ bank.type }}
              </span>
            </td>
            <td class="px-5 py-4">
              <span 
                class="inline-flex items-center gap-1.5 text-[10px] font-bold"
                :class="bank.status === 'Active' ? 'text-emerald-500' : 'text-zinc-400'"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                {{ bank.status }}
              </span>
            </td>
            <td class="px-5 py-4 text-right">
              <CmButton 
                variant="outline" 
                class="h-8 text-[10px] border-zinc-150 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 font-bold px-3 py-1"
              >
                Cấu hình cổng
              </CmButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
