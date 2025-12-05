import { Gender } from '../enums/gender.enum';

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
