import { Response } from 'express';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export const generateResponse = <T = any>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): void => {
  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data
  };

  res.status(statusCode).json(response);
};

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export const successResponse = <T>(data: T, message: string = 'Success'): APIResponse<T> => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message: string = 'Error', error?: string): APIResponse<null> => ({
  success: false,
  message,
  error,
});
