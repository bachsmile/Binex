<script setup lang="ts">
import type { User } from '~/types/user';

defineProps<{
  user: User;
}>();

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Profile Card -->
    <div class="p-6 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-150/60 dark:border-zinc-800/40 rounded-[2rem] flex flex-col items-center text-center">
      <el-avatar
        :src="user.avatar || 'https://api.dicebear.com/9.x/avataaars/svg?seed=' + user.id"
        :size="80"
        class="font-bold bg-primary/10 text-primary border border-zinc-200 dark:border-zinc-800 shadow-md mb-4"
      />
      <h3 class="text-base font-black text-zinc-900 dark:text-white leading-tight">
        {{ user.userName }}
      </h3>
      <p v-if="user.fullName" class="text-xs text-zinc-450 dark:text-zinc-500 font-bold mt-1">
        @{{ user.fullName }}
      </p>
      <span 
        class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase select-none tracking-wide mt-3"
        :class="{
          'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-100/50 dark:border-emerald-900/30': user.role === 'super_admin',
          'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-405 border border-blue-100/50 dark:border-blue-900/30': user.role === 'admin',
          'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-405 border border-indigo-100/50 dark:border-indigo-900/30': user.role === 'manager',
          'bg-zinc-50 text-zinc-550 dark:bg-zinc-900 dark:text-zinc-400 border border-zinc-150 dark:border-zinc-800': user.role === 'user'
        }"
      >
        {{ user.role }}
      </span>

      <div class="w-full border-t border-zinc-100 dark:border-zinc-850 mt-6 pt-5 space-y-3.5 text-xs text-left">
        <div class="flex items-center justify-between">
          <span class="text-zinc-400 font-semibold">Trạng thái:</span>
          <span class="font-extrabold capitalize text-primary">{{ user.status }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-zinc-400 font-semibold">Ngày tham gia:</span>
          <span class="font-bold text-zinc-655 dark:text-zinc-300">{{ formatDate(user.createdAt) }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-zinc-400 font-semibold">Mã quản lý:</span>
          <span class="font-bold text-zinc-655 dark:text-zinc-300 font-mono text-[10px]">{{ user.code || 'N/A' }}</span>
        </div>
      </div>
    </div>

    <!-- Detailed Information Grid -->
    <div class="lg:col-span-2 p-6 border border-zinc-150/80 dark:border-zinc-850 rounded-[2rem] space-y-6">
      <div>
        <h4 class="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 select-none">Thông tin liên hệ</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100/60 dark:border-zinc-800/40 rounded-2xl">
            <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Địa chỉ Email</p>
            <p class="text-xs font-bold text-zinc-850 dark:text-zinc-200 mt-1 select-all">{{ user.email || 'Chưa liên kết' }}</p>
          </div>
          <div class="p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100/60 dark:border-zinc-800/40 rounded-2xl">
            <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Số điện thoại</p>
            <p class="text-xs font-bold text-zinc-850 dark:text-zinc-200 mt-1 select-all">{{ user.phone || 'Chưa liên kết' }}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 class="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 select-none">Địa chỉ & Vùng miền</h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100/60 dark:border-zinc-800/40 rounded-2xl">
            <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Thành phố / Tỉnh</p>
            <p class="text-xs font-bold text-zinc-850 dark:text-zinc-200 mt-1">{{ user.city || 'N/A' }}</p>
          </div>
          <div class="p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100/60 dark:border-zinc-800/40 rounded-2xl">
            <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Quốc gia</p>
            <p class="text-xs font-bold text-zinc-850 dark:text-zinc-200 mt-1">{{ user.country || 'N/A' }}</p>
          </div>
          <div class="p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100/60 dark:border-zinc-800/40 rounded-2xl">
            <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Mã Bưu Điện (ZIP)</p>
            <p class="text-xs font-bold text-zinc-850 dark:text-zinc-200 mt-1">{{ user.zip || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 class="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 select-none">Dung lượng bộ nhớ lưu trữ</h4>
        <div class="p-4 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100/60 dark:border-zinc-800/40 rounded-2xl">
          <div class="flex items-center justify-between text-xs mb-2">
            <span class="text-zinc-500 font-semibold">Đã sử dụng: <strong class="text-zinc-800 dark:text-white">{{ (user.usedStorage || 0).toLocaleString() }} MB</strong></span>
            <span class="text-zinc-450 font-medium">Tổng hạn mức: {{ (user.storageLimit || 0).toLocaleString() }} MB</span>
          </div>
          <!-- Progress bar -->
          <div class="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              class="h-full bg-primary transition-all duration-500"
              :style="{ width: `${Math.min(100, ((user.usedStorage || 0) / (user.storageLimit || 1)) * 100)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
