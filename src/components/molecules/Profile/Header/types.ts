import { Colors } from '@/src/shared/types/color';

export interface ProfileHeaderProps {
  username: string;
  onEditPress: () => void;
  colors: Colors;
}
