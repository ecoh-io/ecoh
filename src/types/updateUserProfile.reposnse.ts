import { Profile } from '../interfaces/profile';

export type UpdateUserProfileResponse = {
  id: string;
  cognitoId: string;
  username: string;
  name: string;
  email: string;
  mobile: string | null;
  dateOfBirth: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  profile: Profile; // Nested profile object
};
