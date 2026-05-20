<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  icon?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  label?: string;
  hint?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  required: false,
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur']);

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});
</script>

<template>
  <div class="flex flex-col w-full gap-1.5">
    <label v-if="label" :for="id" class="text-xs font-medium tracking-wider text-zinc-400 dark:text-zinc-550 ml-1 select-none">
      {{ label }}
    </label>
    
    <div class="relative flex items-center w-full group">
      <el-input
        :id="id"
        :type="type === 'number' ? 'number' : 'text'"
        v-model="value"
        :placeholder="placeholder"
        :disabled="disabled"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
        class="w-full custom-el-input"
      >
        <template #prefix v-if="icon">
          <Icon :name="icon" class="text-base text-zinc-450 mr-1" />
        </template>
      </el-input>
      
      <!-- Hint Right (e.g. ⌘K) -->
      <div v-if="hint" class="absolute right-3.5 px-2 py-0.5 text-[10px] font-medium text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800 rounded-md pointer-events-none font-mono z-10">
        {{ hint }}
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-input__wrapper) {
  background-color: rgba(250, 250, 250, 0.5) !important;
  box-shadow: 0 0 0 1px rgb(228, 228, 231) inset !important;
  border-radius: 12px !important;
  padding: 10px 14px !important;
  transition: all 0.2s ease-in-out !important;
}

:deep(.dark-mode .el-input__wrapper) {
  background-color: rgba(24, 24, 27, 0.3) !important;
  box-shadow: 0 0 0 1px rgb(39, 39, 42) inset !important;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgb(161 161 170) inset !important;
}

:deep(.dark-mode .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgb(82 82 91) inset !important;
}

:deep(.el-input__wrapper.is-focus) {
  background-color: #ffffff !important;
  box-shadow: 0 0 0 1px #10b981 inset, 0 0 0 4px rgba(16, 185, 129, 0.1) !important;
}

:deep(.dark-mode .el-input__wrapper.is-focus) {
  background-color: #09090b !important;
  box-shadow: 0 0 0 1px #10b981 inset, 0 0 0 4px rgba(16, 185, 129, 0.15) !important;
}

:deep(.el-input__inner) {
  font-family: inherit !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  color: rgb(39 39 42) !important;
}

:deep(.dark-mode .el-input__inner) {
  color: rgb(244 244 245) !important;
}
</style>
