import { ExtendedEdge } from '@/src/utils/useSafeAreaInsetsStyle';
import { StatusBarProps } from 'expo-status-bar';
import { KeyboardAvoidingViewProps, StyleProp, ViewStyle } from 'react-native';

export interface BaseScreenProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  safeAreaEdges?: ExtendedEdge[];
  backgroundColor?: string;
  statusBarStyle?: 'light' | 'dark';
  keyboardOffset?: number;
  StatusBarProps?: StatusBarProps;
  KeyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
}
