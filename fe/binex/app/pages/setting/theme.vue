<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useTheme } from '../../composables/useTheme';

const { themes, currentThemeId, activeTheme } = useTheme();

const showCreateForm = ref(false);
const newTheme = reactive({
  name: '',
  fontFamily: 'Inter, sans-serif',
  light: {
    primary: '79 70 229',
    secondary: '236 72 153',
    surface: '255 255 255',
    content: '15 23 42',
  },
  dark: {
    primary: '129 140 248',
    secondary: '244 114 182',
    surface: '15 23 42',
    content: '248 250 252',
  }
});

const tailwindColors = [
  { name: 'Slate', color: '100 116 139' },
  { name: 'Gray', color: '107 114 128' },
  { name: 'Zinc', color: '113 113 122' },
  { name: 'Red', color: '239 68 68' },
  { name: 'Orange', color: '249 115 22' },
  { name: 'Amber', color: '245 158 11' },
  { name: 'Yellow', color: '234 179 8' },
  { name: 'Lime', color: '132 204 22' },
  { name: 'Green', color: '34 197 94' },
  { name: 'Emerald', color: '16 185 129' },
  { name: 'Teal', color: '20 184 166' },
  { name: 'Cyan', color: '6 182 212' },
  { name: 'Sky', color: '14 165 233' },
  { name: 'Blue', color: '59 130 246' },
  { name: 'Indigo', color: '99 102 241' },
  { name: 'Violet', color: '139 92 246' },
  { name: 'Purple', color: '168 85 247' },
  { name: 'Fuchsia', color: '192 38 211' },
  { name: 'Pink', color: '236 72 153' },
  { name: 'Rose', color: '244 63 94' },
];

const fonts = [
  { name: 'Sans Serif (Default)', value: 'Inter, system-ui, sans-serif' },
  { name: 'Serif', value: 'ui-serif, Georgia, serif' },
  { name: 'Monospace', value: 'ui-monospace, SFMono-Regular, monospace' },
  { name: 'Outfit', value: 'Outfit, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
];

const createTheme = () => {
  if (!newTheme.name) return;
  
  const id = Date.now().toString();
  themes.value.push({
    id,
    ...JSON.parse(JSON.stringify(newTheme))
  });
  
  currentThemeId.value = id;
  showCreateForm.value = false;
  
  // Reset form
  newTheme.name = '';
};

const deleteTheme = (id: string) => {
  if (id === 'default') return;
  themes.value = themes.value.filter(t => t.id !== id);
  if (currentThemeId.value === id) {
    currentThemeId.value = 'default';
  }
};

const selectTheme = (id: string) => {
  currentThemeId.value = id;
};

// Auto-generate surface based on primary for light/dark
const syncSurface = (mode: 'light' | 'dark') => {
  const primary = newTheme[mode].primary.split(' ');
  // For light mode, make it very light version of blue/primary
  if (mode === 'light') {
    newTheme.light.surface = '248 250 252'; // Default light
  } else {
    newTheme.dark.surface = '15 23 42'; // Default dark
  }
};
</script>

<template>
  <div class="max-w-6xl mx-auto p-8">
    <div class="flex justify-between items-center mb-12">
      <div>
        <h1 class="text-4xl font-black tracking-tight mb-2">Giao diện hệ thống</h1>
        <p class="text-content/60">Tùy chỉnh và quản lý bộ nhận diện thương hiệu của bạn.</p>
      </div>
      <button 
        @click="showCreateForm = !showCreateForm"
        class="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
      >
        <Icon :name="showCreateForm ? 'heroicons:x-mark' : 'heroicons:plus-circle'" class="text-xl" />
        {{ showCreateForm ? 'Hủy bỏ' : 'Tạo Theme Mới' }}
      </button>
    </div>

    <div v-if="showCreateForm" class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 bg-surface p-8 rounded-3xl border border-primary/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <!-- General Info -->
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-bold mb-2 opacity-70 uppercase tracking-wider">Tên Theme</label>
          <input 
            v-model="newTheme.name"
            type="text" 
            placeholder="Ví dụ: Ocean Breeze"
            class="w-full bg-surface border-2 border-primary/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm font-bold mb-2 opacity-70 uppercase tracking-wider">Kiểu chữ</label>
          <select 
            v-model="newTheme.fontFamily"
            class="w-full bg-surface border-2 border-primary/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
          >
            <option v-for="f in fonts" :key="f.value" :value="f.value">{{ f.name }}</option>
          </select>
        </div>
        <div class="pt-4">
          <button 
            @click="createTheme"
            class="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg disabled:opacity-50"
            :disabled="!newTheme.name"
          >
            Lưu Theme & Áp dụng
          </button>
        </div>
      </div>

      <!-- Colors Config -->
      <div v-for="mode in (['light', 'dark'] as const)" :key="mode" class="space-y-6 p-6 rounded-2xl bg-primary/5 border border-primary/5">
        <h3 class="font-black flex items-center gap-2 uppercase tracking-widest text-sm opacity-80">
          <Icon :name="mode === 'light' ? 'heroicons:sun' : 'heroicons:moon'" />
          Chế độ {{ mode === 'light' ? 'Sáng' : 'Tối' }}
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="text-xs font-bold opacity-60 mb-2 block">MÀU CHỦ ĐẠO (PRIMARY)</label>
            <div class="grid grid-cols-5 gap-2">
              <button 
                v-for="c in tailwindColors" 
                :key="c.color"
                @click="newTheme[mode].primary = c.color"
                class="w-8 h-8 rounded-full border-2 transition-transform hover:scale-125"
                :class="newTheme[mode].primary === c.color ? 'border-content scale-110' : 'border-transparent'"
                :style="`background-color: rgb(${c.color})`"
                :title="c.name"
              ></button>
            </div>
          </div>

          <div>
            <label class="text-xs font-bold opacity-60 mb-2 block">MÀU PHỤ (SECONDARY)</label>
            <div class="grid grid-cols-5 gap-2">
              <button 
                v-for="c in tailwindColors" 
                :key="c.color"
                @click="newTheme[mode].secondary = c.color"
                class="w-8 h-8 rounded-full border-2 transition-transform hover:scale-125"
                :class="newTheme[mode].secondary === c.color ? 'border-content scale-110' : 'border-transparent'"
                :style="`background-color: rgb(${c.color})`"
                :title="c.name"
              ></button>
            </div>
          </div>

          <div class="flex gap-4">
             <div class="flex-1">
                <label class="text-xs font-bold opacity-60 mb-2 block">MÀU NỀN</label>
                <div class="h-10 rounded-xl border-2 border-primary/10" :style="`background-color: rgb(${newTheme[mode].primary})`"></div>
                <p class="text-[10px] mt-1 opacity-50 italic">* Tự động theo màu chính</p>
             </div>
             <div class="flex-1 text-right">
                <label class="text-xs font-bold opacity-60 mb-2 block">MÀU CHỮ</label>
                <div class="h-10 rounded-xl border-2 border-primary/10" :style="`background-color: rgb(${newTheme[mode].secondary})`"></div>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Theme List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="theme in themes" 
        :key="theme.id"
        class="group relative bg-surface p-6 rounded-3xl border-2 transition-all cursor-pointer"
        :class="currentThemeId === theme.id ? 'border-primary shadow-2xl' : 'border-primary/5 hover:border-primary/20'"
        @click="selectTheme(theme.id)"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="font-bold text-lg">{{ theme.name }}</h3>
          <button 
            v-if="theme.id !== 'default'"
            @click.stop="deleteTheme(theme.id)"
            class="text-red-500 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all"
          >
            <Icon name="heroicons:trash" />
          </button>
        </div>

        <div class="flex gap-2 mb-4">
          <div class="w-full h-8 rounded-full flex overflow-hidden border border-primary/10">
            <div :style="`background-color: rgb(${theme.light.primary})`" class="w-1/4"></div>
            <div :style="`background-color: rgb(${theme.light.secondary})`" class="w-1/4"></div>
            <div :style="`background-color: rgb(${theme.dark.primary})`" class="w-1/4"></div>
            <div :style="`background-color: rgb(${theme.dark.secondary})`" class="w-1/4"></div>
          </div>
        </div>

        <div class="flex justify-between items-center text-xs opacity-60">
          <span>{{ theme.fontFamily.split(',')[0] }}</span>
          <span v-if="currentThemeId === theme.id" class="text-primary font-bold flex items-center gap-1">
            <Icon name="heroicons:check-circle" /> Đang sử dụng
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
