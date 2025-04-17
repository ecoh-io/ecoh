import { ReactNode } from 'react';
import { PressableProps, ViewStyle, TextStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonShape = 'rounded' | 'pill' | 'square';
export type IconPosition = 'left' | 'right';

export interface ButtonProps extends PressableProps {
  title?: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  gradientColors?: [string, string, ...string[]];
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  labelStyle?: TextStyle;
  hapticFeedback?: boolean;
}
