import { useQuery } from '@tanstack/react-query';
import { checkUsername } from '@/src/features/authentication/registration/api/authenticationClient';

export const useUsernameAvailability = (username: string, enabled = true) => {
  return useQuery<boolean, Error>({
    queryKey: ['username-availability', username],
    queryFn: () => checkUsername(username),
    enabled: enabled && !!username && username.length >= 3, // only check if username is valid
    staleTime: 30 * 1000, // cache for 30 seconds
    retry: false,
  });
};
