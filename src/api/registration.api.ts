import { RegisterResponse } from '../types';
import { AuthData } from '../types/auth.data';
import axiosInstance from './axiosInstance';

/**
 * Sends registration data to the backend API.
 * @param formData - The form data collected during registration.
 * @returns The API response.
 */
export const registerUser = async (
  formData: AuthData,
): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>(
    '/auth/register',
    formData,
    {
      headers: {
        skipAuthInterceptor: true,
      },
    },
  );
  return response.data;
};
