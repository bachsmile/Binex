import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';

export interface WeddingItem {
  id: string;
  name: string;
  description: string;
  groomName: string;
  groomPhone: string;
  fatherGroomName: string;
  motherGroomName: string;
  brideName: string;
  bridePhone: string;
  fatherBrideName: string;
  motherBrideName: string;
  weddingDate: string;
  inviteDate: string;
  ceremonyTime: string;
  venueName: string;
  venueAddress: string;
  inviteAddress: string;
  userId: string;
  status: string;
  qrCode: string;
  budget: number;
  guestCount: number;
  expireDays: number;
  note: string;
  images: string[];
  videos: string[];
  webId: string;
  cardId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  autoSend: boolean;
  isDeleted: boolean;
}

export const useWeddingApi = () => {
  const api = useApi();
  return {
    ...api,

    findAll: (payload?: { page?: number; limit?: number; search?: string; status?: string }) => 
      api.call<ApiListResponse<WeddingItem>, ApiError>('/wedding', 'GET', payload),

    findOne: (id: string) =>
      api.call<ApiResponse<WeddingItem>, ApiError>(`/wedding/${id}`, 'GET'),

    create: (payload: Partial<WeddingItem>) => 
      api.call<ApiResponse<WeddingItem>, ApiError>('/wedding', 'POST', payload),

    update: (id: string, payload: Partial<WeddingItem>) => 
      api.call<ApiResponse<WeddingItem>, ApiError>(`/wedding/${id}`, 'PATCH', payload),

    remove: (id: string) => 
      api.call<ApiResponse<WeddingItem>, ApiError>(`/wedding/${id}`, 'DELETE'),
  };
};
