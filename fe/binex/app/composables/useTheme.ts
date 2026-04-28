import { reactive, watch, onMounted, ref, computed } from 'vue';

export interface ThemeConfig {
  id: string;
  name: string;
  light: ModeConfig;
  dark: ModeConfig;
  fontFamily: string;
}

interface ModeConfig {
  primary: string; // hex or rgb
  secondary: string;
  surface: string;
  content: string;
}

export const useTheme = () => {
  const currentThemeId = useLocalStorage('theme-id', 'default');
  const themes = useLocalStorage<ThemeConfig[]>('user-themes', [
    {
      id: 'default',
      name: 'Default Theme',
      fontFamily: 'Inter, sans-serif',
      light: {
        primary: '79 70 229', // Indigo 600
        secondary: '236 72 153', // Pink 500
        surface: '255 255 255',
        content: '15 23 42',
      },
      dark: {
        primary: '129 140 248', // Indigo 400
        secondary: '244 114 182', // Pink 400
        surface: '15 23 42',
        content: '248 250 252',
      }
    }
  ]);

  const activeTheme = computed(() => themes.value.find(t => t.id === currentThemeId.value) || themes.value[0]);

  const applyTheme = (theme: ThemeConfig) => {
    if (!theme) return;

    const styles = `
      :root {
        --color-primary: ${theme.light.primary};
        --color-secondary: ${theme.light.secondary};
        --bg-surface-val: ${theme.light.surface};
        --color-content: ${theme.light.content};
        --font-family: ${theme.fontFamily};
      }
      .dark-mode {
        --color-primary: ${theme.dark.primary};
        --color-secondary: ${theme.dark.secondary};
        --bg-surface-val: ${theme.dark.surface};
        --color-content: ${theme.dark.content};
      }
      body {
        font-family: var(--font-family);
        background: var(--bg-surface-val);
        background-attachment: fixed;
      }
    `;

    if (process.client) {
      let styleTag = document.getElementById('dynamic-theme');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamic-theme';
        document.head.appendChild(styleTag);
      }
      styleTag.innerHTML = styles;
    }
  };

  watch(activeTheme, (newTheme) => {
    applyTheme(newTheme);
  }, { immediate: true, deep: true });

  onMounted(() => {
    applyTheme(activeTheme.value);
  });

  return {
    themes,
    currentThemeId,
    activeTheme,
    applyTheme
  };
};

// Simple localStorage helper if not using VueUse
function useLocalStorage<T>(key: string, defaultValue: T) {
  const data = ref<T>(defaultValue);

  if (process.client) {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        data.value = JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing localStorage', e);
      }
    }

    watch(data, (newVal) => {
      localStorage.setItem(key, JSON.stringify(newVal));
    }, { deep: true });
  }

  return data;
}
