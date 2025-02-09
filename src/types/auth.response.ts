import { User } from '../interfaces/user';

export type AuthResponse = {
  AccessToken: string;
  IdToken: string;
  RefreshToken: string;
  user: User;
};
