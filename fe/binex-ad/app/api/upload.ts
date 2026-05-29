import type { ApiError } from '~/types/api-error';
import type { ApiResponse } from '~/types/api-response';

export interface UploadedFileItem {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

export const useUploadApi = () => {
  const api = useApi();
  return {
    ...api,

    uploadImages: (formData: FormData) =>
      api.call<ApiResponse<UploadedFileItem[]>, ApiError>('/upload/images', 'POST', formData),

    uploadVideos: (formData: FormData) =>
      api.call<ApiResponse<UploadedFileItem[]>, ApiError>('/upload/videos', 'POST', formData),
  };
};
