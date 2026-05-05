/** Auto-generated API */
import type { ApiError } from '~/types/api-error';


export const useFile-managerApi = () => {
  const api = useApi();
  return {
    getMyFiles: () => 
      api.call<any, ApiError>('/file-manager/my-files', 'GET'),

    getStats: () => 
      api.call<any, ApiError>('/file-manager/stats', 'GET'),

    deleteFile: () => 
      api.call<any, ApiError>('/file-manager/:id', 'DELETE'),

  };
};
