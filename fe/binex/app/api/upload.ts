/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';


export const useUploadApi = () => {
  const api = useApi();
  return {
    uploadImages: (payload: FormData) => 
      api.call<ApiResponse<any>, ApiError>('/upload/images', 'POST', payload),

    uploadVideos: (payload: FormData) => 
      api.call<ApiResponse<any>, ApiError>('/upload/videos', 'POST', payload),

  };
};
