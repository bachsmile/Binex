export const usePackageModal = () => {
  const isOpen = useState('package-modal-open', () => false);
  const currentStep = useState('package-modal-step', () => 1);
  const selectedPackage = useState<any>('package-modal-data', () => null);

  const open = (pack: any) => {
    selectedPackage.value = pack;
    currentStep.value = 1;
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
    setTimeout(() => {
      selectedPackage.value = null;
      currentStep.value = 1;
    }, 500);
  };

  const nextStep = () => {
    if (currentStep.value < 4) currentStep.value++;
  };

  const prevStep = () => {
    if (currentStep.value > 1) currentStep.value--;
  };

  return {
    isOpen,
    currentStep,
    selectedPackage,
    open,
    close,
    nextStep,
    prevStep
  };
};
