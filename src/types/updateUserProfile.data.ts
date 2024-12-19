import { Gender } from '../enums/gender.enum';

export type UpdateUserProfileData = {
  name?: string;
  username?: string;
  profilePictureUrl?: string;
  bio?: string;
  gender?: Gender;
  links?: Record<string, string> | null;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  } | null;
  city?: string | null;
  region?: string | null;
};
