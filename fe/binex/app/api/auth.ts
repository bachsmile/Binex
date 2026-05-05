/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { LoginDto } from '~/types/payload/auth';
import type { LoginResponse } from '~/types/response/auth';
import type { CreateAuthDto } from '~/types/payload/auth';
import type { RegisterResponse } from '~/types/response/auth';
import type { GenerateKeyDto } from '~/types/payload/auth';
import type { ActivateDto } from '~/types/payload/auth';
import type { RedeemKeyResponse } from '~/types/response/auth';
import type { UpdateAuthDto } from '~/types/payload/auth';

export const useAuthApi = () => {
  const api = useApi();
  return {
    login: (payload: LoginDto) => 
      api.call<LoginResponse, ApiError>('/auth/login', 'POST', payload),

    register: (payload: CreateAuthDto) => 
      api.call<RegisterResponse, ApiError>('/auth/register', 'POST', payload),

    registerAd: (payload: CreateAuthDto) => 
      api.call<RegisterResponse, ApiError>('/auth/register-ad', 'POST', payload),

    generateKey: (payload: GenerateKeyDto) => 
      api.call<string, ApiError>('/auth/generate-key', 'POST', payload),

    activate: (payload: ActivateDto) => 
      api.call<RedeemKeyResponse, ApiError>('/auth/activate', 'POST', payload),

    getKeyInfo: () => 
      api.call<Object, ApiError>('/auth/key-info/:key', 'GET'),

    findOne: () => 
      api.call<any, ApiError>('/auth/:id', 'GET'),

    update: (payload: UpdateAuthDto) => 
      api.call<any, ApiError>('/auth/:id', 'PATCH', payload),

    remove: () => 
      api.call<any, ApiError>('/auth/:id', 'DELETE'),

  };
};
