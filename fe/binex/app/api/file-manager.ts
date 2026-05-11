/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';


export const useFileManagerApi = () => {
  const api = useApi();
  return {
    getMyFiles: () => 
      api.call<ApiResponse<any>, ApiError>('/file-manager/my-files', 'GET'),

    getStats: () => 
      api.call<ApiResponse<any>, ApiError>('/file-manager/stats', 'GET'),

    deleteFile: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/file-manager/${payload}`, 'DELETE'),

  };
};
