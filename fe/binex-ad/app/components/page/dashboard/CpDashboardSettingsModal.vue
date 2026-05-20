<script setup lang="ts">
import { useTheme } from '~/composables/useTheme';

const { 
  selectedPresetId, 
  customColorHex, 
  isSettingsOpen, 
  colorPresets, 
  setPreset, 
  setCustomHex 
} = useTheme();

const closeSettings = () => {
  isSettingsOpen.value = false;
};

const handleColorPicker = (e: Event) => {
  const target = e.target as HTMLInputElement;
  setCustomHex(target.value);
};
</script>

<template>
  <Transition name="fade-backdrop">
    <div 
      v-if="isSettingsOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md"
      @click.self="closeSettings"
    >
      <Transition name="scale-modal" appear>
        <div 
          class="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative"
          @click.stop
        >
          <!-- Close button -->
          <button 
            @click="closeSettings"
            class="absolute top-6 right-6 w-9 h-9 rounded-full bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-650 transition-colors flex items-center justify-center"
          >
            <Icon name="heroicons:x-mark" class="text-lg" />
          </button>

          <!-- Modal Header -->
          <div class="px-8 pt-8 pb-4">
            <h3 class="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Icon name="heroicons:paint-brush" class="text-primary" />
              <span>Theme Customization</span>
            </h3>
            <p class="text-xs text-zinc-400 dark:text-zinc-500 font-medium mt-1">
              Select or customize the primary color for the dashboard.
            </p>
          </div>

          <!-- Color List -->
          <div class="px-8 py-4 space-y-6">
            <div class="space-y-3">
              <label class="block text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-550 uppercase">
                Choose Color Preset
              </label>
              
              <div class="grid grid-cols-2 gap-3">
                <button 
                  v-for="preset in colorPresets" 
                  :key="preset.id"
                  @click="setPreset(preset.id)"
                  class="flex items-center gap-3 p-3.5 rounded-2xl border text-sm font-semibold transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/40 active:scale-97"
                  :class="selectedPresetId === preset.id 
                    ? 'border-primary/40 bg-primary/[0.03] text-primary dark:bg-primary/5' 
                    : 'border-zinc-100 dark:border-zinc-800 text-zinc-750 dark:text-zinc-350 bg-transparent'"
                >
                  <!-- Color Indicator Dot -->
                  <div 
                    class="w-5 h-5 rounded-full border border-white/20 shadow-sm shrink-0"
                    :style="{ backgroundColor: preset.hex }"
                  ></div>
                  <span class="truncate text-xs">{{ preset.name }}</span>
                </button>
              </div>
            </div>

            <!-- Custom Color Picker -->
            <div class="space-y-3 pt-2 border-t border-zinc-50 dark:border-zinc-800/60">
              <label class="block text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-550 uppercase">
                Custom Primary Color
              </label>
              
              <div 
                class="flex items-center gap-4 p-4 rounded-2xl border transition-all"
                :class="selectedPresetId === 'custom'
                  ? 'border-primary/40 bg-primary/[0.03] dark:bg-primary/5' 
                  : 'border-zinc-100 dark:border-zinc-800 bg-transparent'"
              >
                <div class="relative w-11 h-11 shrink-0 rounded-xl overflow-hidden shadow-sm border border-zinc-150 dark:border-zinc-750">
                  <input 
                    type="color" 
                    :value="customColorHex" 
                    @input="handleColorPicker"
                    class="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] cursor-pointer" 
                  />
                </div>
                
                <div class="flex-1 min-w-0">
                  <span class="block text-xs font-bold text-zinc-800 dark:text-zinc-200">Custom Color Value</span>
                  <span class="block text-[11px] font-mono text-zinc-450 dark:text-zinc-500 font-semibold uppercase mt-0.5">{{ customColorHex }}</span>
                </div>
                
                <CmButton 
                  v-if="selectedPresetId !== 'custom'"
                  variant="outline" 
                  size="sm"
                  @click="setPreset('custom')"
                >
                  Apply
                </CmButton>
                <span v-else class="text-xs font-bold text-primary flex items-center gap-1">
                  <Icon name="heroicons:check-circle-20-solid" class="text-base" />
                  <span>Active</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-8 py-6 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-50 dark:border-zinc-800 flex justify-end gap-3">
            <CmButton variant="outline" @click="closeSettings">Close</CmButton>
            <CmButton variant="primary" @click="closeSettings">Apply Theme</CmButton>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* Backdrop transition */
.fade-backdrop-enter-active,
.fade-backdrop-leave-active {
  transition: opacity 0.25s ease;
}
.fade-backdrop-enter-from,
.fade-backdrop-leave-to {
  opacity: 0;
}

/* Modal scale transition */
.scale-modal-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scale-modal-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}
.scale-modal-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}
.scale-modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
