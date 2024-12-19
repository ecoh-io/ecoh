import { Profile } from './profile';

export interface User {
  id: string;
  cognitoId: string;
  username: string;
  name: string;
  email: string;
  mobile: string | null;
  dateOfBirth: string; // ISO date string
  profile: Profile; // Nested profile object
}
