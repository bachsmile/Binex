<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  path: '/supper/finance/binex-wallet',
  layout: 'supper'
});

const searchQuery = ref('');

const metrics = ref([
  { name: 'Tổng số dư quỹ Binex', value: '1,250,900,000,000 đ', change: '+12.5%', isUp: true, desc: 'Tất cả tài khoản chuyển tiền', icon: 'heroicons:banknotes' },
  { name: 'Doanh thu cổng thanh toán', value: '452,180,000 đ', change: '+8.2%', isUp: true, desc: 'Thu phí giao dịch nạp rút', icon: 'heroicons:arrow-trending-up' },
  { name: 'Quỹ bảo chứng (USD)', value: '$5,290,000', change: '+0.1%', isUp: true, desc: 'Bảo chứng tài chính số', icon: 'heroicons:shield-check' }
]);

const reserves = ref([
  { id: 'R1', name: 'Ví đối soát Techcombank', code: 'VND', balance: 580000000000, status: 'Connected', updateAt: '5 phút trước' },
  { id: 'R2', name: 'Ví thanh khoản Vietcombank', code: 'VND', balance: 420000000000, status: 'Connected', updateAt: '12 phút trước' },
  { id: 'R3', name: 'Ví lạnh lưu trữ Sandbox', code: 'USD', balance: 2500000, status: 'Secured', updateAt: '1 ngày trước' }
]);
</script>

<template>
  <div class="flex-1 flex flex-col min-w-0">
    <!-- Header Utilities -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div class="w-full max-w-md">
        <CmInput 
          v-model="searchQuery" 
          placeholder="Tìm kiếm giao dịch quỹ, ví..." 
          icon="heroicons:magnifying-glass"
        />
      </div>
    </header>

    <!-- Welcome & Page title -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
          Hệ thống Ví Binex (Supper)
        </h1>
        <p class="text-xs sm:text-sm text-zinc-400 dark:text-zinc-550 font-medium mt-2">
          Theo dõi tổng doanh thu, quỹ thanh khoản đảm bảo và số dư lưu trữ của hệ thống.
        </p>
      </div>
      
      <div class="flex items-center gap-3 shrink-0">
        <CmButton variant="primary" icon="heroicons:arrow-path" class="text-xs font-bold px-4 py-2.5">
          Đối soát quỹ
        </CmButton>
      </div>
    </section>

    <!-- Top balance widgets -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div 
        v-for="item in metrics" 
        :key="item.name"
        class="p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] flex items-center justify-between shadow-sm"
      >
        <div class="space-y-2">
          <p class="text-[11px] font-bold text-zinc-400 uppercase tracking-wider leading-none">{{ item.name }}</p>
          <h3 class="text-2xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">{{ item.value }}</h3>
          <p class="text-[10px] text-zinc-450 dark:text-zinc-500 font-semibold">{{ item.desc }}</p>
        </div>
        <div class="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-2xl flex items-center justify-center">
          <Icon :name="item.icon" class="text-xl" />
        </div>
      </div>
    </div>

    <!-- Active Platforms Reserves -->
    <h3 class="text-base font-black text-zinc-800 dark:text-white mb-4">Danh sách Quỹ lưu trữ thanh khoản</h3>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div 
        v-for="res in reserves" 
        :key="res.id"
        class="p-6 rounded-[2rem] border border-zinc-100/60 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-900/40 relative overflow-hidden flex flex-col justify-between h-[155px]"
      >
        <div class="flex items-start justify-between">
          <div class="space-y-0.5">
            <h4 class="text-xs font-bold text-zinc-800 dark:text-zinc-200">{{ res.name }}</h4>
            <span class="text-[9px] font-bold text-zinc-400 font-mono">ID: #{{ res.id }}</span>
          </div>
          <span class="text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 px-2.5 py-0.5 rounded-full select-none font-sans uppercase">
            {{ res.status }}
          </span>
        </div>
        <div class="mt-4">
          <div class="text-[20px] font-black text-zinc-900 dark:text-white leading-none tracking-tight">
            {{ res.code === 'USD' ? '$' + res.balance.toLocaleString() : res.balance.toLocaleString() + ' đ' }}
          </div>
          <span class="inline-block text-[9px] font-bold mt-2.5 text-zinc-400">
            Cập nhật: {{ res.updateAt }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
