import { Gender } from '../enums/gender.enum';
import { Location } from '../types/location';

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
