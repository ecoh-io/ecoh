import { Profile } from './profile';

export type User = {
  id: string;
  username: string;
  name: string;
  email: string | null;
  mobile: string | null;
  dateOfBirth: Date;
  profile: Profile;
  connectionsCount: number;
  followersCount: number;
  followingCount: number;
};
