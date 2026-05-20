import type { User } from "~/types/response/user";

export const useUser = () => {
  const user = useState<User | null>("user-info", () => null);

  const isCreateWalletModalOpen = useState(
    "create-wallet-modal-open",
    () => false,
  );

  const setUser = (userData: User | null) => {
    user.value = userData;
  };

  const clearUser = () => {
    user.value = null;
  };

  const openCreateWalletModal = () => {
    isCreateWalletModalOpen.value = true;
  };

  const closeCreateWalletModal = () => {
    isCreateWalletModalOpen.value = false;
  };

  const hasWallet = computed(() => {
    return (user.value?.walletIds?.length ?? 0) > 0;
  });

  const depositData = useState<{
    packageId?: string;
    serviceId?: string;
    amount?: number;
  } | null>("deposit-data", () => null);

  const openDepositModal = (data?: {
    packageId?: string;
    serviceId?: string;
    amount?: number;
  }) => {
    depositData.value = data || null;
    useState("deposit-modal-open").value = true;
  };

  const closeDepositModal = () => {
    useState("deposit-modal-open").value = false;
    depositData.value = null;
  };

  return {
    user,
    setUser,
    clearUser,
    hasWallet,
    isCreateWalletModalOpen,
    openCreateWalletModal,
    closeCreateWalletModal,
    depositData,
    isDepositModalOpen: useState("deposit-modal-open", () => false),
    openDepositModal,
    closeDepositModal,
  };
};
