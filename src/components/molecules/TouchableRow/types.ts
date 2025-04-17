import { Colors } from '@/src/types/color';
import { Location } from '@/src/types/location';

export interface TouchableRowProps {
  iconName: string;
  label: string;
  value: string | Record<string, string> | Location;
  onPress: () => void;
  colors: Colors;
  isLastItem?: boolean;
}
