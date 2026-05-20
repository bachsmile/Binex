<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';

const props = withDefaults(defineProps<{
  modelValue?: string;
  placeholder?: string;
  rows?: number;
  maxlength?: number;
}>(), {
  modelValue: '',
  placeholder: 'Nhập nội dung mô tả...',
  rows: 4,
  maxlength: 1000
});

const emit = defineEmits(['update:modelValue']);

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const charCount = computed(() => props.modelValue ? props.modelValue.length : 0);

const onInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};

// Insert markdown helpers at cursor position
const insertTag = (before: string, after: string = '') => {
  const el = textareaRef.value;
  if (!el) return;

  const start = el.selectionStart;
  const end = el.selectionEnd;
  const text = props.modelValue;

  const selected = text.substring(start, end);
  const replacement = before + selected + after;

  emit('update:modelValue', text.substring(0, start) + replacement + text.substring(end));

  // Auto-focus and place cursor/selection
  nextTick(() => {
    el.focus();
    const newCursorPos = start + before.length;
    if (selected) {
      el.setSelectionRange(newCursorPos, newCursorPos + selected.length);
    } else {
      el.setSelectionRange(newCursorPos, newCursorPos);
    }
  });
};
</script>

<template>
  <div class="w-full flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden focus-within:ring-2 focus-within:ring-primary/25 focus-within:border-primary/50 transition-all">
    <!-- Formatting Toolbar -->
    <div class="flex items-center gap-1 px-3 py-1.5 border-b border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/30 select-none">
      <button 
        type="button"
        @click="insertTag('**', '**')"
        title="Chữ đậm"
        class="p-1 rounded hover:bg-zinc-200/50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
      >
        <Icon name="heroicons:bold" class="text-sm sm:text-base" />
      </button>
      <button 
        type="button"
        @click="insertTag('*', '*')"
        title="Chữ nghiêng"
        class="p-1 rounded hover:bg-zinc-200/50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
      >
        <Icon name="heroicons:italic" class="text-sm sm:text-base" />
      </button>
      <div class="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
      <button 
        type="button"
        @click="insertTag('- ')"
        title="Danh sách gạch đầu dòng"
        class="p-1 rounded hover:bg-zinc-200/50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
      >
        <Icon name="heroicons:list-bullet" class="text-sm sm:text-base" />
      </button>
      <button 
        type="button"
        @click="insertTag('[', '](url)')"
        title="Liên kết URL"
        class="p-1 rounded hover:bg-zinc-200/50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
      >
        <Icon name="heroicons:link" class="text-xs sm:text-sm" />
      </button>
      <button 
        type="button"
        @click="insertTag('`', '`')"
        title="Đoạn mã code"
        class="p-1 rounded hover:bg-zinc-200/50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
      >
        <Icon name="heroicons:code-bracket" class="text-sm sm:text-base" />
      </button>
    </div>

    <!-- Textarea Input Area -->
    <textarea
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :maxlength="maxlength"
      @input="onInput"
      class="w-full px-4 py-3 text-xs sm:text-sm font-medium bg-transparent text-zinc-800 dark:text-zinc-200 outline-none resize-none placeholder-zinc-400 dark:placeholder-zinc-600"
    ></textarea>

    <!-- Footer Bar -->
    <div class="px-4 py-1.5 border-t border-zinc-150/40 dark:border-zinc-850/40 flex items-center justify-between text-[10px] font-bold text-zinc-400 select-none">
      <span class="flex items-center gap-1 text-zinc-400/80">
        <Icon name="heroicons:information-circle" class="text-xs" />
        Hỗ trợ định dạng Markdown
      </span>
      <span>{{ charCount }} / {{ maxlength }} ký tự</span>
    </div>
  </div>
</template>
