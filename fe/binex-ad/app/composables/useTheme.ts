import { ref, onMounted, watch } from 'vue';

export interface ColorPreset {
  id: string;
  name: string;
  lightRgb: string; // e.g., "15 169 88"
  darkRgb: string;  // e.g., "16 185 129"
  hex: string;      // e.g., "#0FA958"
}

export const colorPresets: ColorPreset[] = [
  { id: 'green', name: 'Binex Green', lightRgb: '15 169 88', darkRgb: '16 185 129', hex: '#0FA958' },
  { id: 'indigo', name: 'Classic Indigo', lightRgb: '79 70 229', darkRgb: '129 140 248', hex: '#4F46E5' },
  { id: 'blue', name: 'Ocean Blue', lightRgb: '14 165 233', darkRgb: '56 189 248', hex: '#0EA5E9' },
  { id: 'purple', name: 'Royal Purple', lightRgb: '124 58 237', darkRgb: '167 139 250', hex: '#7C3AED' },
  { id: 'orange', name: 'Sunset Orange', lightRgb: '249 115 22', darkRgb: '251 146 60', hex: '#F97316' },
  { id: 'rose', name: 'Rose Pink', lightRgb: '236 72 153', darkRgb: '244 114 182', hex: '#EC4899' }
];

const selectedPresetId = ref('green');
const customColorHex = ref('#0FA958');
const isSettingsOpen = ref(false);

export function useTheme() {
  const applyTheme = () => {
    if (import.meta.server) return;
    
    let lightRgb = '';
    let darkRgb = '';
    
    if (selectedPresetId.value === 'custom') {
      // Parse custom hex to rgb
      const rgb = hexToRgb(customColorHex.value);
      if (rgb) {
        lightRgb = `${rgb.r} ${rgb.g} ${rgb.b}`;
        // Make dark mode version slightly brighter/saturated
        darkRgb = lightRgb; 
      } else {
        lightRgb = '15 169 88';
        darkRgb = '16 185 129';
      }
    } else {
      const preset = colorPresets.find(p => p.id === selectedPresetId.value) || colorPresets[0];
      lightRgb = preset.lightRgb;
      darkRgb = preset.darkRgb;
    }
    
    // Set custom properties
    const root = document.documentElement;
    root.style.setProperty('--color-primary', lightRgb);
    // If dark mode class is active, we can set it similarly, or Tailwind handles standard var
    // Since --color-primary is read inside tailwind classes, setting it on root works globally!
  };

  const setPreset = (id: string) => {
    selectedPresetId.value = id;
    if (id !== 'custom') {
      const p = colorPresets.find(preset => preset.id === id);
      if (p) customColorHex.value = p.hex;
    }
    applyTheme();
    localStorage.setItem('binex-theme-preset', id);
  };

  const setCustomHex = (hex: string) => {
    selectedPresetId.value = 'custom';
    customColorHex.value = hex;
    applyTheme();
    localStorage.setItem('binex-theme-preset', 'custom');
    localStorage.setItem('binex-theme-custom-hex', hex);
  };

  // Helper helper
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Load from local storage
  const initTheme = () => {
    if (import.meta.server) return;
    
    const savedPreset = localStorage.getItem('binex-theme-preset');
    const savedCustomHex = localStorage.getItem('binex-theme-custom-hex');
    
    if (savedPreset) {
      selectedPresetId.value = savedPreset;
      if (savedPreset === 'custom' && savedCustomHex) {
        customColorHex.value = savedCustomHex;
      } else {
        const p = colorPresets.find(preset => preset.id === savedPreset);
        if (p) customColorHex.value = p.hex;
      }
    }
    applyTheme();
  };

  return {
    selectedPresetId,
    customColorHex,
    isSettingsOpen,
    colorPresets,
    setPreset,
    setCustomHex,
    initTheme,
    applyTheme
  };
}
