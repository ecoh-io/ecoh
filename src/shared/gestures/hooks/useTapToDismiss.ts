import { Gesture } from 'react-native-gesture-handler';
import { Keyboard } from 'react-native';
import { GestureHookResult } from '../types';

/**
 * Dismisses the keyboard when the user taps anywhere outside input fields.
 */
export const useTapToDismiss = (): GestureHookResult => {
  const gesture = Gesture.Tap()
    .runOnJS(true)
    .onStart(() => Keyboard.dismiss());

  return { gesture };
};
