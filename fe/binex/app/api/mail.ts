/** Auto-generated API */
import type { ApiError } from '~/types/api-error';


export const useMailApi = () => {
  const api = useApi();
  return {
    sendTestMail: (payload: SendTestMailDto) => 
      api.call<any, ApiError>('/mail/test', 'POST', payload),

  };
};
