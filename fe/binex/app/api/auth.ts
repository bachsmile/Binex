/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { LoginDto } from '~/types/payload/login';
import type { LoginResponse } from '~/types/response/auth';
import type { CreateAuthDto } from '~/types/payload/create-auth';
import type { RegisterResponse } from '~/types/response/auth';
import type { GenerateKeyDto } from '~/types/payload/generate-key';
import type { ActivateDto } from '~/types/payload/activate';
import type { RedeemKeyResponse } from '~/types/response/auth';

export const useAuthApi = () => {
  const api = useApi();
  return {
    ...api, // Giải nén để lấy sẵn 'call', 'loading', 'error'

    login: (payload: LoginDto) => 
      api.call<ApiResponse<LoginResponse>, ApiError>('/auth/login', 'POST', payload),

    register: (payload: CreateAuthDto) => 
      api.call<ApiResponse<RegisterResponse>, ApiError>('/auth/register', 'POST', payload),

    registerAd: (payload: CreateAuthDto) => 
      api.call<ApiResponse<RegisterResponse>, ApiError>('/auth/register-ad', 'POST', payload),

    generateKey: (payload: GenerateKeyDto) => 
      api.call<ApiResponse<string>, ApiError>('/auth/generate-key', 'POST', payload),

    activate: (payload: ActivateDto) => 
      api.call<ApiResponse<RedeemKeyResponse>, ApiError>('/auth/activate', 'POST', payload),

    getKeyInfo: (payload: string) => 
      api.call<ApiResponse<Object>, ApiError>(`/auth/key-info/${payload}`, 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/auth/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/auth/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/auth/${payload}`, 'DELETE'),

  };
};
