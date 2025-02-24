import { AuthResponse } from '../types/auth.response';
import { ConfirmUserRegistrationData } from '../types/confirm.data';
import axiosInstance from './axiosInstance';

/**
 * Sends registration data to the backend API.
 * @param formData - The form data collected during registration.
 * @returns The API response.
 */
export const confrimUser = async (
  formData: ConfirmUserRegistrationData,
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    '/auth/confirm',
    formData,
    {
      headers: {
        skipAuthInterceptor: true,
      },
    },
  );
  return response.data;
};
