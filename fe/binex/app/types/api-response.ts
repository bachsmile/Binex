export interface ApiResponse<T> {
  statusCode: number;
  status: boolean;
  message: string;
  data: T;
}

export interface ApiListResponse<T> {
  statusCode: number;
  status: boolean;
  message: string;
  data: T[];
  total: number;
}
