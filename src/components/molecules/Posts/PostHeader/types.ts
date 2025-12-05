import { User } from '@/src/shared/types/post';

export interface PostHeaderProps {
  user: User;
  timestamp: Date;
  onOptionsPress: () => void;
}
