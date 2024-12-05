import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import axios from 'axios';
import { loginUser } from '../api/login.api';
import { useAuthStore } from '../store/AuthStore';
import { router } from 'expo-router';
import { AuthResponse } from '../types/auth.response';
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
 * UseLoginUserOptions interface extends the default UseMutationOptions
 * to provide more specific typing for the login mutation.
 */
interface UseLoginUserOptions
  extends UseMutationOptions<AuthResponse, APIError, AuthData> {}

/**
 * Custom hook to handle user login using React Query's useMutation.
 *
 * @param options - Optional React Query mutation options to customize behavior.
 * @returns The mutation object containing methods and states for the login mutation.
 */
export const useLoginUser = (
  options?: UseLoginUserOptions,
): UseMutationResult<AuthResponse, APIError, AuthData> => {
  const login = useAuthStore((state) => state.login);

  const mutation = useMutation<AuthResponse, APIError, AuthData>({
    mutationFn: (formData: AuthData) => loginUser(formData),

    /**
     * Default onError handler to transform Axios errors to APIError.
     * Logs the error and invokes any user-provided onError handler.
     */
    onError: (error, variables, context) => {
      const apiError = transformAxiosError(error);

      // Log the error for debugging purposes
      console.error('Login failed:', apiError);

      // Invoke user-provided onError handler if it exists
      if (options?.onError) {
        options.onError(apiError, variables, context);
      }
    },

    /**
     * Default onSuccess handler.
     * Updates authentication state and navigates to the dashboard.
     * Invokes any user-provided onSuccess handler.
     */
    onSuccess: async (data: AuthResponse, variables, context) => {
      try {
        // Update authentication state with tokens and user data
        login(data.tokens.AccessToken, data.tokens.RefreshToken, data.user);

        // Navigate to the dashboard
        router.replace('/(tabs)/dashboard');
      } catch (error) {
        // Handle any errors that occur during state update or navigation
        console.error('Error during login success handling:', error);
      }

      // Invoke user-provided onSuccess handler if it exists
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
