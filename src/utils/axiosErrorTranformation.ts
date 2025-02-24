import axios from 'axios';

/**
 * APIError interface represents the structure of error responses from the API.
 */
export interface APIError {
  status: number;
  message: string;
}

/**
 * Transforms an Axios error into a standardized APIError.
 *
 * @param error - The error thrown by Axios.
 * @returns A standardized APIError object.
 */
export const transformAxiosError = (error: unknown): APIError => {
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
