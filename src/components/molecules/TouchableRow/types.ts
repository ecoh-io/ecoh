import { Colors } from '@/src/shared/types/color';
import { Location } from '@/src/shared/types/location';

export interface TouchableRowProps {
  iconName: string;
  label: string;
  value: string | Record<string, string> | Location;
  onPress: () => void;
  colors: Colors;
  isLastItem?: boolean;
}
