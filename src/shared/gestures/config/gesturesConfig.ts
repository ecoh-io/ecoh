import { GestureConfig } from '../types';

/**
 * Global gesture defaults (can be overridden per-screen)
 */
export const defaultGesturesConfig: GestureConfig = {
  enableTapToDismiss: true,
  enableSwipeDownToClose: false,
  enableLongPressFeedback: false,
};
