import { Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { GestureHookResult } from '../types';

/**
 * Triggers subtle haptic feedback on long press.
 */
export const useLongPressFeedback = (): GestureHookResult => {
  const gesture = Gesture.LongPress()
    .minDuration(250)
    .runOnJS(true)
    .onStart(() => Haptics.selectionAsync());

  return { gesture };
};
