/** Kiểu dữ liệu lỗi chuẩn từ NestJS API */
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
