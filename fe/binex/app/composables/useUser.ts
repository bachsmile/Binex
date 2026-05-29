import type { User } from "~/types/response/user";
import { useWalletApi } from "~/api/wallet";

export const useUser = () => {
  const user = useState<User | null>("user-info", () => null);
  const hasWallet = useState<boolean>("user-has-wallet", () => false);

  const isCreateWalletModalOpen = useState(
    "create-wallet-modal-open",
    () => false,
  );

  const checkUserWallet = async () => {
    if (!user.value) {
      hasWallet.value = false;
      return;
    }
    try {
      const walletApi = useWalletApi();
      const res = await walletApi.findMine();
      hasWallet.value = !!(res.status && Array.isArray(res.data) && res.data.length > 0);
    } catch (err) {
      console.error("[useUser] Failed to check wallet:", err);
      hasWallet.value = false;
    }
  };

  const setUser = (userData: User | null) => {
    user.value = userData;
    if (userData) {
      checkUserWallet();
    } else {
      hasWallet.value = false;
    }
  };

  const clearUser = () => {
    user.value = null;
    hasWallet.value = false;
  };

  const openCreateWalletModal = () => {
    isCreateWalletModalOpen.value = true;
  };

  const closeCreateWalletModal = () => {
    isCreateWalletModalOpen.value = false;
  };

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
