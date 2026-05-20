import type { ApiError } from '~/types/api-error';
import type { ApiResponse } from '~/types/api-response';
import type { User } from '~/types/user';

export interface LoginResponseData {
  accessToken: string;
  user: User;
}

export const useAuthApi = () => {
  const api = useApi();
  return {
    ...api, // Unpack call, loading, error refs

    login: (payload: any) => 
      api.call<ApiResponse<LoginResponseData>, ApiError>('/auth/login', 'POST', payload),

    register: (payload: any) => 
      api.call<ApiResponse<User>, ApiError>('/auth/register', 'POST', payload),
  };
};
