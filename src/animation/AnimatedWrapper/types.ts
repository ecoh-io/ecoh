import { ViewStyle, StyleProp } from 'react-native';
import { EasingFunction } from 'react-native-reanimated';

export type AnimationType =
  | 'fade-in'
  | 'slide-up'
  | 'scale-in'
  | 'rotate-in'
  | 'plus-to-cross'
  | 'fade-out'
  | 'slide-out'
  | 'scale-out'
  | 'rotate-out'
  | 'cross-to-plus'
  | 'pulse'
  | 'bounce'
  | 'floating';

export interface AnimatedWrapperProps {
  visible?: boolean;
  enterAnimation?: AnimationType;
  exitAnimation?: AnimationType;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  easing?: EasingFunction;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}
