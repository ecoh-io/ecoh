interface SocialLinksState {
  [platformKey: string]: string;
}

export type User = {
  id: string;
  cognitoId: string;
  username: string;
  displayName: string;
  email: string | null;
  mobile: string | null;
  dateOfBirth: Date;
  bio: string | null;
  gender: string | null;
  socialLinks: SocialLinksState | null;
  location: string | null;
  profileImage: string | null;
  connectionsCount: number;
  followersCount: number;
  followingCount: number;
};
