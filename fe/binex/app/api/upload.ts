/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';


export const useUploadApi = () => {
  const api = useApi();
  return {
    uploadImages: () => 
      api.call<ApiResponse<any>, ApiError>('/upload/images', 'POST'),

    uploadVideos: () => 
      api.call<ApiResponse<any>, ApiError>('/upload/videos', 'POST'),

  };
};
