<script setup lang="ts">
withDefaults(defineProps<{
  title?: string;
  description?: string;
  imageSize?: number;
}>(), {
  imageSize: 80
});
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center p-8 select-none mx-auto max-w-sm">
    <el-empty 
      :image-size="imageSize"
      class="!p-0"
    >
      <template #description>
        <div class="mt-4">
          <h3 class="text-sm font-black text-zinc-800 dark:text-zinc-200 tracking-tight">
            {{ title || 'Không có dữ liệu' }}
          </h3>
          <p class="text-xs text-zinc-450 dark:text-zinc-550 font-semibold mt-1.5 leading-relaxed max-w-[280px]">
            {{ description || 'Danh sách hiện tại đang trống rỗng.' }}
          </p>
        </div>
      </template>
      
      <!-- Slot for custom actions inside Element Plus empty container -->
      <slot />
    </el-empty>
  </div>
</template>

<style scoped>
:deep(.el-empty__image) {
  opacity: 0.85;
  filter: drop-shadow(0 4px 12px rgba(99, 102, 241, 0.08));
}
.dark :deep(.el-empty__image) {
  opacity: 0.65;
  filter: drop-shadow(0 4px 12px rgba(99, 102, 241, 0.15)) invert(0.9) hue-rotate(180deg);
}
</style>
