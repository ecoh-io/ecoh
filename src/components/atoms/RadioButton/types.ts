import {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: (event: GestureResponderEvent) => void;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  iconName?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  error?: boolean;
}
