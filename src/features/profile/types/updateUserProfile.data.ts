import { Gender } from '../../../shared/enums/gender.enum';
import { Location } from '../../../shared/types/location';

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
