export const useAuthModal = () => {
  const isOpen = useState('auth-modal-open', () => false);
  const mode = useState<'login' | 'register'>('auth-modal-mode', () => 'login');
  const message = useState('auth-modal-message', () => '');

  const openLogin = (msg: string = '') => {
    message.value = msg;
    mode.value = 'login';
    isOpen.value = true;
  };

  const openRegister = (msg: string = '') => {
    message.value = msg;
    mode.value = 'register';
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  return {
    isOpen,
    mode,
    message,
    openLogin,
    openRegister,
    close,
  };
};
