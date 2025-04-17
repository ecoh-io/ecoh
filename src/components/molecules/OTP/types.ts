import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface OTPProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  isNumeric?: boolean;
  isSecure?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  error?: string;
}
