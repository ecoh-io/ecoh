import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { RegisterResponse } from '../types';
import { registerUser } from '../api/registration.api';
import { AuthData } from '../types/auth.data';

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
 * UseRegisterUserOptions interface extends the default UseMutationOptions
 * to provide more specific typing for the registration mutation.
 */
interface UseRegisterUserOptions
  extends UseMutationOptions<RegisterResponse, APIError, AuthData> {}

/**
 * Custom hook to handle user registration using React Query's useMutation.
 *
 * @param options - Optional React Query mutation options to customize behavior.
 * @returns The mutation object containing methods and states for the registration mutation.
 */
export const useRegisterUser = (
  options?: UseRegisterUserOptions,
): UseMutationResult<RegisterResponse, APIError, AuthData> => {
  const mutation = useMutation<RegisterResponse, APIError, AuthData>({
    mutationFn: (formData: AuthData) => registerUser(formData),

    onError: (error, variables, context) => {
      const apiError = transformAxiosError(error);
      console.error('Registration failed:', apiError);
      if (options?.onError) {
        options.onError(apiError, variables, context);
      }
    },

    onSuccess: async (data, variables, context) => {
      try {
        console.log('Registration successful:', data);
      } catch (error) {
        // Handle any errors that occur during side effects
        console.error('Error during registration success handling:', error);
      }

      // Invoke user-provided onSuccess handler if it exists
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },

    /**
     * Spread the options to allow overriding defaults.
     * This provides flexibility for consumers to customize the mutation behavior.
     */
    ...options,
  });

  return mutation;
};
