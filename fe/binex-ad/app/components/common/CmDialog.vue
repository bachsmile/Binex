<script setup lang="ts">
const isOpen = defineModel<boolean>('isOpen', { default: false });

const props = withDefaults(defineProps<{
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}>(), {
  title: '',
  size: 'md',
});

const close = () => {
  isOpen.value = false;
};
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 dark:bg-zinc-950/60 backdrop-blur-sm"
      @click.self="close"
    >
      <div 
        class="bg-white dark:bg-zinc-950 border border-zinc-150/80 dark:border-zinc-850 rounded-[2rem] shadow-xl overflow-hidden w-full flex flex-col transition-all duration-300 max-h-[90vh]"
        :class="{
          'max-w-md': size === 'sm',
          'max-w-2xl': size === 'md',
          'max-w-4xl': size === 'lg',
          'max-w-6xl': size === 'xl',
        }"
      >
        <!-- Dialog Header -->
        <div class="px-8 pt-7 pb-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 shrink-0 select-none">
          <h3 class="text-base font-bold text-zinc-900 dark:text-white leading-none">
            {{ title }}
          </h3>
          <button 
            class="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            @click="close"
          >
            <Icon name="heroicons:x-mark" class="text-lg" />
          </button>
        </div>

        <!-- Dialog Content (Scrollable) -->
        <div class="px-8 py-6 overflow-y-auto flex-1 min-h-0 text-zinc-700 dark:text-zinc-300">
          <slot></slot>
        </div>

        <!-- Dialog Footer -->
        <div class="px-8 py-5 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-950/10 flex items-center justify-end gap-3 shrink-0">
          <slot name="footer">
            <CmButton variant="ghost" size="sm" class="text-xs font-semibold px-4" @click="close">
              Hủy
            </CmButton>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-enter-active > div,
.fade-leave-active > div {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-from > div,
.fade-leave-to > div {
  transform: scale(0.95);
  opacity: 0;
}
</style>
