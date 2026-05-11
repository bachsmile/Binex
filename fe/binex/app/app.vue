<script setup>
import CiAuthModal from '~/components/integrations/CiAuthModal.vue'
import CiPackageModal from '~/components/integrations/CiPackageModal.vue'
import CiCreateWalletModal from '~/components/integrations/CiCreateWalletModal.vue'
import CiDepositModal from '~/components/integrations/CiDepositModal.vue'
import { useUserApi } from '~/api/user'

// Initialize user state
const { setUser } = useUser();
const userApi = useUserApi();
const authToken = useCookie('auth_token');
const userIdCookie = useCookie('user_id');

onMounted(async () => {
  if (authToken.value && userIdCookie.value) {
    const response = await userApi.findOne(userIdCookie.value);
    if (response?.data) {
      setUser(response.data);
    }
  }
});

// Initialize theme
const { activeTheme } = useTheme();
</script>

<template>
  <NuxtLayout>
    <NuxtPage :page-key="route => route.fullPath" />
  </NuxtLayout>
  
  <!-- Render Auth Modal -->
  <CiAuthModal />
  <CiPackageModal />
  <CiCreateWalletModal />
  <CiDepositModal />
  
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
