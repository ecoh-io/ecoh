import { UserData } from '../store/localStorage';

export type AuthResponse = {
  tokens: {
    AccessToken: string;
    IdToken: string;
    RefreshToken: string;
  };
  user: UserData;
};
