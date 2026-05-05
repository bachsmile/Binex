/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { CreateEventDto } from '~/types/payload/event';
import type { UpdateEventDto } from '~/types/payload/event';

export const useEventApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateEventDto) => 
      api.call<any, ApiError>('/event', 'POST', payload),

    findAll: () => 
      api.call<any, ApiError>('/event', 'GET'),

    findOne: () => 
      api.call<any, ApiError>('/event/:id', 'GET'),

    update: (payload: UpdateEventDto) => 
      api.call<any, ApiError>('/event/:id', 'PATCH', payload),

    remove: () => 
      api.call<any, ApiError>('/event/:id', 'DELETE'),

  };
};
