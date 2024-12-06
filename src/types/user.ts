export type User = {
  id: string;
  cognitoId: string;
  username: string;
  displayName: string;
  email: string | null;
  mobile: string | null;
  dateOfBirth: Date;
  bio: string;
  profileImage: string;
  connectionsCount: number;
  followersCount: number;
  followingCount: number;
};
