import { User } from './user';

export type AuthResponse = {
  tokens: {
    AccessToken: string;
    IdToken: string;
    RefreshToken: string;
  };
  user: User;
};
