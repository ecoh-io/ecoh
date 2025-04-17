import { Colors } from '@/src/types/color';

export interface ProfileHeaderProps {
  username: string;
  onEditPress: () => void;
  colors: Colors;
}
