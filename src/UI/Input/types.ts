import { ComponentType } from 'react';
import { TextInput } from 'react-native';
import { TextInputProps, StyleProp, TextStyle, ViewStyle } from 'react-native';

interface InputAccessoryProps {
  style: StyleProp<any>;
  editable: boolean;
}

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  RightAccessory?: ComponentType<InputAccessoryProps>;
  LeftAccessory?: ComponentType<InputAccessoryProps>;
  secureTextEntryToggle?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  helperTextStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}
