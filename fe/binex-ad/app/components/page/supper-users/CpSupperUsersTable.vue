<script setup lang="ts">
import type { User } from '~/types/user';

const page = defineModel<number>('page', { default: 1 });
const limit = defineModel<number>('limit', { default: 10 });

defineProps<{
  total: number;
  items: User[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'clear-filters'): void;
  (e: 'view-details', user: User): void;
}>();

const tableHeaders = [
  { key: 'profile', label: 'Hồ sơ người dùng' },
  { key: 'role', label: 'Vai trò' },
  { key: 'contact', label: 'Liên hệ' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'permissions', label: 'Quyền hạn' },
  { key: 'createdAt', label: 'Ngày tham gia' },
  { key: 'actions', label: 'Hành động', class: 'text-right', cellClass: 'text-right' }
];

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
  <CmTable
    v-model:page="page"
    v-model:limit="limit"
    :total="total"
    :headers="tableHeaders"
    :items="items"
    :loading="loading"
    label="tài khoản"
    empty-text="Không tìm thấy người dùng nào"
    empty-subtext="Hãy thử thay đổi từ khóa tìm kiếm hoặc lọc các bộ phận và trạng thái khác để tìm kết quả."
    @clear-filters="emit('clear-filters')"
  >
    <!-- Custom slot: profile -->
    <template #profile="{ item: user }">
      <div class="flex items-center gap-3.5 cursor-pointer group/profile" @click="emit('view-details', user)">
        <el-avatar
          :src="user.avatar || 'https://api.dicebear.com/9.x/avataaars/svg?seed=' + user.id"
          :size="36"
          class="shrink-0 font-bold bg-primary/10 text-primary border border-zinc-150/80 dark:border-zinc-800 shadow-sm transition-transform group-hover/profile:scale-105"
        />
        <div class="flex flex-col">
          <span class="text-[13px] font-bold text-zinc-850 dark:text-zinc-100 group-hover/profile:text-primary transition-colors">
            {{ user.userName || 'Chưa cập nhật' }}
          </span>
          <span v-if="user.fullName" class="text-xs text-zinc-400 dark:text-zinc-555 font-medium">
            @{{ user.fullName }}
          </span>
        </div>
      </div>
    </template>

    <!-- Custom slot: role -->
    <template #role="{ item: user }">
      <span 
        class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase select-none tracking-wide"
        :class="{
          'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-100/50 dark:border-emerald-900/30': user.role === 'super_admin',
          'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-405 border border-blue-100/50 dark:border-blue-900/30': user.role === 'admin',
          'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-405 border border-indigo-100/50 dark:border-indigo-900/30': user.role === 'manager',
          'bg-zinc-50 text-zinc-550 dark:bg-zinc-900 dark:text-zinc-400 border border-zinc-150 dark:border-zinc-800': user.role === 'user'
        }"
      >
        {{ user.role }}
      </span>
    </template>

    <!-- Custom slot: contact -->
    <template #contact="{ item: user }">
      <div class="flex flex-col text-xs font-semibold">
        <span class="text-zinc-700 dark:text-zinc-300">{{ user.email || 'N/A' }}</span>
        <span class="text-zinc-400 dark:text-zinc-550 text-[10px] mt-0.5 font-medium">{{ user.phone || 'N/A' }}</span>
      </div>
    </template>

    <!-- Custom slot: status -->
    <template #status="{ item: user }">
      <div class="flex items-center gap-1.5 select-none">
        <span 
          class="w-1.5 h-1.5 rounded-full animate-pulse"
          :class="{
            'bg-primary': user.status === 'active',
            'bg-amber-500': user.status === 'pending',
            'bg-red-500': user.status === 'inactive'
          }"
        ></span>
        <span 
          class="text-[11px] font-bold capitalize"
          :class="{
            'text-primary': user.status === 'active',
            'text-amber-500 dark:text-amber-400': user.status === 'pending',
            'text-red-500 dark:text-red-400': user.status === 'inactive'
          }"
        >
          {{ user.status }}
        </span>
      </div>
    </template>

    <!-- Custom slot: permissions -->
    <template #permissions="{ item: user }">
      <div class="flex flex-wrap gap-1.5 max-w-[200px]">
        <span 
          v-for="sub in user.userSubscriptions" 
          :key="sub.id"
          class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase select-none border"
          :class="sub.packId 
            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-emerald-450 border-amber-100/50 dark:border-emerald-900/30' 
            : 'bg-primary/5 text-primary dark:bg-primary/10 border-primary/20'"
          :title="sub.expiredAt ? `Hết hạn: ${formatDate(sub.expiredAt)}` : 'Vĩnh viễn'"
        >
          {{ sub.packId || 'Đăng ký' }}
        </span>
        <span 
          v-if="!user.userSubscriptions || user.userSubscriptions.length === 0"
          class="text-[11px] text-zinc-400 dark:text-zinc-555 font-medium italic"
        >
          Chưa đăng ký gói
        </span>
      </div>
    </template>

    <!-- Custom slot: createdAt -->
    <template #createdAt="{ item: user }">
      <span class="text-xs text-zinc-450 dark:text-zinc-550 font-semibold">
        {{ formatDate(user.createdAt) }}
      </span>
    </template>

    <!-- Custom slot: actions -->
    <template #actions="{ item: user }">
      <div class="inline-flex items-center gap-2">
        <CmButton 
          variant="outline" 
          icon="heroicons:eye" 
          class="h-8 text-[11px] border-zinc-150 dark:border-zinc-800 font-bold px-3 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-655 dark:text-zinc-300"
          title="Chi tiết tài khoản"
          @click="emit('view-details', user)"
        >
          Chi tiết
        </CmButton>
        <CmButton 
          variant="ghost" 
          icon="heroicons:ellipsis-horizontal" 
          iconOnly 
          class="w-8 h-8 rounded-full text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200"
        />
      </div>
    </template>
  </CmTable>
</template>
