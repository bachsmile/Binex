<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

const props = defineProps<{
  modelValue?: string;
  disabled?: boolean;
  error?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'complete', value: string): void;
}>();

const digits = ref<string[]>(Array(6).fill(''));
const inputRefs = ref<HTMLInputElement[]>([]);

// Sync from modelValue prop
watch(() => props.modelValue, (val) => {
  const str = (val || '').replace(/\D/g, '').slice(0, 6);
  for (let i = 0; i < 6; i++) {
    digits.value[i] = str[i] || '';
  }
}, { immediate: true });

function emitValue() {
  const pin = digits.value.join('');
  emit('update:modelValue', pin);
  if (pin.length === 6) {
    emit('complete', pin);
  }
}

function handleInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement;
  const val = target.value.replace(/\D/g, '');
  
  if (val.length > 1) {
    // Handle paste into single box
    const chars = val.slice(0, 6 - index).split('');
    chars.forEach((ch, i) => {
      if (index + i < 6) {
        digits.value[index + i] = ch;
      }
    });
    emitValue();
    nextTick(() => {
      const nextIdx = Math.min(index + chars.length, 5);
      inputRefs.value[nextIdx]?.focus();
    });
    return;
  }

  digits.value[index] = val;
  emitValue();

  if (val && index < 5) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus();
    });
  }
}

function handleKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace') {
    if (!digits.value[index] && index > 0) {
      digits.value[index - 1] = '';
      emitValue();
      nextTick(() => {
        inputRefs.value[index - 1]?.focus();
      });
    } else {
      digits.value[index] = '';
      emitValue();
    }
    event.preventDefault();
  } else if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus();
  } else if (event.key === 'ArrowRight' && index < 5) {
    inputRefs.value[index + 1]?.focus();
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault();
  const paste = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6);
  paste.split('').forEach((ch, i) => {
    digits.value[i] = ch;
  });
  emitValue();
  nextTick(() => {
    const focusIdx = Math.min(paste.length, 5);
    inputRefs.value[focusIdx]?.focus();
  });
}

function handleFocus(event: FocusEvent) {
  (event.target as HTMLInputElement)?.select();
}

function setRef(el: any, index: number) {
  if (el) inputRefs.value[index] = el;
}
</script>

<template>
  <div class="flex items-center gap-2.5">
    <input
      v-for="(_, index) in 6"
      :key="index"
      :ref="(el) => setRef(el, index)"
      type="text"
      inputmode="numeric"
      maxlength="1"
      :value="digits[index]"
      :disabled="disabled"
      class="cm-pin-box"
      :class="{
        'cm-pin-box--filled': digits[index],
        'cm-pin-box--error': error,
        'cm-pin-box--disabled': disabled,
      }"
      @input="handleInput(index, $event)"
      @keydown="handleKeydown(index, $event)"
      @paste="handlePaste"
      @focus="handleFocus"
    />
  </div>
</template>

<style scoped>
.cm-pin-box {
  width: 44px;
  height: 48px;
  border-radius: 12px;
  border: 1.5px solid rgb(228 228 231 / 0.8);
  background: rgb(250 250 250 / 0.5);
  text-align: center;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: rgb(39 39 42);
  outline: none;
  transition: all 0.2s ease;
  caret-color: transparent;
  -webkit-text-security: disc;
}

.dark .cm-pin-box {
  border-color: rgb(63 63 70 / 0.6);
  background: rgb(24 24 27 / 0.5);
  color: rgb(244 244 245);
}

.cm-pin-box:focus {
  border-color: var(--color-primary, rgb(99 102 241));
  box-shadow: 0 0 0 3px rgb(99 102 241 / 0.15);
  background: white;
}

.dark .cm-pin-box:focus {
  background: rgb(24 24 27);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 0.2);
}

.cm-pin-box--filled {
  border-color: var(--color-primary, rgb(99 102 241));
  background: rgb(99 102 241 / 0.04);
}

.dark .cm-pin-box--filled {
  background: rgb(99 102 241 / 0.08);
}

.cm-pin-box--error {
  border-color: rgb(239 68 68) !important;
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1) !important;
}

.cm-pin-box--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgb(244 244 245);
}

.dark .cm-pin-box--disabled {
  background: rgb(39 39 42 / 0.5);
}
</style>
