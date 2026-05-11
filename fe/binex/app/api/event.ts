/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateEventDto } from '~/types/payload/create-event';

export const useEventApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateEventDto) => 
      api.call<ApiResponse<any>, ApiError>('/event', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/event', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/event/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/event/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/event/${payload}`, 'DELETE'),

    updateParticipants: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/event/${payload}/participants`, 'PATCH'),

  };
};
