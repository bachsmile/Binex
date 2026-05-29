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
  <div class="space-y-4">
    <div class="flex items-center justify-between select-none">
      <h4 class="text-xs font-black text-zinc-455 dark:text-zinc-500 uppercase tracking-wider">
        Nhóm quyền & Gói dịch vụ đã cấp
      </h4>
    </div>

    <div v-if="user.userSubscriptions && user.userSubscriptions.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="sub in user.userSubscriptions" 
        :key="sub.id"
        class="p-5 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-150/60 dark:border-zinc-800/40 rounded-2xl flex flex-col justify-between"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
              <Icon name="heroicons:sparkles" class="text-base" />
            </div>
            <div>
              <h4 class="text-xs font-black text-zinc-800 dark:text-zinc-100">
                {{ sub.packId || 'Gói dịch vụ' }}
              </h4>
              <p class="text-[9px] text-zinc-400 mt-0.5">Mã đăng ký: #{{ sub.id.slice(0, 8) }}</p>
            </div>
          </div>
          <span class="text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full select-none font-sans uppercase">
            Hoạt động
          </span>
        </div>
        <div class="border-t border-zinc-100 dark:border-zinc-800/60 mt-4 pt-3 flex items-center justify-between text-xs">
          <span class="text-zinc-455 font-medium">Hạn sử dụng:</span>
          <span class="font-bold text-zinc-700 dark:text-zinc-300">
            {{ sub.expiredAt ? formatDate(sub.expiredAt) : 'Vĩnh viễn' }}
          </span>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] select-none">
      <Icon name="heroicons:shield-exclamation" class="text-3xl text-zinc-300 dark:text-zinc-700 mb-2" />
      <p class="text-xs text-zinc-450 dark:text-zinc-500 font-bold">Chưa đăng ký gói nào</p>
    </div>
  </div>
</template>
