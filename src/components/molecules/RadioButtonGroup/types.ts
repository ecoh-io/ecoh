import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface Option {
  label: string;
  value: string;
}

export interface RadioButtonGroupProps {
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  direction?: 'vertical' | 'horizontal';
  containerStyle?: StyleProp<ViewStyle>;
  error?: boolean;
  header?: string;
  headerStyle?: StyleProp<TextStyle>;
}
