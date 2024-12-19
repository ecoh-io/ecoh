import { User } from '../interfaces/user';

export type AuthResponse = {
  tokens: {
    AccessToken: string;
    IdToken: string;
    RefreshToken: string;
  };
  user: User;
};
