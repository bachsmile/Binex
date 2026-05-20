import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { User } from '~/types/user';

export const useUserApi = () => {
  const api = useApi();
  return {
    ...api, // Unpack call, loading, error refs

    findMine: (payload: any) => 
      api.call<ApiListResponse<User>, ApiError>('/user/mine', 'GET', payload),

    findAll: (payload: any) => 
      api.call<ApiListResponse<User>, ApiError>('/user', 'GET', payload),

    create: (payload: any) => 
      api.call<ApiResponse<User>, ApiError>('/user', 'POST', payload),
  };
};
