import { ConfirmUserRegistrationData } from '../types/confirm.data';
import { ConfrimRegistrationResponse } from '../types/confirm.response';
import axiosInstance from './axiosInstance';

/**
 * Sends registration data to the backend API.
 * @param formData - The form data collected during registration.
 * @returns The API response.
 */
export const confrimUser = async (
  formData: ConfirmUserRegistrationData,
): Promise<ConfrimRegistrationResponse> => {
  const response = await axiosInstance.post<ConfrimRegistrationResponse>(
    '/auth/confirm-signup',
    formData,
    {
      headers: {
        skipAuthInterceptor: true,
      },
    },
  );
  return response.data;
};
