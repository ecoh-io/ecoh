import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import {
  AuthenticationPayload,
  AuthenticationResponse,
  ConfirmPayload,
  confrimUser,
  loginUser,
  registerUser,
} from './authenticationClient';
import { useAuthStore } from '@/src/store/AuthStore';
import {
  APIError,
  transformAxiosError,
} from '@/src/utils/axiosErrorTranformation';
import { useRouter } from 'expo-router';

interface UseLoginUserOptions
  extends UseMutationOptions<
    AuthenticationResponse,
    APIError,
    AuthenticationPayload
  > {}

export const useLoginUser = (
  options?: UseLoginUserOptions,
): UseMutationResult<
  AuthenticationResponse,
  APIError,
  AuthenticationPayload
> => {
  const authStore = useAuthStore();

  const mutation = useMutation<
    AuthenticationResponse,
    APIError,
    AuthenticationPayload
  >({
    mutationFn: (payload: AuthenticationPayload) => loginUser(payload),
    onSuccess: async (data: AuthenticationResponse) => {
      try {
        authStore.login(data.AccessToken, data.RefreshToken, data.user);
      } catch (error) {
        console.error('Error during login success handling:', error);
      }
    },
    onError: (error, variables, context) => {
      const apiError = transformAxiosError(error);
      if (options?.onError) {
        options.onError(apiError, variables, context);
      }
    },
  });

  return mutation;
};

interface UseRegisterUserOptions
  extends UseMutationOptions<
    { message: string },
    APIError,
    AuthenticationPayload
  > {}

export const useRegisterUser = (
  options?: UseRegisterUserOptions,
): UseMutationResult<{ message: string }, APIError, AuthenticationPayload> => {
  const mutation = useMutation<
    { message: string },
    APIError,
    AuthenticationPayload
  >({
    mutationFn: (payload: AuthenticationPayload) => registerUser(payload),
    onSuccess: async (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      const apiError = transformAxiosError(error);
      if (options?.onError) {
        options.onError(apiError, variables, context);
      }
    },
  });

  return mutation;
};

interface UseConfirmUserOptions
  extends UseMutationOptions<
    AuthenticationResponse,
    APIError,
    ConfirmPayload
  > {}

export const useConfirmUser = (
  options?: UseConfirmUserOptions,
): UseMutationResult<AuthenticationResponse, APIError, ConfirmPayload> => {
  const authStore = useAuthStore();
  const router = useRouter();

  const mutation = useMutation<
    AuthenticationResponse,
    APIError,
    ConfirmPayload
  >({
    mutationFn: (payload: ConfirmPayload) => confrimUser(payload),
    onSuccess: async (data: AuthenticationResponse) => {
      try {
        authStore.login(data.AccessToken, data.RefreshToken, data.user);
        router.push('/(app)/(tabs)/dashboard');
      } catch (error) {
        console.error('Error during login success handling:', error);
      }
    },
    onError: (error, variables, context) => {
      const apiError = transformAxiosError(error);
      if (options?.onError) {
        options.onError(apiError, variables, context);
      }
    },
  });

  return mutation;
};
