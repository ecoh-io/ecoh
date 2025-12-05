import { GestureType } from 'react-native-gesture-handler';

export interface GestureConfig {
  /** Dismiss keyboard on background tap */
  enableTapToDismiss?: boolean;
  /** Allow swipe-down-to-close (useful for modals/sheets) */
  enableSwipeDownToClose?: boolean;
  /** Enable haptic long press feedback */
  enableLongPressFeedback?: boolean;
}

export interface GestureHookResult {
  gesture: GestureType;
}
