import { Gender } from '../enums/gender.enum';
import { Location } from './location';

export type UpdateUserProfileData = {
  name?: string;
  username?: string;
  profilePictureUrl?: string;
  bio?: string;
  gender?: Gender;
  links?: Record<string, string> | null;
  location?: Location | null;
  city?: string | null;
  region?: string | null;
};
