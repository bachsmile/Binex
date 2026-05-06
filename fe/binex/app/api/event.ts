/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { CreateEventDto } from '~/types/payload/event';

export const useEventApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateEventDto) => 
      api.call<any, ApiError>('/event', 'POST', payload),

    findAll: () => 
      api.call<any, ApiError>('/event', 'GET'),

    findOne: (payload: string) => 
      api.call<any, ApiError>(`/event/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<any, ApiError>(`/event/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<any, ApiError>(`/event/${payload}`, 'DELETE'),

    updateParticipants: () => 
      api.call<any, ApiError>(`/event/${payload}/participants`, 'PATCH'),

  };
};
