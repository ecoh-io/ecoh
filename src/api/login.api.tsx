import { AuthData } from '../types/auth.data';
import { AuthResponse } from '../types/auth.response';
import axiosInstance from './axiosInstance';

/**
 * Sends registration data to the backend API.
 * @param formData - The form data collected during registration.
 * @returns The API response.
 */
export const loginUser = async (formData: AuthData): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    '/auth/login',
    formData,
    {
      headers: {
        skipAuthInterceptor: true,
      },
    },
  );
  return response.data;
};
