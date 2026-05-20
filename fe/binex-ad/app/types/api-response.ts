export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface ApiListResponse<T> {
  status: boolean;
  message: string;
  data: T[];
  total: number;
}
