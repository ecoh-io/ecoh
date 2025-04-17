import { User } from '@/src/types/post';

export interface PostHeaderProps {
  user: User;
  timestamp: Date;
  onOptionsPress: () => void;
}
