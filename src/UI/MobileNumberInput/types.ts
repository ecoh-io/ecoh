import { TextInput } from 'react-native';
import { TextInputProps, StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface MobileNumberInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  helperTextStyle?: StyleProp<TextStyle>;
  ref?: React.RefObject<TextInput>;
}
