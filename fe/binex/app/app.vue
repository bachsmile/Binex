<script setup>
// Initialize theme
const { activeTheme } = useTheme();
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <MouseFollower />
</template>

<style>
/* Smooth transitions for theme changes */
* {
  @apply transition-colors duration-300;
}

body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  @apply bg-surface text-content;
}
</style>
