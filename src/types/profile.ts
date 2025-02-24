import { Gender } from '../enums/gender.enum';
import { Location } from './location';

interface SocialLinksState {
  [platformKey: string]: string;
}

export type Profile = {
  bio: string | null;
  gender: Gender | null;
  socialLinks: SocialLinksState | null;
  location: Location | null;
  profilePictureUrl: string | null;
  city: string | null;
  region: string | null;
};
