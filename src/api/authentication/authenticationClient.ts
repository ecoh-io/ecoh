import { User } from '@/src/types/user';
import axiosInstance from '../axiosInstance';

export interface AuthenticationPayload {
  identifier: string;
  password: string;
  isEmail: boolean;
}

export interface AuthenticationResponse {
  AccessToken: string;
  IdToken: string;
  RefreshToken: string;
  user: User;
}

export interface ConfirmPayload {
  identifier: string;
  code: string;
  name: string;
  username: string;
  dateOfBirth: string;
  password: string;
}

export const loginUser = async (
  payload: AuthenticationPayload,
): Promise<AuthenticationResponse> => {
  const response = await axiosInstance.post<AuthenticationResponse>(
    '/auth/login',
    payload,
    {
      headers: {
        skipAuthInterceptor: true,
      },
    },
  );
  return response.data;
};

export const registerUser = async (
  payload: AuthenticationPayload,
): Promise<{ message: string }> => {
  const response = await axiosInstance.post<{ message: string }>(
    '/auth/register',
    payload,
    {
      headers: {
        skipAuthInterceptor: true,
      },
    },
  );
  return response.data;
};

export const confrimUser = async (
  payload: ConfirmPayload,
): Promise<AuthenticationResponse> => {
  const response = await axiosInstance.post<AuthenticationResponse>(
    '/auth/confirm',
    payload,
    {
      headers: {
        skipAuthInterceptor: true,
      },
    },
  );
  return response.data;
};
