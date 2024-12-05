import { LoginData } from '../types/login.data';
import { LoginResponse } from '../types/login.response';
import axiosInstance from './axiosInstance';

/**
 * Sends registration data to the backend API.
 * @param formData - The form data collected during registration.
 * @returns The API response.
 */
export const loginUser = async (
  formData: LoginData,
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
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
