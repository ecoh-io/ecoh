import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { GestureHookResult } from '../types';

/**
 * Swipe-down gesture that calls an optional onClose callback (ideal for modals or sheets).
 */
export const useSwipeDownToClose = (
  onClose?: () => void,
): GestureHookResult => {
  const gesture = Gesture.Pan()
    .activeOffsetY(50)
    .runOnJS(true)
    .onEnd((e) => {
      if (e.translationY > 120 && onClose) {
        runOnJS(onClose)();
      }
    });

  return { gesture };
};
