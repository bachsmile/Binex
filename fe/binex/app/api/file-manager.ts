/** Auto-generated API */
import type { ApiError } from '~/types/api-error';


export const useFileManagerApi = () => {
  const api = useApi();
  return {
    getMyFiles: () => 
      api.call<any, ApiError>('/file-manager/my-files', 'GET'),

    getStats: () => 
      api.call<any, ApiError>('/file-manager/stats', 'GET'),

    deleteFile: (payload: string) => 
      api.call<any, ApiError>(`/file-manager/${payload}`, 'DELETE'),

  };
};
