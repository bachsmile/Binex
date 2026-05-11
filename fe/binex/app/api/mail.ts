/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { SubscribeMailDto } from '~/types/payload/subscribe-mail';
import type { MailSubscription } from '~/types/response/mail-subscription';
import type { SendTestMailDto } from '~/types/payload/send-test-mail';

export const useMailApi = () => {
  const api = useApi();
  return {
    subscribe: (payload: SubscribeMailDto) => 
      api.call<ApiResponse<MailSubscription>, ApiError>('/mail/subscribe', 'POST', payload),

    sendTestMail: (payload: SendTestMailDto) => 
      api.call<ApiResponse<any>, ApiError>('/mail/test', 'POST', payload),

  };
};
