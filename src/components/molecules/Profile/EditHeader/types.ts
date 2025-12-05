import { Colors } from '@/src/shared/types/color';

export interface EditHeaderProps {
  title: string;
  colors: Colors;
  save?: () => void;
  isSaving?: boolean;
  isDisabled?: boolean;
}
