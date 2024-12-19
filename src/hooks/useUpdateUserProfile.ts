import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../store/AuthStore';
import { UpdateUserProfileResponse } from '../types/updateUserProfile.reposnse';
import { UpdateUserProfileData } from '../types/updateUserProfile.data';
import { updateUserProfile } from '../api/updateUserProfile.api';

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
interface UseUpdateUserProfileOptions
  extends UseMutationOptions<
    UpdateUserProfileResponse,
    APIError,
    UpdateUserProfileData
  > {}

/**
 * Custom hook to handle user profile updates using React Query's useMutation.
 *
 * @param options - Optional React Query mutation options to customize behavior.
 * @returns The mutation object containing methods and states for the login mutation.
 */
export const useUpdateUser = (
  id: string,
  options?: UseUpdateUserProfileOptions,
): UseMutationResult<
  UpdateUserProfileResponse,
  APIError,
  UpdateUserProfileData
> => {
  const authStore = useAuthStore();

  const mutation = useMutation<
    UpdateUserProfileResponse,
    APIError,
    UpdateUserProfileData
  >({
    mutationFn: (formData: UpdateUserProfileData) =>
      updateUserProfile(formData, id),

    onError: (error, variables, context) => {
      const apiError = transformAxiosError(error);
      if (options?.onError) {
        options.onError(apiError, variables, context);
      }
    },

    onSuccess: async (data: UpdateUserProfileResponse, variables, context) => {
      try {
        authStore.updateUserProfile(data);
      } catch (error) {
        console.error('Error during updating user information:', error);
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
