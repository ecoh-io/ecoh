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
    /**
     * The mutation function that performs the registration API call.
     *
     * @param formData - The registration data submitted by the user.
     * @returns A promise resolving to the registration response.
     */
    mutationFn: (formData: AuthData) => registerUser(formData),

    /**
     * Default onError handler to transform Axios errors to APIError.
     * Logs the error and invokes any user-provided onError handler.
     *
     * @param error - The error thrown during the mutation.
     * @param variables - The variables passed to the mutation function.
     * @param context - The context returned from onMutate.
     */
    onError: (error, variables, context) => {
      const apiError = transformAxiosError(error);

      // Log the error for debugging purposes
      console.error('Registration failed:', apiError);

      // Invoke user-provided onError handler if it exists
      if (options?.onError) {
        options.onError(apiError, variables, context);
      }
    },

    /**
     * Default onSuccess handler.
     * Handles successful registration, such as navigating to a welcome page or logging in the user.
     * Invokes any user-provided onSuccess handler.
     *
     * @param data - The data returned from the mutation function.
     * @param variables - The variables passed to the mutation function.
     * @param context - The context returned from onMutate.
     */
    onSuccess: async (data, variables, context) => {
      try {
        // Example side effect: Navigate to a welcome page after successful registration
        // Replace this with your actual navigation logic
        // For instance, using react-router:
        // history.push('/welcome');

        // If using Expo Router, uncomment the following line and adjust the path as needed
        // router.replace('/welcome');

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
