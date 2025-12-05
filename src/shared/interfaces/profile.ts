import { Gender } from '../shared/enums/gender.enum';
import { Location } from '../shared/types/location';

export interface Profile {
  id: string;
  profilePictureUrl: string | null;
  bio: string | null;
  gender: Gender;
  links: Record<string, string> | null;
  location: Location | null;
  city: string | null;
  region: string | null;
  createdAt: string;
  updatedAt: string;
}
