import {
  ViewStyle,
  ScrollViewProps,
  KeyboardAvoidingViewProps,
} from 'react-native';
import { StatusBarProps } from 'expo-status-bar';
import { ExtendedEdge } from '@/src/utils/useSafeAreaInsetsStyle';

export type preset = 'fixed' | 'scroll' | 'auto';

export interface ScreenProps {
  children?: React.ReactNode;
  preset?: preset;
  scrollToggleThreshold?: { percent?: number; point?: number };
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: string;
  safeAreaEdges?: ExtendedEdge[];
  keyboardOffset?: number;
  scrollViewProps?: ScrollViewProps;
  keyboardShouldPersistTaps?: 'handled' | 'always' | 'never';
  statusBarStyle?: StatusBarProps['style'];
  StatusBarProps?: StatusBarProps;
  KeyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
}

export function isFixed(preset?: ScreenProps['preset']) {
  return !preset || preset === 'fixed';
}
