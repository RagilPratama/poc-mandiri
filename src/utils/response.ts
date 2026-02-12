export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  total?: number;
  error?: string;
  message?: string;
}

export const successResponse = <T>(data: T, total?: number): ApiResponse<T> => ({
  success: true,
  data,
  ...(total !== undefined && { total }),
});

export const errorResponse = (error: string, message?: string): ApiResponse => ({
  success: false,
  error,
  ...(message && { message }),
});
