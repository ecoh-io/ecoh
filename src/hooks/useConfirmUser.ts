import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import axios from 'axios';
import { ConfirmUserRegistrationData } from '../types/confirm.data';
import { useAuthStore } from '../store/AuthStore';
import { confrimUser } from '../api/confirm.api';
import { AuthResponse } from '../types/auth.response';

/**
 * APIError interface represents the structure of error responses from the API.
 */
interface APIError {
  status: number;
  message: string;
}

/**
 * Transforms an Axios error into a standardized APIError.
 *
 * @param error - The error thrown by Axios.
 * @returns A standardized APIError object.
 */
const transformAxiosError = (error: unknown): APIError => {
  if (axios.isAxiosError(error)) {
    return {
      status: error.response?.status ?? 500,
      message:
        (error.response?.data as { message?: string })?.message ??
        'An unexpected error occurred.',
    };
  }

  return {
    status: 500,
    message: 'An unexpected error occurred.',
  };
};

/**
 * UseConfirmUserOptions interface extends the default UseMutationOptions
 * to provide more specific typing for the confirm user mutation.
 */
interface UseConfirmUserOptions
  extends UseMutationOptions<
    AuthResponse,
    APIError,
    ConfirmUserRegistrationData
  > {}

/**
 * Custom hook to handle user confirmation using React Query's useMutation.
 *
 * @param options - Optional React Query mutation options to customize behavior.
 * @returns The mutation object containing methods and states for the confirmation mutation.
 */
export const useConfirmUser = (
  options?: UseConfirmUserOptions,
): UseMutationResult<AuthResponse, APIError, ConfirmUserRegistrationData> => {
  const login = useAuthStore((state) => state.login);

  const mutation = useMutation<
    AuthResponse,
    APIError,
    ConfirmUserRegistrationData
  >({
    mutationFn: (formData: ConfirmUserRegistrationData) =>
      confrimUser(formData),

    onError: (error, variables, context) => {
      const apiError = transformAxiosError(error);

      console.error('Confirmation failed:', apiError);

      if (options?.onError) {
        options.onError(apiError, variables, context);
      }
    },

    onSuccess: async (data: AuthResponse, variables, context) => {
      try {
        await login(data.AccessToken, data.RefreshToken, data.user);

        console.log('User confirmed and logged in successfully:', data.user);
      } catch (error) {
        console.error('Login error:', error);
      }

      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },

    /**
     * Allows consumers to override or extend default mutation behaviors.
     * Spreading `options` after defining default handlers ensures
     * that user-provided handlers can override the defaults if necessary.
     */
    ...options,
  });

  return mutation;
};
